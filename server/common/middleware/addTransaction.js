import db from "../../config/db.js";

// Middleware to add a transaction to the database
async function addTransaction(req, res, next) {
  try {
    console.log("Hello World");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
