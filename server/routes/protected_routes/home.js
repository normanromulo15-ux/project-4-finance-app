import express from "express";
import { authenticateUser } from "../../common/middleware/jwt.js";

const router = express.Router();

// GET home/
router.get("/", authenticateUser, async (req, res) => {
  res.json(req.user);
});

// POST home/deposit
router.post("/deposit", authenticateUser, async (req, res) => {
  try {
    const accountType = req.query.accountType;
    const amount = Number(req.body.depositAmount);

    if (amount < 0 || typeof amount !== "number")
      return res.status(422).json({ message: "Unprocessable content." });

    res.json({
      message: `The amount you deposited in ${accountType} is PHP ${amount}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
