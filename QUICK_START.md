# 🚀 Quick Start Guide - civicsense2

## For Judges/Reviewers

### 1-Minute Setup

```bash
# Clone repository
git clone <repo-url>
cd DevCraft-Localhost

# Setup Database (in pgAdmin)
# Create database 'civicsense2' and run backend/database.sql

# Backend
cd backend
npm install
# Edit .env with your PostgreSQL credentials and Gemini API key
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Access**: http://localhost:5173

---

## Quick Test Flow

### Test 1: Submit High Priority Complaint (30 seconds)

1. Click "Submit Complaint"
2. Fill form:
   - Name: Test User
   - Phone: 9876543210
   - Complaint: "Fire emergency at MG Road! Immediate help needed!"
   - Location: MG Road, Pune
3. Click Submit
4. See success message

### Test 2: View Dashboard (30 seconds)

1. Click "Dashboard" in navbar
2. See statistics cards
3. See your complaint with HIGH priority (red badge)
4. See it's routed to "Police Department"
5. Change status to "In Progress"

### Test 3: Multi-lingual (30 seconds)

1. Go back to Submit Complaint
2. Select "Hindi" language
3. Enter: "सड़क पर गड्ढा है"
4. Submit
5. Check dashboard - see it translated to English

### Test 4: Hotspot (1 minute)

1. Submit 3 complaints from same location (e.g., "FC Road, Pune")
2. Go to dashboard
3. See "FC Road, Pune" appear in Hotspots section

---

## Key Features to Demonstrate

✅ **Multi-Channel Input**: Text, Voice (click Record Audio), Image upload
✅ **AI Classification**: Auto-categorizes into Sanitation/Infrastructure/Safety
✅ **Priority Detection**: High/Medium/Low based on urgency keywords
✅ **Auto-Routing**: Assigns to correct department automatically
✅ **Duplicate Detection**: Submit same complaint twice, see grouping
✅ **Hotspots**: 3+ complaints from same location
✅ **Multi-lingual**: Hindi/Marathi translation to English

---

## Tech Highlights

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with indexes
- **AI**: Google Gemini 1.5 Flash
- **Features**: 8/8 (All MVP + Bonus features)

---

## Project Stats

- **Lines of Code**: ~2000+
- **Files**: 20+
- **Features**: 8 (All implemented)
- **API Endpoints**: 5
- **Database Tables**: 3
- **AI Models**: 1 (Gemini 1.5 Flash)

---

## What Makes This Special

1. **Complete AI Integration**: Not just keywords, actual NLP
2. **Smart Duplicate Detection**: 70% similarity algorithm
3. **Predictive Analytics**: Hotspot identification
4. **Accessibility**: Voice recording + Multi-lingual
5. **Production Ready**: Error handling, fallbacks, logging
6. **Beautiful UI**: Modern gradient design, responsive

---

## Common Demo Issues & Solutions

**Issue**: AI classification slow
**Solution**: First request takes 2-3 seconds (cold start), subsequent requests faster

**Issue**: Voice recording not working
**Solution**: Browser needs microphone permission, click "Allow"

**Issue**: Hotspots not showing
**Solution**: Need 3+ complaints from same location

**Issue**: Database connection error
**Solution**: Check PostgreSQL is running, verify .env credentials

---

## File Structure Overview

```
backend/
├── services/aiService.js      # AI/NLP logic (classification, sentiment, translation)
├── controllers/               # Business logic
├── routes/                    # API endpoints
└── config/db.js              # PostgreSQL connection

frontend/
├── components/
│   ├── ComplaintForm.tsx     # Multi-channel input form
│   └── Dashboard.tsx         # Analytics & management
└── services/api.ts           # API calls
```

---

## Evaluation Criteria Mapping

### Innovation (25%)

- AI-powered classification and sentiment analysis
- Duplicate detection algorithm
- Predictive hotspot analytics
- Multi-lingual support with translation

### Technical Implementation (25%)

- Modern tech stack (React, Node.js, PostgreSQL)
- Clean architecture (MVC pattern)
- Error handling and fallbacks
- Database optimization (indexes)

### Functionality (25%)

- All 8 features working
- End-to-end workflow complete
- Real-time updates
- File upload support

### UI/UX (15%)

- Beautiful gradient design
- Intuitive navigation
- Responsive layout
- Clear feedback messages

### Presentation (10%)

- Clear documentation
- Easy setup
- Demo-ready
- Professional README

---

## 30-Second Elevator Pitch

"civicsense2 uses AI to automatically classify, prioritize, and route civic complaints to the right government departments. Citizens can submit issues via text, voice, or images in their local language. The system detects duplicates, identifies problem hotspots, and helps officials respond faster to urgent issues like accidents and fires."

---

## Questions You Might Be Asked

**Q: How does AI classification work?**
A: We use Google Gemini 1.5 Flash to analyze complaint text and categorize it into Sanitation, Infrastructure, or Safety. The model is prompted to return only the category name.

**Q: What if AI fails?**
A: We have fallback mechanisms - if Gemini API fails, we default to Infrastructure category and use keyword matching for priority detection.

**Q: How accurate is duplicate detection?**
A: We use Jaccard similarity with 70% threshold. It compares word sets between complaints from the same location and category within 7 days.

**Q: Can this scale?**
A: Yes! PostgreSQL handles millions of records, we have database indexes for fast queries, and the backend is stateless for horizontal scaling.

**Q: What about privacy?**
A: We don't log sensitive data, use environment variables for credentials, and can add encryption at rest for production.

---

## Next Steps After Hackathon

1. **Mobile App**: React Native version
2. **Real-time Notifications**: WebSocket integration
3. **Image Recognition**: Auto-categorize from photos
4. **Government API Integration**: Connect to existing systems
5. **Advanced Analytics**: Trends, predictions, reports
6. **Citizen Portal**: Track complaint status
7. **SMS Integration**: For non-smartphone users

---

## Contact & Support

**Documentation**:

- README.md - Full setup guide
- FEATURE_REPORT.md - Detailed features
- SCREENSHOTS.md - Screenshot guide
- SUBMISSION_CHECKLIST.md - Pre-submission checklist

**Team**: [Your Team Name]

---

**Status**: ✅ Production Ready
**Last Updated**: February 2026
**DevCraft Hackathon 2026**

---

## One-Line Summary

**civicsense2: AI-powered civic complaint management with multi-channel input, automatic classification, smart routing, duplicate detection, and predictive hotspot analytics.**

🎯 **All Features Implemented | Production Ready | Demo Ready**
