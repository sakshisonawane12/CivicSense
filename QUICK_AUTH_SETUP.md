# ⚡ QUICK START - AUTHENTICATION

## 🎯 3 STEPS TO GET AUTHENTICATION WORKING

### Step 1: Run SQL in pgAdmin (2 minutes)

1. Open **pgAdmin**
2. Connect to your `civicsense2` database
3. Open **Query Tool**
4. Copy and paste this SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'citizen' CHECK (role IN ('citizen', 'department')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default department users (password: admin123)
INSERT INTO users (name, email, phone, password, role) VALUES
('Sanitation Dept', 'sanitation@civic.gov', '1234567890', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department'),
('Public Works Dept', 'pwd@civic.gov', '1234567891', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department'),
('Police Dept', 'police@civic.gov', '1234567892', '$2b$10$eIBd0tOYsNiaa0YrgGdwvuw3cMzr9czLTj8s2QDnZ2UZm1RToHZLq', 'department')
ON CONFLICT (email) DO NOTHING;

-- Add user_id to complaints table
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
```

5. Click **Execute** (F5)
6. You should see "Query returned successfully"

---

### Step 2: Restart Backend (1 minute)

```bash
# Stop backend (Ctrl+C)
# Then restart:
cd backend
npm run dev
```

You should see:

```
Server running on 5000
PostgreSQL Connected
```

---

### Step 3: Test It! (2 minutes)

#### Test Department Login:

1. Go to: http://localhost:5173/login
2. Enter:
   - **Email:** sanitation@civic.gov
   - **Password:** admin123
3. Click **Login**
4. Should redirect to Dashboard ✅

#### Test Citizen Registration:

1. Go to: http://localhost:5173/login
2. Click "Don't have an account? Register"
3. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: test123
   - Role: Citizen
4. Click **Register**
5. Should redirect to "My Complaints" page ✅

#### Test Complaint Submission (Logged In):

1. Go to: http://localhost:5173/submit
2. Submit a complaint
3. Go to: http://localhost:5173/my-complaints
4. Should see your complaint ✅

---

## 🎯 DEMO ACCOUNTS

### Department Accounts:

| Email                | Password | Department   |
| -------------------- | -------- | ------------ |
| sanitation@civic.gov | admin123 | Sanitation   |
| pwd@civic.gov        | admin123 | Public Works |
| police@civic.gov     | admin123 | Police       |

---

## 🔥 WHAT TO DEMO

### Flow 1: Department Login

1. Login as department → See dashboard with all complaints
2. Update complaint status
3. View hotspots

### Flow 2: Citizen Registration & Tracking

1. Register as citizen
2. Submit complaint
3. View "My Complaints" to see history
4. Show real-time status updates

### Flow 3: Accessibility (No Login Required)

1. Go to `/submit` without logging in
2. Submit complaint (still works!)
3. Use `/track` to track by phone number
4. Explain: "We kept submission open for accessibility"

---

## 💬 WHAT TO SAY TO JUDGES

"We've implemented full authentication with three key features:

1. **Department Access:** Pre-configured accounts for government departments with secure login
2. **Citizen Accounts:** Users can register to track their complaint history
3. **Accessibility First:** Citizens can still submit without login - no barriers

This demonstrates both security (JWT tokens, bcrypt hashing) and accessibility (optional login). The system works for everyone - from tech-savvy users who want accounts, to rural citizens who just need to report an issue."

---

## ✅ VERIFICATION CHECKLIST

- [ ] SQL executed successfully in pgAdmin
- [ ] Backend restarted without errors
- [ ] Can login with sanitation@civic.gov / admin123
- [ ] Can register new citizen account
- [ ] Can submit complaint while logged in
- [ ] Can view "My Complaints" page
- [ ] Can still submit complaint without login
- [ ] Navigation shows "Login" when logged out
- [ ] Navigation shows "My Complaints" when logged in

---

## 🚨 TROUBLESHOOTING

### "Invalid credentials" error:

- Make sure you ran the SQL in pgAdmin
- Check password is exactly: admin123
- Verify users table exists: `SELECT * FROM users;`

### "No token provided" error:

- Clear browser localStorage
- Login again
- Check token is saved: Open DevTools → Application → Local Storage

### Backend error:

- Check backend console for errors
- Verify jsonwebtoken and bcryptjs are installed
- Restart backend server

---

## 🎉 SUCCESS!

You now have:

- ✅ User registration & login
- ✅ JWT authentication
- ✅ Role-based access (citizen/department)
- ✅ User complaint history
- ✅ Department dashboard access
- ✅ Optional login (accessibility)

**Total Features: 22** 🚀

---

**READY FOR DEMO! 💪**
