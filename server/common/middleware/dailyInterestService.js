import db from "../../database/db.js";

// Function to calculate daily interest(s) based on the previous day's balance
export async function addDailyInterest(req, res, next) {
  const client = await db.connect();
  try {
    // Retrieve the user ID from the request object
    const userId = Number(req.user.sub);

    // Start a database connection
    await client.query("BEGIN");

    // Retrieve the user's latest savings account interest date from the database
    const { rows } = await client.query(
      `SELECT MAX (interest_date) AS latest_interest_date
      FROM interest_credits
      WHERE user_id = $1`,
      [userId],
    );
    const latestInterestCreditDate =
      rows[0]?.latest_interest_date.toISOString();

    // If there is no latest interest credit date, return a 404 status code indicating that the savings account timestamp was not found
    if (!latestInterestCreditDate) {
      await client.query("ROLLBACK");
      return res.sendStatus(404);
    }

    // Calculate the number of elapsed days between the latest balance date and the current date
    const { rows: elapsedDaysData } = await client.query(
      `SELECT ((NOW() AT TIME ZONE 'Asia/Manila')::date - (interest_date)::date) AS elapsed_days
      FROM interest_credits
      WHERE user_id = $1
      ORDER BY interest_date DESC
      LIMIT 1`,
      [userId],
    );
    const numberOfElapsedDays = elapsedDaysData[0].elapsed_days;

    // If there are days that have passed since the last balance update, calculate and add interest for each day
    if (numberOfElapsedDays >= 1) {
      let i = 1;
      while (i <= numberOfElapsedDays) {
        const latestInterestCreditTime = new Date(
          latestInterestCreditDate,
        ).getTime();

        // Define the value of the Date constructor for every interest credit entry to be added to the database
        const creditDateValue = latestInterestCreditTime + i * 8.64e7;

        // Retrieve the timestamp in ISO format for every interest credit entry to be added to the database
        const creditISOTimestamp = new Date(creditDateValue).toISOString();

        // Calculate the date for the interest credit based on the current time and the number of days passed
        const creditDate = new Date(creditDateValue).toLocaleDateString(
          "en-PH",
          { timeZone: "Asia/Manila" },
        );

        // Define the daily interest rate of the savings account
        const dailyInterestRate = 0.028; // 2.8% net annual interest rate

        // Retrieve the current balance from the database for the user's savings account
        const { rows: latestSavingsBalanceData } = await client.query(
          `SELECT balance
          FROM accounts 
          WHERE user_id = $1 AND account = 'savings'
          ORDER BY updated_at DESC
          LIMIT 1`,
          [userId],
        );
        const { balance: latestSavingsBalance } = latestSavingsBalanceData[0];

        // Calculate the daily interest based on the current balance and the daily interest rate
        const dailyInterest =
          Number(latestSavingsBalance) * (dailyInterestRate / 365);

        // Calculate the new balance by adding the daily interest to the current balance
        const newSavingsBalance = Number(latestSavingsBalance) + dailyInterest;

        // Add the daily interest to the interest table in the database
        await client.query(
          "INSERT INTO interest_credits (user_id, interest_amount, interest_date) VALUES ($1, $2, $3)",
          [userId, dailyInterest, creditDate],
        );

        // Add the new savings account balance to the accounts table in the database
        await client.query(
          "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, 'savings', $2, $3)",
          [userId, newSavingsBalance, creditISOTimestamp],
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
