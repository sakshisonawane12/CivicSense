# 📸 Screenshots Guide

This document provides instructions for capturing screenshots to include in your project presentation.

## Required Screenshots

### 1. Landing Page (Home)

**File**: `screenshots/home.png`

**What to capture**:

- Full page view of `http://localhost:5173`
- Hero section with "civicsense2" title
- Three feature cards
- CTA buttons (Submit Complaint, View Dashboard)

**How to capture**:

1. Navigate to home page
2. Press F11 for fullscreen (optional)
3. Press `Windows + Shift + S` (Windows) or `Cmd + Shift + 4` (Mac)
4. Select full page
5. Save as `home.png`

---

### 2. Complaint Submission Form

**File**: `screenshots/form.png`

**What to capture**:

- Navigate to `http://localhost:5173/submit`
- Empty form showing all fields:
  - Name input
  - Phone input
  - Complaint textarea
  - Location input
  - Language dropdown
  - Image upload button
  - Record audio button
  - Submit button

**How to capture**:

1. Click "Submit Complaint" from home
2. Capture full form
3. Save as `form.png`

---

### 3. Form with Data (Optional)

**File**: `screenshots/form-filled.png`

**What to capture**:

- Same form but filled with sample data
- Shows how form looks when user is entering data

**Sample data**:

```
Name: Rajesh Kumar
Phone: 9876543210
Complaint: There was a serious accident near MG Road junction...
Location: MG Road, Pune
Language: English
```

---

### 4. Success Message

**File**: `screenshots/success.png`

**What to capture**:

- Success screen after submitting complaint
- Green checkmark icon
- "Complaint Submitted Successfully!" message

**How to capture**:

1. Fill and submit form
2. Quickly capture success message (appears for 3 seconds)
3. Save as `success.png`

---

### 5. Dashboard - Full View

**File**: `screenshots/dashboard-full.png`

**What to capture**:

- Navigate to `http://localhost:5173/dashboard`
- Full dashboard view showing:
  - Statistics cards at top
  - Filter dropdowns
  - Complaints list on left
  - Hotspots panel on right

**How to capture**:

1. Submit 3-4 test complaints first
2. Navigate to dashboard
3. Capture full page
4. Save as `dashboard-full.png`

---

### 6. Dashboard - Statistics Cards

**File**: `screenshots/dashboard-stats.png`

**What to capture**:

- Close-up of the 4 statistics cards:
  - Total Complaints
  - High Priority
  - Pending
  - Resolved

**How to capture**:

1. On dashboard, zoom in on stats section
2. Capture just the 4 cards
3. Save as `dashboard-stats.png`

---

### 7. Complaints List

**File**: `screenshots/complaints.png`

**What to capture**:

- Complaints section showing multiple complaint cards
- Each card should show:
  - Priority badge (colored)
  - Category tag
  - Complaint text
  - Location, citizen name, department
  - Status dropdown

**How to capture**:

1. Scroll to complaints section
2. Capture 2-3 complaint cards
3. Save as `complaints.png`

---

### 8. Hotspots Section

**File**: `screenshots/hotspots.png`

**What to capture**:

- Right panel showing hotspot areas
- Should show locations with complaint counts

**How to capture**:

1. Submit 3+ complaints from same location to create hotspot
2. Capture hotspots panel
3. Save as `hotspots.png`

---

### 9. Priority Filtering

**File**: `screenshots/filter-priority.png`

**What to capture**:

- Dashboard with priority filter dropdown open
- Shows High/Medium/Low options

**How to capture**:

1. Click on priority filter dropdown
2. Capture with dropdown open
3. Save as `filter-priority.png`

---

### 10. High Priority Complaint

**File**: `screenshots/high-priority.png`

**What to capture**:

- Single complaint card with HIGH priority (red badge)
- Shows urgency keywords detected

**Sample complaint to create**:

```
Complaint: Fire broke out in building. Emergency help needed immediately!
Expected: High priority, red badge, Safety category
```

---

### 11. Multi-lingual Support (Hindi)

**File**: `screenshots/hindi.png`

**What to capture**:

- Form with Hindi language selected
- Hindi text in complaint field

**How to capture**:

1. Go to submit form
2. Select "Hindi" from language dropdown
3. Enter Hindi text: "सड़क पर बड़ा गड्ढा है"
4. Capture form
5. Save as `hindi.png`

---

### 12. Voice Recording

**File**: `screenshots/voice.png`

**What to capture**:

- Form with "Recording..." button active
- Shows voice recording in progress

**How to capture**:

1. Click "Record Audio" button
2. Quickly capture while button shows "Recording..."
3. Save as `voice.png`

