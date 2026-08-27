import bcrypt from "bcrypt";
import express from "express";
import db from "../../database/db.js";

import { authenticateUser } from "../../common/middleware/jwt.js";

const router = express.Router();

// Route to change user password
router.put("/password", authenticateUser, async (req, res) => {
  try {
    const { sub: userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    // Invalidate the request if the current input password is less than 8 characters long
    if (currentPassword.length < 8)
      return res.status(422).json({
        message: "Current password must be at least 8 characters long",
      });

    // Retrieve the user's current password from the database to compare with the provided current password
    const { rows: user } = await db.query(
      "SELECT password FROM users WHERE id = $1",
      [userId],
    );

    const storedPassword = user[0].password;

    // Compare the provided current password with the stored password
    const passwordMatch = await bcrypt.compare(currentPassword, storedPassword);

    // Invalidate the request if the provided current password does not match the stored password
    if (!passwordMatch)
      return res.status(422).json({ message: "Password does not match." });

    // Hash the new password before storing it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password using the newly provided hashed password
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedNewPassword,
      userId,
    ]);

    res.json({ message: "Password successfully changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to force log out if a user changes the password
router.delete("/logout", authenticateUser, async (req, res) => {
  try {
    const { sub: userId } = req.user;

    // Delete all refresh tokens associated to the user
    await db.query("DELETE FROM users WHERE user_id = $1 ", [userId]);

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
