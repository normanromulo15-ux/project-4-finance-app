import express from "express";
import dotenv from "dotenv";
import db from "./database/db.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Express middleware to parse JSON request bodies
app.use(express.json());

// Listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
