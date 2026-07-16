import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../common/middleware/jwt.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const router = express.Router();

app.use(cookieParser());

// POST auth/register
router.post("/register", async (req, res) => {
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
    return res.status(400).json({ message: "All fields are required" });

  // Check if the password meets the minimum length requirement
  if (password.length < 8)
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });

  try {
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
    const response = await db.query(
      "INSERT INTO users (id, email, last_name, first_name,birth_date, password) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, last_name, first_name",
      [
        userId,
        formattedEmail,
        formattedLastName,
        formattedFirstName,
        birth_date,
        hashedPassword,
      ],
    );

    res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
});

// POST auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const formattedEmail = email.trim().toLowerCase();

  try {
    const databaseResponse = await db.query(
      "SELECT id, email, password FROM users WHERE email=$1",
      [formattedEmail],
    );

    // Check if the user exists
    if (databaseResponse.rowCount === 0) return res.sendStatus(404);

    const userData = databaseResponse.rows;
    const { id, storedPassword } = userData;
    const isAuthorized = await bcrypt.compare(password, storedPassword);

    if (isAuthorized === true) {
      const payload = {
        sub: id,
      };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      res.cookie(refreshToken, refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken: accessToken });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
  }
});

export default router;
