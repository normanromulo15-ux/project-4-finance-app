import express from "express";
import crypto from "node:crypto";
import db from "../../database/db.js";
import { authenticateUser } from "../../common/middleware/jwt.js";
import { retrieveLatestBalance } from "../../common/middleware/retrieveLatestBalance.js";
import { transactionCategories } from "../../utils/constants.js";

const router = express.Router();

// Route to check whether a user is authenticated
router.get("/authentication", authenticateUser, async (_, res) => {
  res.sendStatus(200);
});

// Add a fund transfer from one account to another account
router.post("/transfer", authenticateUser, async (req, res) => {
  const client = await db.connect();
  try {
    const { sub: userId } = req.user;
    const {
      originAccount,
      destinationAccount,
      transferAmount,
      transferFeePercentage,
    } = req.body;

    const numericTransferAmount = Number(transferAmount);
    const numericTransferFeePercentage = Number(transferFeePercentage);

    // INVALIDATE THE REQUEST IF THE ORIGIN ACCOUNT IS THE SAME AS THE DESTINATION ACCOUNT
    if (originAccount === destinationAccount)
      return res.status(422).json({
        message: "Fund transfer must be done between two different accounts.",
      });

    // INVALIDATE THE REQUEST IF EITHER THE TRANSFER AMOUNT OR A NON-ZERO TRANSFER FEE PERCENTAGE IS NOT OF TYPE NUMBER.
    if (
      !numericTransferAmount ||
      (!numericTransferFeePercentage && numericTransferFeePercentage !== 0)
    )
      return res.status(422).json({ message: "Unprocessable Content" });

    const numericTransferFee =
      numericTransferAmount * numericTransferFeePercentage;

    const accountTypes = ["cash", "eWallet", "savings"];

    const senderAccount = accountTypes.find((e) => e === originAccount);
    const receiverAccount = accountTypes.find((e) => e === destinationAccount);

    // INVALIDATE THE REQUEST IF EITHER THE ORIGIN OR DESTINATION ACCOUNT IS  NOT A VALID ACCOUNT TYPE
    if (!senderAccount || !receiverAccount)
      return res.status(404).json({ message: "Account Not Found" });

    // INVALIDATE THE REQUEST IF THE TRANSFER AMOUNT IS LESS THAN OR EQUAL TO 0 OR IF THE TRANSFER FEE IS LESS THAN 0
    if (numericTransferAmount <= 0 || numericTransferAmount < 0)
      return res.status(422).json({ message: "Invalid fund transfer" });

    // Start a database connection
    await client.query("BEGIN");

    // RETRIEVE THE LATEST BALANCE OF THE ORIGIN ACCOUNT
    const { rows: senderAccountData } = await client.query(
      "SELECT balance FROM accounts WHERE user_id = $1 AND account = $2 ORDER BY updated_at DESC LIMIT 1",
      [userId, senderAccount],
    );

    // RETRIEVE THE LATEST BALANCE OF THE DESTINATION ACCOUNT
    const { rows: receiverAccountData } = await client.query(
      "SELECT balance FROM accounts WHERE user_id = $1 AND account = $2 ORDER BY updated_at DESC LIMIT 1",
      [userId, receiverAccount],
    );

    const senderAccountBalance = Number(senderAccountData[0].balance);
    const receiverAccountBalance = Number(receiverAccountData[0].balance);

    const totalTransferAmount = numericTransferAmount + numericTransferFee;

    // INVALIDATE THE REQUEST IF THE TOTAL TRANSFER AMOUNT IS GREATER THAN THE SENDER ACCOUNT BALANCE
    if (totalTransferAmount > senderAccountBalance)
      return res.status(422).json({ message: "Unsufficient funds" });

    const transferReferenceNumber = crypto
      .randomBytes(6)
      .toString("hex")
      .toUpperCase();

    // ADD THE FUND TRANSFER TO THE FUND TRANSFERS TABLE
    const { rows: fundTransferData } = await client.query(
      "INSERT INTO fund_transfers (user_id, reference_id, origin_account, destination_account, amount, transfer_fee) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING reference_id,amount, created_at",
      [
        userId,
        transferReferenceNumber,
        senderAccount,
        receiverAccount,
        numericTransferAmount,
        numericTransferFee,
      ],
    );

    // RETRIEVE THE RETURNED DATA FROM THE FUND TRANSFERS TABLE AFTER A SUCCESSFUL INSERTION
    const {
      reference_id: storedFundTransferReferenceId,
      amount: storedFundTransferAmount,
      created_at: storedFundTransferTimestamp,
    } = fundTransferData[0];

    // UPDATE THE SENDER AND THE RECEIVER ACCOUNTS AFTER A SUCCESSFUL FUND TRANSFER
    const newSenderAccountBalance = senderAccountBalance - totalTransferAmount;
    const newReceiverAccountBalance =
      receiverAccountBalance + numericTransferAmount;

    // UPDATE THE SENDER ACCOUNT BALANCE
    await client.query(
      "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, $2, $3, $4)",
      [
        userId,
        senderAccount,
        newSenderAccountBalance,
        storedFundTransferTimestamp,
      ],
    );

    // UPDATE THE RECEIVER ACCOUNT BALANCE
    await client.query(
      "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, $2, $3, $4)",
      [
        userId,
        receiverAccount,
        newReceiverAccountBalance,
        storedFundTransferTimestamp,
      ],
    );

    await client.query("COMMIT");

    res.status(201).json({
      storedFundTransferReferenceId,
      storedFundTransferAmount,
      storedFundTransferTimestamp,
    });
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Fund transfer failed" });
  } finally {
    client.release();
  }
});

