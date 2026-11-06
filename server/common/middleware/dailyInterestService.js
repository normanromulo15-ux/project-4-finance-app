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
    const { rows: latestInterestDateData } = await client.query(
      `SELECT MAX (interest_date)::TEXT AS date
      FROM interest_credits
      WHERE user_id = $1`,
      [userId],
    );

    // Retrieve the user's latest savings account timestamp in case for first-time depositors
    const { rows: latestSavingsAccountTimestampData } = await client.query(
      `SELECT (updated_at AT TIME ZONE 'Asia/Manila')::DATE::TEXT AS date
      FROM accounts
      WHERE user_id = $1 AND account = 'savings'
      ORDER BY updated_at DESC, id DESC
      LIMIT 1`,
      [userId],
    );

    const latestInterestCreditDate =
      latestInterestDateData[0]?.date ??
      latestSavingsAccountTimestampData[0]?.date;

    // If there is no latest interest credit date, return a 404 status code indicating that the savings account timestamp was not found
    if (!latestInterestCreditDate) {
      await client.query("ROLLBACK");
      return res.sendStatus(404);
    }

    // Calculate the number of elapsed days between the latest interest credit date and the current date
    const { rows: elapsedDaysData } = await client.query(
      `SELECT ((NOW() AT TIME ZONE 'Asia/Manila')::DATE - (interest_date)::DATE) AS elapsed_days
      FROM interest_credits
      WHERE user_id = $1
      ORDER BY interest_date DESC
      LIMIT 1`,
      [userId],
    );
    let elapsedDays = elapsedDaysData[0]?.elapsed_days;

    /* If the query returns null or undefined for first-time depositors, re-assign the value of elapsedDays in terms of the last timestamp of the savings account*/
    if (elapsedDays === null || elapsedDays === undefined) {
      const { rows: elapsedDaysData } = await client.query(
        `SELECT ((NOW() AT TIME ZONE 'Asia/Manila')::DATE - ($1)::DATE) AS elapsed_days`,
        [latestInterestCreditDate],
      );
      elapsedDays = elapsedDaysData[0].elapsed_days;
    }

    // If there are days that have passed since the last balance update, calculate and add interest for each day
    if (elapsedDays >= 1) {
      // Initialize the number of days to be credited
      let days = 1;

      // Retrieve the timestamp in ISO format for every interest credit entry to be added to the database
      const nowISOTimestamp = new Date().toISOString();

      // Define the daily interest rate of the savings account
      const dailyInterestRate = 0.028; // 2.8% net annual interest rate

      // Retrieve the current balance from the database for the user's savings account
      const { rows: latestSavingsBalanceData } = await client.query(
        `SELECT balance AS savings_balance
          FROM accounts 
          WHERE user_id = $1 AND account = 'savings'
          ORDER BY updated_at DESC, id DESC
          LIMIT 1`,
        [userId],
      );
      const { savings_balance } = latestSavingsBalanceData[0];
      let latestSavingsBalance = savings_balance;

      while (days <= elapsedDays) {
        // Retrieve the date for the interest credit based on the current time and the number of days passed
        const { rows: creditDateData } = await client.query(
          "SELECT ($1::DATE + $2::INT)::DATE AS interest_date",
          [latestInterestCreditDate, days],
        );
        const creditDate = creditDateData[0].interest_date;

        // Calculate the daily interest based on the current balance and the daily interest rate
        const dailyInterest =
          Number(latestSavingsBalance) * (dailyInterestRate / 365);

        // Calculate the new balance by adding the daily interest to the current balance
        const newSavingsBalance = Number(latestSavingsBalance) + dailyInterest;
        latestSavingsBalance = newSavingsBalance;

        // Add the daily interest to the interest table in the database
        await client.query(
          "INSERT INTO interest_credits (user_id, interest_amount, interest_date) VALUES ($1, $2, $3)",
          [userId, dailyInterest, creditDate],
        );

        // Add the new savings account balance to the accounts table in the database
        await client.query(
          "INSERT INTO accounts (user_id, account, balance, updated_at) VALUES ($1, 'savings', $2, $3)",
          [userId, newSavingsBalance, nowISOTimestamp],
        );

        days++;
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
