import express from "express";
import db from "../../config/db.js";
import { authenticateUser } from "../../common/middleware/jwt.js";

const router = express.Router();

// Display the home page along with the respective current account balances
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { payload } = req.user;

    res.json({ message: "Ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a transaction to a specified account type
router.post("/:account", authenticateUser, async (req, res) => {
  try {
    const amount = Number(req.body.depositAmount);
    const accountType = req.params.account;
    const { transactionType } = req.query;

    const { payload } = req.user;

    const transactionId = crypto.randomUUID();

    // Check if the amount value and type is valid
    if (amount < 0 || typeof amount !== "number")
      return res.status(422).json({ message: "Unprocessable Content" });

    const accounts = ["savings", "eWallet", "cash"];

    // Check if the account type is valid
    if (accounts.includes(accountType))
      return res.status(422).json({ message: "Unprocessable Content" });

    // Store the transaction to the database
    await db.query(
      "INSERT INTO transactions (id, user_id, account, type, amount) VALUES ($1,$2,$3,$4,$5)",
      [transactionId, payload.sub, accountType, transactionType, amount],
    );

    res.status(201).json({ message: "Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
