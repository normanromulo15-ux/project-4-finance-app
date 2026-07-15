import express from "express";
import dotenv from "dotenv";
import db from "./database/db.js";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// GET route to check if the server is running
app.get("/", (_, res) => {
  res.json({ message: "Server is running" });
});

// POST route for user registration
app.post("/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
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
    await db.query(
      "INSERT INTO users (id, email, last_name, first_name,password) VALUES ($1,$2,$3,$4,$5) ",
      [
        userId,
        formattedEmail,
        formattedLastName,
        formattedFirstName,
        hashedPassword,
      ],
    );

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
});

// Listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
