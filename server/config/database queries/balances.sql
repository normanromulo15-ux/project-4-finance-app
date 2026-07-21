-- RETRIEVE THE TABLE OF THE LATEST ACCOUNT BALANCE OF A USER

-- RETRIEVE THE LATEST ACCOUNT BALANCE OF A USER
SELECT accounts.account, accounts.balance, accounts.updated_at
FROM users
INNER JOIN accounts
ON users.id = accounts.user_id
WHERE accounts.account = $1
ORDER BY accounts.updated_at DESC
LIMIT 1