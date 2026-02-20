# CIVICSENSE2 - Complete Features List

## 🎯 Core Features

### 1. **Multi-Channel Complaint Submission**
- **Text Input**: Citizens can type their complaints
- **Voice Recording**: 10-second audio recording with browser MediaRecorder API
- **Image Upload**: Attach photos of issues using Multer file upload
- **Multi-language Support**: English, Hindi, Marathi

### 2. **AI-Powered Classification**
- **Technology**: Google Gemini 1.5 Flash (gemini-pro model)
- **Categories**: 
  - Sanitation (garbage, drainage, sewage)
  - Infrastructure (potholes, roads, water supply)
  - Safety (accidents, crime, emergencies)
- **Automatic Routing**: Complaints auto-assigned to correct department

### 3. **Sentiment & Urgency Analysis**
- **AI Sentiment Detection**: Analyzes complaint tone (-1 to 1 scale)
- **Urgency Keywords**: accident, fire, emergency, blocked, danger, critical, immediate, help, death, injury
- **Priority Assignment**: 
  - High: Contains urgency keywords
  - Medium: Negative sentiment
  - Low: Neutral/positive sentiment

### 4. **Intelligent Duplicate Detection**
- **Algorithm**: Jaccard Similarity (70% threshold)
- **Criteria**: Same category + location + within 7 days
- **Grouping**: Links duplicates via duplicate_group_id
- **Prevents**: Spam and redundant complaints

### 5. **Predictive Hotspot Analytics**
- **Detection**: Areas with 3+ complaints in 30 days
- **Grouping**: By location and category
- **Purpose**: Proactive governance and resource allocation
- **Display**: Real-time hotspot dashboard

---

## 👥 User Features

### For Citizens

#### A. Complaint Submission
- Name and phone number input
- Complaint description (text area)
- Location dropdown (10 Pune locations)
- Language selector (English/Hindi/Marathi)
- Optional image upload
- Optional voice recording (10 seconds)
- Success confirmation with Complaint ID

#### B. Complaint Tracking
- Track by Complaint ID
- Track by Phone Number
- View status (Pending/In Progress/Resolved)
- See assigned department
- View priority level
- Check submission and update timestamps

#### C. User Dashboard (Authenticated)
- JWT-based authentication
- View all personal complaints
- Filter by status
- See complaint history
- Real-time status updates

### For Departments/Officials

#### A. Department Dashboard
- **Statistics Cards**:
  - Total Complaints
  - High Priority Count
  - Pending Count
  - Resolved Count

#### B. Filtering System
- Filter by Priority (High/Medium/Low)
- Filter by Status (Pending/In Progress/Resolved)
- Filter by Department (Sanitation/Infrastructure/Safety)

#### C. Complaint Management
- View all complaints
- Update status (dropdown)
- See citizen details
- View location and category
- Priority color coding (Red/Orange/Green)

#### D. Hotspot Monitoring
- Right panel with hotspot areas
- Location-wise complaint count
- Category breakdown
- Recurring issue identification

---

## 🔐 Authentication System

### User Registration
- Name, email, phone, password
- Role selection (citizen/department)
- Password hashing with bcrypt
- JWT token generation

### User Login
- Email and password authentication
- JWT token with 24-hour expiry
- Role-based access control
- Secure token storage

### Protected Routes
- My Complaints (requires login)
- User Profile (requires login)
- Optional authentication for complaint submission

---

## 🗄️ Database Schema

### Tables

#### 1. complaints
```sql
- id (SERIAL PRIMARY KEY)
- citizen_name (VARCHAR)
- citizen_phone (VARCHAR)
- complaint_text (TEXT)
- category (VARCHAR) - AI classified
- priority (VARCHAR) - AI assigned
- sentiment_score (FLOAT) - AI analyzed
- urgency_keywords (TEXT[]) - AI detected
- status (VARCHAR) - pending/in_progress/resolved
- department (VARCHAR) - Auto-routed
- location (VARCHAR)
- image_url (TEXT)
- audio_url (TEXT)
- language (VARCHAR)
- duplicate_group_id (INTEGER)
- user_id (INTEGER) - Optional FK
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 2. departments
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- category (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR)
```

