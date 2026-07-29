import express from "express";
import bcrypt from "bcrypt";
import db from "../../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/middleware/jwt.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";

dotenv.config();

const router = express.Router();

// Create a new user
router.post("/register", async (req, res) => {
  try {
    const { email, firstName, lastName, birth_date, password } = req.body;
    const userId = crypto.randomUUID();
    const formattedEmail = email.trim().toLowerCase();
    const formattedFirstName = firstName
      .trim()
      .split(" ")
      .map((e) => e.trim().toUpperCase())
      .join(" ");
    const formattedLastName = lastName
      .trim()
      .split(" ")
      .map((e) => e.trim().toUpperCase())
      .join(" ");

    // Check if all required fields are provided
    if (!email || !firstName || !lastName || !password)
      return res.status(422).json({ message: "All fields are required" });

    // Check if the password meets the minimum length requirement
    if (password.length < 8)
      return res
        .status(422)
        .json({ message: "Password must be at least 8 characters long" });

    // Check if the user already exists in the database
    const existingUser = await db.query(
      "SELECT email FROM users WHERE email = $1",
      [email],
    );
    if (existingUser.rowCount > 0)
      return res.status(409).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the new user to the database
    await db.query(
      "INSERT INTO users (id, email, last_name, first_name,birth_date, password) VALUES ($1,$2,$3,$4,$5,$6)",
      [
        userId,
        formattedEmail,
        formattedLastName,
        formattedFirstName,
        birth_date,
        hashedPassword,
      ],
    );

    res.status(201).json({ message: "Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login an existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const formattedEmail = email.trim().toLowerCase();

    // Check if all inputs are filled or if the input password meets the minimum string length
    if (!email || !password || password.length < 8)
      return res.status(422).json({ message: "Unprocessable Content" });

    const databaseResponse = await db.query(
      "SELECT id, email, password FROM users WHERE email=$1",
      [formattedEmail],
    );

    // Check if the user exists
    if (databaseResponse.rowCount === 0)
      return res.status(404).json({ message: "Not Found" });

    const { id, password: storedPassword } = databaseResponse.rows[0];

    const isAuthorized = await bcrypt.compare(password, storedPassword);

    if (isAuthorized) {
      const payload = {
        sub: id,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const { iat, exp } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      const tokenIssuedDate = new Date(Number(iat) * 1000).toISOString();
      const tokenExpiryDate = new Date(Number(exp) * 1000).toISOString();

      await db.query(
        "INSERT INTO refresh_tokens (token,user_id, created_at, expires_at) VALUES ($1, $2, $3, $4)",
        [hashedRefreshToken, id, tokenIssuedDate, tokenExpiryDate],
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.json({ accessToken });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Generate a new access token
router.get("/refresh", (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const payload = {
      sub: decoded.sub,
    };

    const newAccessToken = generateAccessToken(payload);
    res.json({ newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Logout an existing user
router.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    await db.query("DELETE FROM refresh_tokens WHERE token=$1", [
      hashedRefreshToken,
    ]);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