// Add a daily interest based on the user's savings end-of-day balance
router.post("/interest", authenticateUser, async (req, res) => {
  const client = await db.connect();
  try {
    const { sub: userId } = req.user;

    // Retrieve the current timestamp object
    const currentTimestamp = new Date();

    // Retrieve the previous savings account of the user
    const { rows: previousSavingsBalanceData } = await client.query(
      "SELECT balance, updated_at FROM accounts WHERE account = 'savings' AND user_id = $1 ORDER BY updated_at DESC LIMIT 1",
      [userId],
    );

    // Invalidate the request if there is no initialized savings balance
    if (previousSavingsBalanceData.length === 0)
      return res.status(404).json({ message: "Savings account not found." });

    const {
      balance: previousSavingsBalance,
      updated_at: previousSavingsBalanceTimestamp,
    } = previousSavingsBalanceData[0];

    // Retrieve the date of the previous savings account balance
    const previousSavingsBalanceDate =
      previousSavingsBalanceTimestamp.toLocaleDateString("en-PH");

    // Retrieve the current date
    const currentDate = currentTimestamp.toLocaleDateString("en-PH");

    // Invalidate the request if the current date is the same to the previous savings balance date
    if (currentDate === previousSavingsBalanceDate) {
      return res
        .status(409)
        .json({ message: "Error in adding daily interest." });
    }

    const withHoldingTax = 0.2;
    const interestRate = 0.035 * (1 - withHoldingTax);
    const dailyInterestAmount =
      Number(previousSavingsBalance) * interestRate * (1 / 365);

    const newSavingsBalance =
      Number(previousSavingsBalance) + dailyInterestAmount;

    // Insert the daily interest amount to the interest_credits table
    await client.query(
      "INSERT INTO interest_credits (user_id, interest_amount, interest_date) VALUES ($1, $2, $3)",
      [userId, dailyInterestAmount, currentDate],
    );

    /* Insert the latest savings account balance to the accounts table, with the daily interest account already credited*/
    await client.query(
      "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, $2, $3, $4)",
      [userId, "savings", newSavingsBalance, currentTimestamp.toISOString()],
    );

    await client.query("COMMIT");

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    await client.query("ROLLBACK");
    res.sendStatus(500);
  } finally {
    client.release();
  }
});

