-- RUN THIS IN PGADMIN TO CHECK YOUR DATA

-- Check if complaints table exists and has data
SELECT COUNT(*) as total_complaints FROM complaints;

-- View all complaints
SELECT * FROM complaints ORDER BY created_at DESC LIMIT 10;

-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'complaints';
