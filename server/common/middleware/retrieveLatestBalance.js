import db from "../../database/db.js";
import redisClient from "../../redis.js";

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

    req.accountType = accountType;

    // Retrieve the cache for the latest account balance and timestamp
    let latestAccountBalance = await redisClient.get(
      `latest${accountType}Balance`,
    );
    let latestAccountBalanceTimestamp = await redisClient.get(
      `latest${accountType}Timestamp`,
    );

    // Query the database if the cache for the latest account balance and timestamp don't exist yet
    if (
      latestAccountBalance === null ||
      latestAccountBalanceTimestamp === null
    ) {
      // Retrieve the latest balance from the database
      const { rows: balanceData } = await db.query(
        "SELECT balance, updated_at::TEXT FROM accounts WHERE user_id = $1 AND account = $2 ORDER BY updated_at DESC LIMIT 1",
        [userId, accountType],
      );

      latestAccountBalance = Number(balanceData[0]?.balance);
      latestAccountBalanceTimestamp = balanceData[0]?.updated_at; // ISO 8601 format

      // Invalidate the request if the latest account balance or if the latest account balance date is falsy
      if (!latestAccountBalance || !latestAccountBalanceTimestamp) {
        return res
          .status(404)
          .json({ message: "Account's balance not yet initialized." });
      }

      // Set the cache for the latest account balance and the account balance timestamp
      await redisClient.set(
        `latest${accountType}Balance`,
        String(latestAccountBalance),
        { EX: 3600 },
      );
      await redisClient.set(
        `latest${accountType}Timestamp`,
        latestAccountBalanceTimestamp,
        { EX: 3600 },
      );
    }

    req.latestAccountBalance = Number(latestAccountBalance);
    req.latestAccountBalanceTimestamp = latestAccountBalanceTimestamp;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
