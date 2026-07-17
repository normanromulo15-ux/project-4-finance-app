import express from "express";
import { authenticateUser } from "../../common/middleware/jwt.js";

const router = express.Router();

// GET home/
router.get("/", authenticateUser, async (_, res) => {
  res.json({ message: "Hello! This is a protected route." });
});

export default router;
