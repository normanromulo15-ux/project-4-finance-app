import express from "express";
import db from "../../config/db.js";
import { authenticateUser } from "../../common/middleware/jwt.js";

const router = express.Router();

// Add a transaction to a user's specified account type and then insert it to the user's balance
router.post("/:account", authenticateUser, async (req, res) => {
  try {
    const { sub } = req.user;

    const transactionAmount = Number(req.body.transactionAmount);
    const transactionId = crypto.randomUUID();
    const accountBalanceId = crypto.randomUUID();

    // Check if the amount value and type is valid
    if (transactionAmount <= 0 || typeof transactionAmount !== "number")
      return res.status(422).json({ message: "Unprocessable Content" });

    const accountTypes = ["savings", "eWallet", "cash"];
    const transactionTypes = ["deposit", "withdrawal"];

    const accountType = accountTypes.find((e) => e === req.params.account);
    const transactionType = transactionTypes.find(
      (e) => e === req.query.transactionType,
    );

    // Check if the account or transaction type are valid
    if (!accountType || !transactionType)
      return res.status(422).json({ message: "Unprocessable Content" });

    // Store the transaction amount to the transactions table
    const { rows: transactions } = await db.query(
      "INSERT INTO transactions (id, user_id, account, type, amount) VALUES ($1,$2,$3,$4,$5) RETURNING created_at",
      [transactionId, sub, accountType, transactionType, transactionAmount],
    );

    // Retrieve the transaction timestamp
    const transactionTimestamp = transactions[0].created_at;

    // Retrieve the previous balance entry of the user's account
    const { rows: accountBalance } = await db.query(
      "SELECT balance FROM accounts WHERE user_id = $1 AND account=$2 ORDER BY updated_at DESC LIMIT 1",
      [sub, accountType],
    );

    // If there is no any previous balance in that user's account, add the deposit amount directly to the balance
    if (accountBalance.length === 0 && transactionType === "deposit") {
      const newAccountBalance = transactionAmount;

      // Database query to insert the deposit amount to the database
      await db.query("INSERT INTO accounts VALUES ($1, $2, $3, $4, $5, $6)", [
        accountBalanceId,
        sub,
        accountType,
        newAccountBalance,
        null,
        transactionTimestamp,
      ]);

      return res
        .status(201)
        .json({ message: "Created initial balance for this account." });
    } else if (
      accountBalance.length === 0 ||
      transactionType === "withdrawal"
    ) {
      return res
        .status(422)
        .json({ message: "Insufficient funds to withdraw" });
    } else {
      // Retrieve the latest account balance of the user
      const previousAccountBalance = Number(accountBalance[0].balance);

      let newAccountBalance = 0;

      switch (transactionType) {
        /* If the transaction type is deposit, sum the previous balances and add the deposit amount to the database to reflect the new balance*/
        case "deposit":
          newAccountBalance = previousAccountBalance + transactionAmount;
          console.log(newAccountBalance);

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

        default:
          break;
      }
      res.status(201).json({ message: "Created" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
