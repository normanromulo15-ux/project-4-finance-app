-- Query to retrieve the total expense for the current month of the year
SELECT COALESCE(SUM(amount), 0) AS monthly_expense
FROM transactions
WHERE user_id = 1 
AND account IN ('cash', 'eWallet')
AND type = 'debit'
AND created_at >= DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Manila')
AND created_at < (DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Manila') + INTERVAL '1 month')

-- Query to retrieve the total income for the current month of the year
SELECT COALESCE(SUM(amount), 0) AS monthly_income
FROM transactions
WHERE user_id = 1 
AND account IN ('cash', 'eWallet')
AND type = 'credit'
AND created_at >= DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Manila')
AND created_at < (DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Manila') + INTERVAL '1 month')

-- Query to retrieve the total interest in the current month of the year
SELECT COALESCE(SUM(interest_amount),0) AS monthly_interest_earned
FROM interest_credits
WHERE user_id = 1
AND interest_date >= DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Manila')::DATE
AND interest_date < DATE_TRUNC('month', CURRENT_TIMESTAMP, 'Asia/Manila')::DATE + INTERVAL '1 month'

