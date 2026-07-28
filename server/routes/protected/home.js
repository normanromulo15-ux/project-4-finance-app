import express from "express";
import db from "../../config/db.js";
import { authenticateUser } from "../../common/middleware/jwt.js";

const router = express.Router();

// Retrieve the latest balance of a user's account
router.get("/:account", authenticateUser, async (req, res) => {
  try {
    const { sub } = req.user;

    const accountTypes = ["savings", "eWallet", "cash"];
    const accountType = accountTypes.find((e) => e === req.params.account);

    // Invalidate the request if the account type does not exist
    if (!accountType) return res.status(404).json({ message: "Not Found." });

    // Retrieve the latest balance from the database
    const { rows: account } = await db.query(
      "SELECT balance FROM accounts WHERE user_id = $1 AND account = $2 ORDER BY updated_at DESC LIMIT 1",
      [sub, accountType],
    );
    const latestAccountBalance = Number(account[0]?.balance) || null;

    // Invalidate the request if the latest account balance is null
    if (!latestAccountBalance)
      return res
        .status(404)
        .json({ message: "Account's balance not yet initialized." });

    // Create a new instance to format the account balance in Philippine standards
    const phpFormatter = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    });

    const displayAccountBalance = phpFormatter.format(latestAccountBalance);

    res.json({
      accountType,
      displayAccountBalance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a transaction to a user's specified account type and then insert it to the user's balance
router.post("/:account", authenticateUser, async (req, res) => {
  try {
    const { sub } = req.user;

    const transactionId = crypto.randomUUID();
    const transactionAmount = Number(req.body.transactionAmount);
    const transactionDescription = req.body.transactionDescription.trim();

    const accountBalanceId = crypto.randomUUID();

    // Check if the amount value or type AND if the transaction description's length is valid
    if (
      transactionAmount <= 0 ||
      typeof transactionAmount !== "number" ||
      transactionDescription.length > 50
    )
      return res.status(422).json({ message: "Unprocessable Content" });

    const accountTypes = ["savings", "eWallet", "cash"];
    const transactionTypes = ["deposit", "withdrawal"];

    const accountType = accountTypes.find((e) => e === req.params.account);
    const transactionType = transactionTypes.find(
      (e) => e === req.query.transactionType,
    );

    // Check if the account or transaction type are valid
    if (!accountType || !transactionType)
      return res.status(404).json({ message: "Not Found" });

    // Retrieve the previous balance entry of the user's account
    const { rows: accountBalance } = await db.query(
      "SELECT balance FROM accounts WHERE user_id = $1 AND account= $2 ORDER BY updated_at DESC LIMIT 1",
      [sub, accountType],
    );

    // Retrieve the latest account balance of the user
    const previousAccountBalance = Number(accountBalance[0]?.balance) || 0;

    /* Invalidate the transaction request if the transaction type is withdrawal and if the transaction amount is greater than the previous account balance */
    if (
      transactionType === "withdrawal" &&
      transactionAmount > previousAccountBalance
    )
      return res.status(422).json({
        message: "Insufficient funds to withdraw.",
      });

    // Store the transaction amount to the transactions table
    const { rows: transaction } = await db.query(
      "INSERT INTO transactions (id, user_id, account, type, amount, description) VALUES ($1,$2,$3,$4,$5,$6) RETURNING created_at",
      [
        transactionId,
        sub,
        accountType,
        transactionType,
        transactionAmount,
        transactionDescription,
      ],
    );

    // Retrieve the transaction timestamp
    const transactionTimestamp = transaction[0].created_at;

    // If there is no any previous balance in that user's account, add the deposit amount directly to the balance
    if (previousAccountBalance === 0 && transactionType === "deposit") {
      const newAccountBalance = transactionAmount;
      console.log(`Latest balance of ${accountType}: ${newAccountBalance}`);

      // Insert the new account balance to the accounts table
      await db.query("INSERT INTO accounts VALUES ($1, $2, $3, $4, $5, $6)", [
        accountBalanceId,
        sub,
        accountType,
        newAccountBalance,
        null,
        transactionTimestamp,
      ]);

      return res.status(201).json({
        message: `Created initial balance for the ${accountType} account.`,
        transactionTimestamp,
      });
    } else {
      let newAccountBalance;

      switch (transactionType) {
        /* If the transaction type is deposit, sum the previous balances and add the deposit amount to the database to reflect the new balance*/
        case "deposit":
          newAccountBalance = previousAccountBalance + transactionAmount;
          console.log(`Latest balance of ${accountType}: ${newAccountBalance}`);

          await db.query(
            "INSERT INTO accounts VALUES ($1, $2, $3, $4, $5, $6)",
            [
              accountBalanceId,
              sub,
              accountType,
              newAccountBalance,
              null,
              transactionTimestamp,
            ],
          );

          break;

        /* If the transaction type is withdrawal, sum the previous balances and subtract the deposit amount to the database to reflect the new balance*/
        case "withdrawal":
          newAccountBalance = previousAccountBalance - transactionAmount;
          console.log(`Latest balance of ${accountType}: ${newAccountBalance}`);

          await db.query(
            "INSERT INTO accounts VALUES ($1, $2, $3, $4, $5, $6)",
            [
              accountBalanceId,
              sub,
              accountType,
              newAccountBalance,
              null,
              transactionTimestamp,
            ],
          );

          break;
      }
      res.status(201).json({
        message: `Created new transaction for the ${accountType} account.`,
        transactionTimestamp,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
