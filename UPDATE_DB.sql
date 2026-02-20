-- Run this in civicsense2 database to add missing tables/columns

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'department')),
    department_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user_id column to complaints if not exists
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Insert department users (ignore if already exist)
INSERT INTO users (name, email, phone, password, role, department_name) VALUES
('Sanitation Dept', 'sanitation@civic.gov', '1234567890', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department', 'Sanitation Department'),
('Public Works Dept', 'pwd@civic.gov', '1234567891', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department', 'Public Works Department'),
('Police Dept', 'police@civic.gov', '1234567892', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department', 'Police Department')
ON CONFLICT (email) DO NOTHING;

-- Create index if not exists
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
