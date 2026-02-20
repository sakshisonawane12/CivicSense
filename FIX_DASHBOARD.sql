-- RUN THIS IN PGADMIN TO FIX YOUR DASHBOARD

-- Step 1: Add user_id column if it doesn't exist (allows NULL for existing data)
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Step 2: Verify your existing data is still there
SELECT COUNT(*) as total_complaints FROM complaints;

-- Step 3: View all your complaints
SELECT id, citizen_name, complaint_text, category, priority, status, created_at 
FROM complaints 
ORDER BY created_at DESC;

-- If you see your data above, your dashboard should work!
-- The user_id column is optional (NULL is allowed) so existing complaints will still show.