#### 3. hotspots
```sql
- id (SERIAL PRIMARY KEY)
- location (VARCHAR)
- category (VARCHAR)
- complaint_count (INTEGER)
- last_updated (TIMESTAMP)
- UNIQUE(location, category)
```

#### 4. users
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- email (VARCHAR UNIQUE)
- phone (VARCHAR)
- password (VARCHAR) - Hashed
- role (VARCHAR) - citizen/department
- created_at (TIMESTAMP)
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript
- **Build Tool**: Vite 7.3.1
- **Routing**: React Router DOM 7.13.0
- **HTTP Client**: Axios 1.13.5
- **Icons**: Lucide React 0.468.0
- **Styling**: Custom CSS + Tailwind CSS 3.4.17
- **UI**: Gradient design with responsive layout

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5.2.1
- **File Upload**: Multer 1.4.5
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **Environment**: dotenv 16.4.7
- **CORS**: cors 2.8.6

### Database
- **Database**: PostgreSQL
- **Client**: pg 8.11.3
- **Admin Tool**: pgAdmin

### AI/ML
- **Model**: Google Gemini 1.5 Flash
- **Package**: @google/generative-ai 0.21.0
- **Capabilities**:
  - Text classification
  - Sentiment analysis
  - Language translation
  - Urgency detection

---

## 📡 API Endpoints

### Complaint Routes

#### POST /api/complaints
Create new complaint
- **Body**: FormData (multipart/form-data)
- **Fields**: citizen_name, citizen_phone, complaint_text, location, language
- **Files**: image (optional), audio (optional)
- **Response**: Complaint object with AI analysis

#### GET /api/complaints
Get all complaints
- **Query**: department, priority, status (optional filters)
- **Response**: Array of complaints

#### GET /api/complaints/track
Track complaint
- **Query**: id (complaint ID) OR phone (phone number)
- **Response**: Complaint object(s)

#### PATCH /api/complaints/:id/status
Update complaint status
- **Body**: { status: "pending" | "in_progress" | "resolved" }
- **Response**: Updated complaint

#### GET /api/complaints/hotspots
Get hotspot areas
- **Response**: Array of locations with high complaint counts

#### GET /api/complaints/stats
Get dashboard statistics
- **Response**: { total, high_priority, pending, resolved }

#### GET /api/complaints/my-complaints
Get user's complaints (Protected)
- **Headers**: Authorization: Bearer <token>
- **Response**: Array of user's complaints

### Authentication Routes

#### POST /api/auth/register
Register new user
- **Body**: { name, email, phone, password, role }
- **Response**: { token, user }

#### POST /api/auth/login
Login user
- **Body**: { email, password }
- **Response**: { token, user }

---

## 🎨 UI/UX Features

### Design Elements
- **Color Scheme**: Purple gradient (667eea to 764ba2)
- **Cards**: White cards with shadow and rounded corners
- **Buttons**: Gradient hover effects
- **Icons**: Lucide React icons throughout
- **Typography**: System fonts for readability

### Responsive Design
- Mobile-friendly layout
- Grid system adapts to screen size
- Touch-friendly buttons
- Readable text on all devices

### Visual Feedback
- Loading states on buttons
- Success messages with animations
- Error alerts
- Color-coded priority badges
- Status badges with colors

### Accessibility
- High contrast text
- Clear labels
- Keyboard navigation
- Screen reader friendly
- Focus indicators

---

## 🔄 Workflow

### Citizen Journey
1. Visit homepage
2. Click "Submit Complaint"
3. Fill form (text/voice/image)
4. Select language
5. Submit complaint
6. Receive Complaint ID
7. Track status anytime
8. View updates

### AI Processing
1. Receive complaint text
2. Translate if needed (Hindi/Marathi → English)
3. Classify category (Sanitation/Infrastructure/Safety)
4. Analyze sentiment and urgency
5. Assign priority (High/Medium/Low)
6. Route to department
7. Check for duplicates
8. Update hotspots

