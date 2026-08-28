import db from "../../database/db.js";

// Middleware to retrieve a user's latest balance of an account
export async function retrieveLatestBalance(req, res, next) {
  try {
    const { sub: userId } = req.user;
    const { account } = req.params;

    const userAccount = account.trim();

    const accountTypes = ["savings", "eWallet", "cash"];
    const accountType = accountTypes.find((e) => e === userAccount);

    // Invalidate the request if the account type is invalid
    if (!accountType)
      return res.status(404).json({ message: "Account Not Found." });

    // Retrieve the latest balance from the database
    const { rows: balanceData } = await db.query(
      "SELECT balance, updated_at FROM accounts WHERE user_id = $1 AND account = $2 ORDER BY updated_at DESC LIMIT 1",
      [userId, accountType],
    );

    const latestAccountBalance = Number(balanceData[0]?.balance);
    const latestAccountBalanceTimestamp = balanceData[0]?.updated_at; // ISO 8601 format

    // Invalidate the request if the latest account balance or if the latest account balance date is falsy
    if (!latestAccountBalance || !latestAccountBalanceTimestamp)
      return res
        .status(400)
        .json({ message: "Account's balance not yet initialized." });

    req.accountType = accountType;
    req.latestAccountBalance = latestAccountBalance;
    req.latestAccountBalanceTimestamp = latestAccountBalanceTimestamp;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
