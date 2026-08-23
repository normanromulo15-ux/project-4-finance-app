-- INSERT A CATEGORY COLUMN TO THE TRANSACTIONS TABLE
ALTER TABLE transactions
ADD COLUMN category VARCHAR(20);

-- TRANSACTION 1
UPDATE transactions
SET category = 'Financial'
WHERE id = 1;

-- TRANSACTION 2
UPDATE transactions
SET category = 'Financial'
WHERE id = 2;

-- TRANSACTION 3
UPDATE transactions
SET category = 'Financial'
WHERE id = 3;

-- TRANSACTION 4
UPDATE transactions
SET category = 'Financial'
WHERE id = 4;

-- TRANSACTION 5
UPDATE transactions
SET category = 'Financial'
WHERE id = 5;

-- TRANSACTION 6
UPDATE transactions
SET category = 'Financial'
WHERE id = 6;

-- TRANSACTION 7
UPDATE transactions
SET category = 'Financial'
WHERE id = 7;

-- TRANSACTION 8
UPDATE transactions
SET category = 'Financial'
WHERE id = 8;

-- TRANSACTION 9
UPDATE transactions
SET category = 'Financial'
WHERE id = 9;

-- TRANSACTION 10
UPDATE transactions
SET category = 'Transportation'
WHERE id = 10;

-- TRANSACTION 11
UPDATE transactions
SET category = 'Transportation'
WHERE id = 11;

-- TRANSACTION 12
UPDATE transactions
SET category = 'Transportation'
WHERE id = 12;

-- TRANSACTION 13
UPDATE transactions
SET category = 'Food'
WHERE id = 13;

-- TRANSACTION 14
UPDATE transactions
SET category = 'Social'
WHERE id = 14;

-- TRANSACTION 15
UPDATE transactions
SET category = 'Financial'
WHERE id = 15;

-- TRANSACTION 16
UPDATE transactions
SET category = 'Financial'
WHERE id = 16;

-- TRANSACTION 17
UPDATE transactions
SET category = 'Financial'
WHERE id = 17;

-- TRANSACTION 18
UPDATE transactions
SET category = 'Financial'
WHERE id = 18;

-- TRANSACTION 19
UPDATE transactions
SET category = 'Financial'
WHERE id = 19;

-- TRANSACTION 20
UPDATE transactions
SET category = 'Leisure'
WHERE id = 20;

-- TRANSACTION 21
UPDATE transactions
SET category = 'Financial'
WHERE id = 21;

-- TRANSACTION 22
UPDATE transactions
SET category = 'Financial'
WHERE id = 22;

-- TRANSACTION 23
UPDATE transactions
SET category = 'Financial'
WHERE id = 23;

-- TRANSACTION 24
UPDATE transactions
SET category = 'Work'
WHERE id = 24;

-- TRANSACTION 25
UPDATE transactions
SET category = 'Financial'
WHERE id = 25;

-- TRANSACTION 26
UPDATE transactions
SET category = 'Financial'
WHERE id = 26;

-- TRANSACTION 27
UPDATE transactions
SET category = 'Financial'
WHERE id = 27;

-- TRANSACTION 28
UPDATE transactions
SET category = 'Financial'
WHERE id = 28;

ALTER TABLE transactions
ALTER COLUMN category SET NOT NULL 