---

### 13. Status Update

**File**: `screenshots/status-update.png`

**What to capture**:

- Complaint card with status dropdown open
- Shows Pending/In Progress/Resolved options

**How to capture**:

1. On dashboard, click status dropdown on any complaint
2. Capture with dropdown open
3. Save as `status-update.png`

---

### 14. Department Routing

**File**: `screenshots/department-routing.png`

**What to capture**:

- Multiple complaints showing different departments:
  - Sanitation Department
  - Public Works Department
  - Police Department

**How to capture**:

1. Submit complaints in different categories
2. Capture complaints list showing different departments
3. Save as `department-routing.png`

---

### 15. Mobile Responsive (Optional)

**File**: `screenshots/mobile.png`

**What to capture**:

- Dashboard or form in mobile view

**How to capture**:

1. Press F12 to open DevTools
2. Click device toolbar icon (mobile view)
3. Select iPhone or Android device
4. Capture mobile view
5. Save as `mobile.png`

---

## Screenshot Organization

Create this folder structure:

```
DevCraft-Localhost/
├── screenshots/
│   ├── home.png
│   ├── form.png
│   ├── form-filled.png
│   ├── success.png
│   ├── dashboard-full.png
│   ├── dashboard-stats.png
│   ├── complaints.png
│   ├── hotspots.png
│   ├── filter-priority.png
│   ├── high-priority.png
│   ├── hindi.png
│   ├── voice.png
│   ├── status-update.png
│   ├── department-routing.png
│   └── mobile.png
```

---

## Tips for Good Screenshots

1. **Resolution**: Use 1920x1080 or higher
2. **Clean Browser**: Hide bookmarks bar, close unnecessary tabs
3. **Full Screen**: Use F11 for cleaner captures
4. **Zoom**: Use 100% zoom (Ctrl+0)
5. **Data**: Have realistic test data in screenshots
6. **Annotations**: Add arrows/highlights in presentation (not in original screenshots)

---

## Tools for Screenshots

### Windows

- **Snipping Tool**: Windows + Shift + S
- **Snip & Sketch**: Built-in Windows app
- **ShareX**: Free advanced tool

### Mac

- **Screenshot**: Cmd + Shift + 4
- **Preview**: Built-in Mac app

### Browser Extensions

- **Awesome Screenshot**: Full page capture
- **Nimbus Screenshot**: Annotate screenshots
- **FireShot**: Full page screenshots

---

## Creating Screenshot Collage for Presentation

Use tools like:

- **Canva**: Free online design tool
- **PowerPoint**: Create slides with screenshots
- **Figma**: Professional design tool
- **Google Slides**: Collaborative presentation

---

## Presentation Slide Suggestions

### Slide 1: Title

- Project name and tagline
- Team name and members

### Slide 2: Problem Statement

- Current civic complaint challenges
- Need for automation

### Slide 3: Solution Overview

- Screenshot of home page
- Key features list

### Slide 4: Multi-Channel Input

- Screenshots of form with text, voice, image options
- Highlight accessibility

### Slide 5: AI Classification

- Screenshot showing different categories
- Explain Gemini AI integration

### Slide 6: Priority Assignment

- Screenshot of high priority complaint
- Show urgency detection

### Slide 7: Dashboard

- Full dashboard screenshot
- Highlight statistics and filters

### Slide 8: Hotspot Analytics

- Screenshot of hotspots section
- Explain predictive analytics

### Slide 9: Multi-lingual Support

- Screenshot with Hindi/Marathi
- Show translation capability

### Slide 10: Tech Stack

- Architecture diagram
- Technology logos

### Slide 11: Demo Video

- Screen recording of full workflow
- 2-3 minutes max

### Slide 12: Impact & Future Scope

- Benefits for citizens and government
- Scalability plans

---

## Video Demo Recording

**Recommended Tools**:

- **OBS Studio** (Free, professional)
- **Loom** (Easy, cloud-based)
- **Windows Game Bar** (Win + G)
- **QuickTime** (Mac)

**Demo Script** (2-3 minutes):

1. Show landing page (5 sec)
2. Submit complaint with voice/image (30 sec)
3. Show success message (5 sec)
4. Navigate to dashboard (5 sec)
5. Show statistics and filters (15 sec)
6. Update complaint status (10 sec)
7. Show hotspots (10 sec)
8. Submit Hindi complaint (20 sec)
9. Show AI classification result (10 sec)
10. Closing statement (10 sec)

---

**Remember**: Screenshots should tell the story of your project. Make them clear, professional, and representative of all features!