### Department Workflow
1. Login to dashboard
2. View assigned complaints
3. Filter by priority/status
4. Update complaint status
5. Monitor hotspots
6. Take action

---

## 📊 Analytics & Insights

### Dashboard Metrics
- Total complaints count
- High priority complaints
- Pending complaints
- Resolved complaints
- Category breakdown

### Hotspot Analysis
- Location-wise complaint density
- Category-wise grouping
- 30-day rolling window
- Minimum 3 complaints threshold
- Sorted by complaint count

### Duplicate Detection Stats
- Similarity percentage
- Grouped complaint IDs
- Duplicate count per original

---

## 🔒 Security Features

### Authentication
- JWT tokens with expiry
- Password hashing (bcrypt)
- Secure token storage
- Role-based access control

### Data Protection
- SQL injection prevention (parameterized queries)
- CORS configuration
- Environment variable protection
- File upload validation

### Privacy
- Phone number masking option
- User data isolation
- Secure file storage
- No PII in logs

---

## 🚀 Performance Optimizations

### Frontend
- React lazy loading
- Component memoization
- Efficient re-renders
- Optimized bundle size

### Backend
- Database indexing on:
  - complaints.category
  - complaints.priority
  - complaints.status
  - complaints.location
  - complaints.created_at
- Connection pooling (PostgreSQL)
- Async/await for non-blocking operations

### AI
- Fallback mechanisms for AI failures
- Cached responses where possible
- Timeout handling
- Error recovery

---

## 📱 Pages & Routes

### Public Pages
- `/` - Landing page with features
- `/submit` - Complaint submission form
- `/track` - Track complaint by ID/phone
- `/dashboard` - Department dashboard
- `/team` - Team information
- `/login` - User login
- `/register` - User registration

### Protected Pages
- `/my-complaints` - User's complaint history
- `/profile` - User profile

---

## 🎯 Key Differentiators

1. **AI-First Approach**: Fully automated classification and routing
2. **Multi-Modal Input**: Text + Voice + Image support
3. **Multi-Lingual**: English, Hindi, Marathi with AI translation
4. **Smart Duplicate Detection**: 70% similarity threshold
5. **Predictive Analytics**: Hotspot identification
6. **Real-Time Updates**: Live status tracking
7. **User Authentication**: Secure login system
8. **Mobile Responsive**: Works on all devices
9. **Beautiful UI**: Modern gradient design
10. **Complete PERN Stack**: Production-ready architecture

---

## 📈 Scalability Features

- PostgreSQL for large datasets
- Indexed database queries
- Modular code architecture
- RESTful API design
- Stateless authentication (JWT)
- Cloud-ready deployment
- Environment-based configuration

---

## 🧪 Testing Scenarios

### Test Case 1: High Priority Safety
- Input: "Serious accident at MG Road, people injured, immediate help needed"
- Expected: Category=Safety, Priority=High, Department=Police

### Test Case 2: Sanitation Issue
- Input: "Garbage not collected for 5 days, bad smell"
- Expected: Category=Sanitation, Priority=Medium, Department=Sanitation

### Test Case 3: Infrastructure
- Input: "Big pothole on FC Road causing vehicle damage"
- Expected: Category=Infrastructure, Priority=Medium, Department=Public Works

### Test Case 4: Hindi Language
- Input: "सड़क पर बहुत बड़ा गड्ढा है"
- Expected: Translated to English, Category=Infrastructure

### Test Case 5: Duplicate Detection
- Submit same complaint twice from same location
- Expected: Second marked as duplicate with group ID

### Test Case 6: Hotspot Creation
- Submit 3+ complaints from "FC Road, Pune"
- Expected: Location appears in hotspots

---

## 📦 Deliverables

✅ Complete source code (Frontend + Backend)
✅ Database schema and setup scripts
✅ README with setup instructions
✅ Environment configuration examples
✅ API documentation
✅ Feature documentation
✅ Screenshots
✅ Team information

---

**Project Status**: ✅ Complete and Production-Ready

**Last Updated**: February 2026

**Team**: Localhost (Shreya Phalke, Sanika Mohite, Sakshi Sonawane, Srushti Mane)
