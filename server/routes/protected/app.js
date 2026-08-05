// Dependencies
import express from "express";
import crypto from "node:crypto";

// Module imports
import db from "../../config/db.js";
import { authenticateUser } from "../../common/middleware/jwt.js";
import { retrieveLatestBalance } from "../../common/middleware/retrieveLatestBalance.js";

const router = express.Router();

// Add a daily interest based on the user's savings end-of-day balance
router.post(
  "/interest/:account",
  authenticateUser,
  retrieveLatestBalance,
  async (req, res) => {
    try {
      const { sub: userId } = req.user;
      const {
        accountType: savings,
        latestAccountBalance: latestSavingsBalance,
        latestAccountBalanceDate: latestSavingsBalanceDate,
      } = req;

      // Invalidate the request if the account type is not savings
      if (savings !== "savings")
        return res.status(404).json({ message: "Invalid Account" });

      const formattedPreviousBalanceDate = new Date(
        latestSavingsBalanceDate,
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
      const transactionType = "credit";
      const transactionDescription = `Interest credit for ${dailyInterestDate}.`;

      // Invalidate the request if the daily interest has already been credited for the day
      if (formattedPreviousBalanceDate === dailyInterestDate)
        return res.status(409).json({
          message: "Error in adding interest.",
        });

      // Add the daily interest in the transactions table
      const { rows: transaction } = await db.query(
        "INSERT INTO transactions (user_id, reference_id,account,type,amount,description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING created_at",
        [
          userId,
          transactionId,
          savings,
          transactionType,
          dailyInterest,
          transactionDescription,
        ],
      );

      // Retrieve the transaction timestamp
      const transactionTimestamp = transaction[0].created_at;

      // Update the savings account balance of the user stored in the database
      const newSavingsBalance = Number(latestSavingsBalance) + dailyInterest;

      await db.query(
        "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, $2, $3, $4)",
        [userId, savings, newSavingsBalance, transactionTimestamp],
      );

      res.status(201).json({
        message: `Created daily interest credit for ${dailyInterestDate}`,
        daily_interest: dailyInterest,
        daily_interest_timestamp: `${dailyInterestDate}, 12:00 AM`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
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
      "SELECT reference_id,type, amount, description, created_at FROM transactions WHERE user_id = $1 AND account = $2 ORDER BY created_at DESC",
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
        created_at: new Date(e.created_at).toLocaleString(),
      };
    });

    res.json(formattedTransactionRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a transaction to a user's specified account type and then insert it to the user's balance
router.post("/:account", authenticateUser, async (req, res) => {
  try {
    const { sub: userId } = req.user;

    const transactionId = crypto.randomBytes(6).toString("hex").toUpperCase();
    const transactionAmount = Number(req.body?.transactionAmount);
    const transactionDescription = req.body?.transactionDescription.trim();

    // Check if the amount value or type or  if the transaction description's length is valid
    if (
      transactionAmount <= 0 ||
      !transactionAmount ||
      (transactionDescription.length === 0 &&
        transactionDescription.length > 50)
    )
      return res
        .status(422)
        .json({ message: "Request properties are invalid." });

    const accountTypes = ["savings", "eWallet", "cash"];
    const transactionTypes = ["credit", "debit"];

    const accountType = accountTypes.find(
      (e) => e === req.params.account.trim(),
    );
    const transactionType = transactionTypes.find(
      (e) => e === req.query.transactionType,
    );

    // Check if the account or transaction type are valid
    if (!accountType || !transactionType)
      return res.status(404).json({ message: "Not Found" });

    // Retrieve the previous balance entry of the user's account
    const { rows: accountBalance } = await db.query(
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
    const { rows: transaction } = await db.query(
      "INSERT INTO transactions (user_id, reference_id, account, type, amount, description) VALUES ($1,$2,$3,$4,$5,$6) RETURNING reference_id, created_at",
      [
        userId,
        transactionId,
        accountType,
        transactionType,
        transactionAmount,
        transactionDescription,
      ],
    );

    // Retrieve the transaction reference ID
    const transactionReferenceId = transaction[0].reference_id;

    // Retrieve the transaction timestamp
    const transactionTimestamp = transaction[0].created_at;

    // Update the savings account balance of the user

    // If there is no any previous balance in that user's account, add the deposit amount directly to the balance
    if (previousAccountBalance === 0 && transactionType === "credit") {
      const newAccountBalance = transactionAmount;

      // Insert the new account balance to the accounts table
      await db.query(
        "INSERT INTO accounts (user_id, account, balance, updated_at ) VALUES ($1, $2, $3, $4)",
        [userId, accountType, newAccountBalance, transactionTimestamp],
      );

      return res.status(201).json({
        message: `Created initial balance for the ${accountType} account.`,
        transaction_reference_id: transactionReferenceId,
        transaction_timestamp: transactionTimestamp.toLocaleString(),
      });
    } else {
      let newAccountBalance;

      switch (transactionType) {
        /* If the transaction type is credit, sum the previous balances and add the deposit amount to the database to reflect the new balance*/
        case "credit":
          newAccountBalance = previousAccountBalance + transactionAmount;

          await db.query(
            "INSERT INTO accounts (user_id, account, balance, updated_at ) VALUES ($1, $2, $3, $4)",
            [userId, accountType, newAccountBalance, transactionTimestamp],
          );

          break;

        /* If the transaction type is debit, sum the previous balances and subtract the deposit amount to the database to reflect the new balance*/
        case "debit":
          newAccountBalance = previousAccountBalance - transactionAmount;

          await db.query(
            "INSERT INTO accounts (user_id, account, balance, updated_at ) VALUES ($1, $2, $3, $4)",
            [userId, accountType, newAccountBalance, transactionTimestamp],
          );

          break;
      }
      res.status(201).json({
        message: `Created new transaction for the ${accountType} account.`,
        transaction_reference_id: transactionReferenceId,
        transaction_timestamp: transactionTimestamp.toLocaleString(),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Retrieve the latest balance of a user's account
router.get("/:account", authenticateUser, retrieveLatestBalance, (req, res) => {
  const { accountType, latestAccountBalance, latestAccountBalanceDate } = req;

  // Create a new instance to format the account balance in Philippine standards
  const phpFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  const displayAccountBalance = phpFormatter.format(latestAccountBalance);

  res.json({
    account_type: accountType,
    display_account_balance: displayAccountBalance,
    balance_timestamp: latestAccountBalanceDate.toLocaleString(),
  });
});

export default router;
