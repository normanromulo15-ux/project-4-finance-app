import express from "express";
import crypto from "node:crypto";
import db from "../../database/db.js";
import { authenticateUser } from "../../common/middleware/jwt.js";
import { retrieveLatestBalance } from "../../common/middleware/retrieveLatestBalance.js";
import { transactionCategories } from "../../utils/transactionCategories.js";

const router = express.Router();

// Add a fund transfer from one account to another account
router.post("/transfer", authenticateUser, async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

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
      "INSERT INTO fund_transfers (user_id, reference_id, origin_account, destination_account, amount, transfer_fee) VALUES ($1, $2, $3, $4, $5, $6 ) RETURNING created_at",
      [
        userId,
        transferReferenceNumber,
        senderAccount,
        receiverAccount,
        numericTransferAmount,
        numericTransferFee,
      ],
    );

    // RETRIEVE THE FUND TRANSFER TIMESTAMP
    const fundTransferTimestamp = fundTransferData[0].created_at;

    // UPDATE THE SENDER AND THE RECEIVER ACCOUNTS AFTER A SUCCESSFUL FUND TRANSFER
    const newSenderAccountBalance = senderAccountBalance - totalTransferAmount;
    const newReceiverAccountBalance =
      receiverAccountBalance + numericTransferAmount;

    // UPDATE THE SENDER ACCOUNT BALANCE
    await client.query(
      "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, $2, $3, $4)",
      [userId, senderAccount, newSenderAccountBalance, fundTransferTimestamp],
    );

    // UPDATE THE RECEIVER ACCOUNT BALANCE
    await client.query(
      "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, $2, $3, $4)",
      [
        userId,
        receiverAccount,
        newReceiverAccountBalance,
        fundTransferTimestamp,
      ],
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: `Fund transfer of PHP ${numericTransferAmount} from ${senderAccount} to ${receiverAccount} successful.`,
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
router.post(
  "/interest/:account",
  authenticateUser,
  retrieveLatestBalance,
  async (req, res) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const { sub: userId } = req.user;
      const {
        accountType: savingsAccount,
        latestAccountBalance: latestSavingsBalance,
        latestAccountBalanceTimestamp: latestSavingsBalanceTimestamp,
      } = req;

      // Invalidate the request if the account type is not savings
      if (savingsAccount !== "savings")
        return res.status(422).json({ message: "Invalid Account" });

      const formattedPreviousBalanceDate = new Date(
        latestSavingsBalanceTimestamp,
      ).toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const dailyInterestDate = new Date().toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const dailyInterestRate = 0.035;
      const withholdingTaxRate = 0.2;
      const dailyInterest =
        latestSavingsBalance *
        dailyInterestRate *
        (1 - withholdingTaxRate) *
        (1 / 365);

      const transactionId = crypto.randomBytes(6).toString("hex").toUpperCase();
      const transactionDescription = `Interest credit for ${dailyInterestDate}.`;

      // Invalidate the request if the daily interest has already been credited for the day
      if (formattedPreviousBalanceDate === dailyInterestDate)
        return res.status(409).json({
          message: "Error in adding interest.",
        });

      // Add the daily interest in the transactions table
      const { rows: transaction } = await client.query(
        "INSERT INTO transactions (user_id, reference_id,account,type,category,amount,description) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING created_at",
        [
          userId,
          transactionId,
          savingsAccount,
          "credit",
          "Financial",
          dailyInterest,
          transactionDescription,
        ],
      );

      // Retrieve the transaction timestamp
      const transactionTimestamp = transaction[0].created_at;

      // Compute the new savings balance of the user
      const newSavingsBalance = Number(latestSavingsBalance) + dailyInterest;

      // Update the savings account balance of the user stored in the database
      await client.query(
        "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, $2, $3, $4)",
        [userId, savingsAccount, newSavingsBalance, transactionTimestamp],
      );

      await client.query("COMMIT");

      res.status(201).json({
        message: `Created daily interest credit for ${dailyInterestDate}`,
        dailyInterest: `PHP ${dailyInterest.toFixed(2)}`,
        dailyInterestTimestamp: `${dailyInterestDate}, 12:00 AM`,
      });
    } catch (error) {
      console.error(error);
      await client.query("ROLLBACK");
      res.status(500).json({ message: "Internal Server Error" });
    } finally {
      client.release();
    }
  },
);

// Retrieve the history of a user's transactions
router.get("/transactions/:account", authenticateUser, async (req, res) => {
  try {
    const { sub: userId } = req.user;

    const accountTypes = ["savings", "eWallet", "cash"];
    const accountType = accountTypes.find((e) => e === req.params.account);

    // Invalidate the request if the account type  is undefined
    if (!accountType)
      return res.status(404).json({ message: "Account Not Found" });

    // Retrieve the transaction history of an account according the specified span
    const { rows: transactionRecords } = await db.query(
      "SELECT reference_id,type, amount,category, description, created_at FROM transactions WHERE user_id = $1 AND account = $2 ORDER BY created_at DESC",
      [userId, accountType],
    );

    // Tell the user that there's no initial balance yet if the transaction records is empty
    if (transactionRecords.length === 0)
      return res.json({
        message: "No balance yet in this account.",
      });

    // Create a new instance to format the account balances in Philippine standards
    const phpFormatter = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    });

    // Modify each amount element in the transaction records by formatting it in Philippine currency
    const formattedTransactionRecords = transactionRecords.map((e) => {
      let displayAmount = phpFormatter.format(e.amount);
      switch (e.type) {
        case "credit":
          displayAmount = `+${displayAmount}`;
          break;

        case "debit":
          displayAmount = `-${displayAmount}`;
          break;
      }

      return {
        ...e,
        amount: displayAmount,
        created_at: new Date(e.created_at).toLocaleString("en-PH", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }),
      };
    });

    res.json(formattedTransactionRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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
    await client.query("BEGIN");

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
      "INSERT INTO transactions (user_id, reference_id, account, type, category, amount, description) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING reference_id, created_at",
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
        message: `Created initial balance for the ${accountType} account.`,
        transactionReferenceId,
        transactionTimestamp: transactionTimestamp.toLocaleString(),
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
  "/balances/:account",
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

export default router;
