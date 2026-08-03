import bcrypt from "bcrypt";
import express from "express";
import pg from "pg";

const router = express.Router();

// Route to edit user information

// Route to change user password
router.put("/password", async (req, res) => {
  console.log("Changing user password");
});
