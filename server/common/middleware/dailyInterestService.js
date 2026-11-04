import db from "../../database/db.js";

// Function to calculate daily interest(s) based on the previous day's balance
export async function addDailyInterest(req, res, next) {
  const client = await db.connect();
  try {
    // Retrieve the user ID from the request object
    const userId = Number(req.user.sub);

    // Start a database connection
    await client.query("BEGIN");

    // Query to retrieve the latest savings account data of the user from the database
    const selectQuery = `SELECT balance, updated_at
      FROM accounts
      WHERE user_id = $1 AND account = 'savings'
      ORDER BY updated_at DESC
      LIMIT 1`;

    // Retrieve the user's latest savings account timestamp from the database
    const { rows } = await client.query(selectQuery, [userId]);
    const { updated_at: latestBalanceTimestamp } = rows[0];

    // Retrieve the current time in milliseconds since epoch
    const currentTime = new Date().getTime();

    // Retrieve the time in milliseconds since epoch from the latest balance data
    const latestBalanceTime = new Date(
      latestBalanceTimestamp.toLocaleDateString("en-PH"),
    ).getTime();

    // Calculate the number of days between the latest balance date and the current date
    const numberOfCreditDays = Math.floor(
      (currentTime - latestBalanceTime) / (1000 * 60 * 60 * 24),
    );

    // If there are days that have passed since the last balance update, calculate and add interest for each day
    if (numberOfCreditDays >= 1) {
      let i = 0;
      while (i < numberOfCreditDays) {
        // Retrieve the current timestamp in ISO format
        const currentISODate = new Date().toISOString();

        // Calculate the date for the interest credit based on the current time and the number of days passed
        const creditDate = new Date(
          currentTime + i * 8.64e7,
        ).toLocaleDateString("en-PH");

        // Define the daily interest rate of the savings account
        const dailyInterestRate = 0.028; // 2.8% net annual interest rate

        // Retrieve the current balance from the database for the user's savings account
        const { rows: currentBalanceData } = await client.query(selectQuery, [
          userId,
        ]);
        const { balance: currentBalance } = currentBalanceData[0];

        // Calculate the daily interest based on the current balance and the daily interest rate
        const dailyInterest =
          Number(currentBalance) * (dailyInterestRate / 365);

        // Compute the new balance by adding the daily interest to the current balance
        const newBalance = Number(currentBalance) + dailyInterest;

        // Add the daily interest to the interest table in the database
        await client.query(
          "INSERT INTO interest_credits (user_id, interest_amount, interest_date) VALUES ($1, $2, $3)",
          [userId, dailyInterest, creditDate],
        );

        // Add the new savings account balance to the accounts table in the database
        await client.query(
          "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, 'savings', $2, $3)",
          [userId, newBalance, currentISODate],
        );

        i++;
      }
    }
    // Commit the transaction to the database
    await client.query("COMMIT");
  } catch (error) {
    console.error(error);
    // Rollback the transaction in case of an error
    await client.query("ROLLBACK");
    return res.sendStatus(500);
  } finally {
    client.release();
  }
  next();
}