// Retrieve all account transactions of a user
router.get("/transactions", authenticateUser, async (req, res) => {
  try {
    const { sub: userId } = req.user;
    const { page, account } = req.query;
    const pageNumber = Number(page) || 1;
    const entryLimit = 5;
    const offset = (pageNumber - 1) * entryLimit;
    const accounts = ["cash", "eWallet", "savings"];
    const selectedAccount = accounts.find((item) => item === account) || "all";

    // Invalidate the request if the page number is less than or equal to 0
    if (pageNumber <= 0) return res.sendStatus(404);

    // Retrieve all transaction history and count its number of entries if no account type is specified
    if (selectedAccount === "all") {
      const [
        allPaginatedTransactionsResponse,
        allPaginatedTransactionsResponseCount,
      ] = await Promise.all([
        db.query(
          "SELECT reference_id, account, type, amount, description, created_at FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
          [Number(userId), entryLimit, offset],
        ),
        db.query("SELECT COUNT(*) FROM transactions WHERE user_id = $1", [
          Number(userId),
        ]),
      ]);
      const { rows: allPaginatedTransactions } =
        allPaginatedTransactionsResponse;
      const { rows: allTransactionsCount } =
        allPaginatedTransactionsResponseCount;
      const totalTransactionsCount = allTransactionsCount[0].count;

      // Invalidate the request if there's no transaction history yet
      if (allPaginatedTransactions.length === 0) return res.sendStatus(404);

      return res.json({ allPaginatedTransactions, totalTransactionsCount });
    }

    // Retrieve the specific account's transaction history and its entry count if the account type is specified
    const [
      accountPaginatedTransactionsResponse,
      accountPaginatedTransactionsResponseCount,
    ] = await Promise.all([
      db.query(
        "SELECT reference_id, account, type, amount, description, created_at FROM transactions WHERE user_id = $1 AND account = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4",
        [Number(userId), selectedAccount, entryLimit, offset],
      ),
      db.query(
        "SELECT COUNT(*) FROM transactions WHERE user_id = $1 AND account = $2",
        [Number(userId), selectedAccount],
      ),
    ]);
    const { rows: accountPaginatedTransactions } =
      accountPaginatedTransactionsResponse;
    const { rows: accountPaginatedTransactionsCountArray } =
      accountPaginatedTransactionsResponseCount;
    const accountTransactionCount =
      accountPaginatedTransactionsCountArray[0].count;
    res.json({ accountPaginatedTransactions, accountTransactionCount });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Retrieve the full name of a logged-in user
router.get("/name", authenticateUser, async (req, res) => {
  try {
    const { sub: userId } = req.user;

    const { rows: userNames } = await db.query(
      "SELECT first_name, last_name FROM users WHERE id = $1",
      [userId],
    );

    // Invalidate the request if no user is found
    if (userNames.length === 0)
      return res.status(404).json({ message: "User not found" });

    const firstName = userNames[0].first_name;
    const lastName = userNames[0].last_name;

    //console.log(firstName, lastName);

    res.json({
      firstName: firstName
        .split(" ")
        .map((e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase())
        .join(" "),
      lastName: lastName
        .split(" ")
        .map((e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase())
        .join(" "),
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// Add a transaction to a user's specified account type and then insert it to the user's account balance
router.post("/transaction", authenticateUser, async (req, res) => {
  const client = await db.connect();
  try {
    const { sub: userId } = req.user;
    const { account, amount, category, description, type } = req.body;

    const transactionId = crypto.randomBytes(6).toString("hex").toUpperCase();
    const transactionAccount = account.trim();
    const transactionAmount = Number(amount);
    const transactionDescription = description.trim();

    const transactionCategory = transactionCategories.find(
      (e) => e === category,
    );

    // Invalidate the request if any of the body properties breaks the business logic
    if (
      transactionAmount <= 0 ||
      !transactionAmount ||
      !transactionCategory ||
      (transactionDescription.length === 0 &&
        transactionDescription.length > 50)
    )
      return res
        .status(422)
        .json({ message: "Request body properties are invalid." });

    const accountTypes = ["savings", "eWallet", "cash"];
    const transactionTypes = ["credit", "debit"];

    const accountType = accountTypes.find((e) => e === transactionAccount);
    const transactionType = transactionTypes.find((e) => e === type.trim());

    // Invalidate the request if either the string or the query parameter breaks the business logic
    if (!accountType || !transactionType)
      return res.status(422).json({ message: "Not Found" });

    // Start a database connection
    await client.query("BEGIN");

    // Retrieve the previous balance entry of the user's account
    const { rows: accountBalance } = await client.query(
      "SELECT balance FROM accounts WHERE user_id = $1 AND account= $2 ORDER BY updated_at DESC LIMIT 1",
      [userId, accountType],
    );

    // Retrieve the latest account balance of the user
    const previousAccountBalance = Number(accountBalance[0]?.balance) || 0;

    /* Invalidate the transaction request if the transaction type is withdrawal and if the transaction amount is greater than the previous account balance */
    if (
      transactionType === "debit" &&
      transactionAmount > previousAccountBalance
    )
      return res.status(422).json({
        message: "Insufficient funds to withdraw.",
      });

    // Store the transaction amount to the transactions table
    const { rows: transaction } = await client.query(
      "INSERT INTO transactions (user_id, reference_id, account, type, category, amount, description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING reference_id, amount,created_at",
      [
        userId,
        transactionId,
        accountType,
        transactionType,
        transactionCategory,
        transactionAmount,
        transactionDescription,
      ],
    );

    // Retrieve the transaction reference ID
    const transactionReferenceId = transaction[0].reference_id;

    // Retrieve the transaction amount
    const storedTransactionAmount = Number(transaction[0].amount);

    // Retrieve the transaction timestamp
    const transactionTimestamp = transaction[0].created_at;

    /* UPDATE THE ACCOUNT BALANCE 
    OF A USER
    */

    // If there is no any previous balance in that user's account, add the deposit amount directly to the balance
    if (previousAccountBalance === 0 && transactionType === "credit") {
      const newAccountBalance = transactionAmount;

      // Insert the new account balance to the accounts table
      await client.query(
        "INSERT INTO accounts (user_id, account, balance, updated_at ) VALUES ($1, $2, $3, $4)",
        [userId, accountType, newAccountBalance, transactionTimestamp],
      );

      await client.query("COMMIT");

      return res.status(201).json({
        storedTransactionAmount,
        transactionReferenceId,
        transactionTimestamp,
      });
    }

    let newAccountBalance;

    switch (transactionType) {
      /* If the transaction type is credit, sum the previous balances and add the deposit amount to the database to reflect the new balance*/
      case "credit":
        newAccountBalance = previousAccountBalance + transactionAmount;

        await client.query(
          "INSERT INTO accounts (user_id, account, balance, updated_at ) VALUES ($1, $2, $3, $4)",
          [userId, accountType, newAccountBalance, transactionTimestamp],
        );

        break;

      /* If the transaction type is debit, sum the previous balances and subtract the deposit amount to the database to reflect the new balance*/
      case "debit":
        newAccountBalance = previousAccountBalance - transactionAmount;

        await client.query(
          "INSERT INTO accounts (user_id, account, balance, updated_at ) VALUES ($1, $2, $3, $4)",
          [userId, accountType, newAccountBalance, transactionTimestamp],
        );

        break;
    }

    await client.query("COMMIT");

    res.status(201).json({
      storedTransactionAmount,
      transactionReferenceId,
      transactionTimestamp,
    });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Transaction failed" });
  } finally {
    client.release();
  }
});

// Retrieve the latest balance of a user's account
router.get(
  "/balance/:account",
  authenticateUser,
  retrieveLatestBalance,
  (req, res) => {
    const { accountType, latestAccountBalance, latestAccountBalanceTimestamp } =
      req;

    res.json({
      accountType,
      latestAccountBalance,
      latestAccountBalanceTimestamp,
    });
  },
);

// Retrieve the accrued daily interest of a user in his savings account
router.get("/interest/total", authenticateUser, async (req, res) => {
  try {
    const { sub: userId } = req.user;
    const { rows } = await db.query(
      "SELECT SUM(interest_amount) FROM interest_credits WHERE user_id = $1",
      [Number(userId)],
    );

    // Invalidate the request if there is no recorded interest
    if (!rows) return res.sendStatus(404);

    const totalEarnedInterest = rows[0].sum;

    res.json({ totalEarnedInterest });
  } catch (error) {
    res.sendStatus(500);
  }
});

// Retrieve the history of an account according to the specified period
router.get("/history/:account", authenticateUser, async (req, res) => {
  try {
    const { sub: userId } = req.user;
    const accountType = req.params.account;
    const selectedPeriod = req.query.period;

    const accounts = ["cash", "eWallet", "savings"];
    const periods = [
      {
        duration: "day",
        numberOfSeconds: 86.4e3,
      },
      {
        duration: "week",
        numberOfSeconds: 604.8e3,
      },
      {
        duration: "month",
        numberOfSeconds: 2.592e6,
      },
      {
        duration: "year",
        numberOfSeconds: 31.536e6,
      },
    ];
    const account = accounts.find((e) => e === accountType);
    const period = periods.find((e) => e.duration === selectedPeriod);

    // Invalidate the request if no account or no period is found
    if (!account || !period) return res.sendStatus(404);

    const { numberOfSeconds } = period;

    // Retrieve all balance history of an account
    const { rows } = await db.query(
      "SELECT id, balance, updated_at FROM accounts WHERE user_id = $1 AND account = $2 ORDER BY updated_at DESC",
      [Number(userId), account],
    );

    const balanceHistory = rows.map((e) => {
      return {
        ...e,
        updated_at: Math.floor(new Date(e.updated_at).valueOf() / 1e3),
      };
    });

    // Retrieve the latest balance unix timestamp in seconds
    const latestBalanceUnixTimeStamp = balanceHistory[0].updated_at;

    // Filter balances that are only covered within the specified period
    const periodBalances = balanceHistory.filter(
      (e) =>
        e.updated_at <= latestBalanceUnixTimeStamp &&
        e.updated_at >= latestBalanceUnixTimeStamp - numberOfSeconds,
    );

    // Format the filtered balance to a user-readable format
    const formattedPeriodBalances = periodBalances.map((e) => {
      return {
        ...e,
        updated_at: new Date(e.updated_at * 1e3),
      };
    });

    const numericBalances = formattedPeriodBalances.map((e) =>
      Number(e.balance),
    );

    // Compute the average balance over a specified period
    const averagePeriodBalance =
      numericBalances.reduce((a, b) => a + b, 0) / numericBalances.length;

    res.json({ averagePeriodBalance, formattedPeriodBalances });
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
