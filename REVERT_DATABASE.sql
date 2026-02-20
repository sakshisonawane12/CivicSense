-- RUN THIS IN PGADMIN TO COMPLETELY REVERT

-- Option 1: Just drop the user_id column (keeps users table for login)
ALTER TABLE complaints DROP COLUMN IF EXISTS user_id;

-- Option 2: If you want to remove everything auth-related
-- DROP TABLE IF EXISTS users CASCADE;
-- ALTER TABLE complaints DROP COLUMN IF EXISTS user_id;

-- Verify your data is back
SELECT * FROM complaints ORDER BY created_at DESC;
