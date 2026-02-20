-- Add this to your database

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'department')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default department users
INSERT INTO users (name, email, phone, password, role) VALUES
('Sanitation Dept', 'sanitation@civic.gov', '1234567890', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department'),
('Public Works Dept', 'pwd@civic.gov', '1234567891', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department'),
('Police Dept', 'police@civic.gov', '1234567892', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department')
ON CONFLICT (email) DO NOTHING;

-- Password for all department accounts: "admin123"

-- Add user_id to complaints table
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
