import express from "express";
import bcrypt from "bcrypt";
import db from "../../database/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/middleware/jwt.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { months } from "../../utils/constants.js";

dotenv.config();

const router = express.Router();

// Create a new user
router.post("/register", async (req, res) => {
  try {
    const { email, firstName, lastName, birthDate, password } = req.body;
    const { birthMonth, birthDay, birthYear } = birthDate;
    const formattedBirthMonth =
      months.findIndex((month) => month.value === birthMonth) + 1;
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
    const formattedBirthDate = `${birthYear}-${formattedBirthMonth}-${birthDay}`;

    // Check if all required fields are provided
    if (
      !birthMonth ||
      !birthDay ||
      !birthYear ||
      !email ||
      !firstName ||
      !lastName ||
      !password
    )
      return res.status(422).json({ errorMessage: "All fields are required" });

    // Check if the password meets the minimum length requirement
    if (password.length < 8)
      return res
        .status(422)
        .json({ errorMessage: "Password must be at least 8 characters long" });

    // Check if the user already exists in the database
    const existingUser = await db.query(
      "SELECT email FROM users WHERE email = $1",
      [formattedEmail],
    );
    if (existingUser.rowCount === 1)
      return res.status(409).json({ errorMessage: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add the new user to the database
    const { rows: newUserData } = await db.query(
      "INSERT INTO users (public_id, email, last_name, first_name,birth_date, password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id",
      [
        userId,
        formattedEmail,
        formattedLastName,
        formattedFirstName,
        formattedBirthDate,
        hashedPassword,
      ],
    );

    // Get the new user ID from the database to be put as a payload
    const newUserId = newUserData[0].id;
    const payload = { sub: newUserId };

    // Create access and refresh tokens for the new authenticated user
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex")
      .toUpperCase();

    const { iat, exp } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const tokenIssuedDate = new Date(Number(iat) * 1000).toISOString();
    const tokenExpiryDate = new Date(Number(exp) * 1000).toISOString();

    await db.query(
      "INSERT INTO refresh_tokens (user_id,token, created_at, expires_at) VALUES ($1, $2, $3, $4)",
      [newUserId, hashedRefreshToken, tokenIssuedDate, tokenExpiryDate],
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

// Login an existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const formattedEmail = email.trim().toLowerCase();

    // Check if all inputs are filled or if the input password meets the minimum string length
    if (!formattedEmail || !password || password.length < 8)
      return res.status(422).json({ errorMessage: "Invalid input." });

    // Retrieve the data of the user from the database based on the provided email
    const { rows: userData } = await db.query(
      "SELECT id, email, password FROM users WHERE email=$1",
      [formattedEmail],
    );

    // Check if the user exists
    if (userData.length === 0)
      return res.status(404).json({ errorMessage: "User does not exist." });

    const { id: userId, password: storedPassword } = userData[0];

    const isAuthorized = await bcrypt.compare(password, storedPassword);

    if (isAuthorized) {
      const payload = {
        sub: userId,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      const hashedRefreshToken = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex")
        .toUpperCase();

      const { iat, exp } = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      const tokenIssuedDate = new Date(Number(iat) * 1000).toISOString();
      const tokenExpiryDate = new Date(Number(exp) * 1000).toISOString();

      await db.query(
        "INSERT INTO refresh_tokens (user_id,token, created_at, expires_at) VALUES ($1, $2, $3, $4)",
        [userId, hashedRefreshToken, tokenIssuedDate, tokenExpiryDate],
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      return res.json({ accessToken });
    }
    res.status(401).json({ errorMessage: "Unauthorized" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
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
    res.status(401).json({ errorMessage: "Invalid refresh token" });
  }
});

// Logout an existing user
router.delete("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // Invalidate the request if the refresh token is missing
    if (!refreshToken)
      return res.status(401).json({ errorMessage: "Invalid refresh token" });

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex")
      .toUpperCase();

    // DELETE THE REFRESH TOKEN FROM THE DATABASE AND RESTART THE NUMBERING OF ITS ID
    await db.query("DELETE FROM refresh_tokens WHERE token=$1", [
      hashedRefreshToken,
    ]);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

export default router;
