import express from "express";
import db from "../../config/db.js";
import { authenticateUser } from "../../common/middleware/jwt.js";

const router = express.Router();

// Display the home page along with the respective current account balance
router.get("/:account", authenticateUser, async (req, res) => {
  try {
    const { sub } = req.user;

    let balance = 0;

    const accounts = ["savings", "eWallet", "cash"];

    // Check if the account type is valid
    const account = accounts.find((e) => e === req.params.account);
    if (!account)
      return res.status(422).json({ message: "Unprocessable Content" });

    const databaseResponse = await db.query(
      "SELECT amount FROM transactions WHERE user_id = $1 AND account = $2 AND type = $3 ",
      [sub, account, "deposit"],
    );

    // Check if the databaseResponse array is empty
    if (databaseResponse.rowCount === 0) return res.json({ balance });

    balance = databaseResponse.rows
      .map((e) => Number(e.amount))
      .reduce((a, b) => a + b);

    res.json({ balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a transaction to a specified account type
router.post("/:account", authenticateUser, async (req, res) => {
  try {
    const { sub } = req.user;

    const amount = Number(req.body.transactionAmount);
    const transactionId = crypto.randomUUID();

    // Check if the amount value and type is valid
    if (amount < 0 || typeof amount !== "number")
      return res.status(422).json({ message: "Unprocessable Content" });

    const accounts = ["savings", "eWallet", "cash"];
    const transactionTypes = ["deposit", "withdrawal"];

    const accountType = accounts.find((e) => e === req.params.account);
    const transactionType = transactionTypes.find(
      (e) => e === req.query.transactionType,
    );

    // Check if the account and transaction types are valid
    if (!accountType || !transactionType)
      return res.status(422).json({ message: "Unprocessable Content" });

    // Store the transaction to the database
    await db.query(
      "INSERT INTO transactions (id, user_id, account, type, amount) VALUES ($1,$2,$3,$4,$5)",
      [transactionId, sub, accountType, transactionType, amount],
    );

    res.status(201).json({ message: "Created" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
});

export default router;
