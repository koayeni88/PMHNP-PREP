# Product Requirements Document — PMHNP Exam Prep Platform

## 1. Vision
A Benner-style clinical reasoning development platform that transforms PMHNP exam preparation from rote memorization into progressive clinical skill acquisition across Pathophysiology, Pharmacology, and Physical Assessment.

## 2. User Personas

### Student
- PMHNP graduate students or recent graduates preparing for ANCC/AACN certification
- Want structured study, progress tracking, and exam simulation
- Need rationale-driven learning, not just answer keys

### Admin
- Content creators, faculty, or platform owners
- Manage question bank, review analytics, manage users

## 3. Core Features

### 3.1 Landing Page
- Hero section with value proposition
- Benner framework explanation
- Feature highlights, pricing tiers, testimonials, CTA

### 3.2 Authentication
- Email/password registration and login
- JWT-based session management
- Role-based access (student, admin)

### 3.3 Student Dashboard
- Welcome card with study streak
- Benner progression map (visual ladder)
- Quick stats: questions answered, accuracy, time studied
- Recommended next questions based on weakest areas
- Recent activity feed

### 3.4 Question Bank
- Searchable, filterable question list
- Filters: 3P category, Benner stage, subtopic, difficulty
- Each question shows full stem, 4 options, rationale, exam tips
- Bookmark and note capability per question

### 3.5 Custom Quiz Builder
- Select category, Benner stage, number of questions
- Timed or untimed mode
- "Study by Benner Stage" mode
- Review mode after completion with full rationales

### 3.6 Exam Simulator
- 150 questions, 3.5-hour timer
- Randomized from all categories and stages
- Flag questions for review
- Score report with breakdown by category and Benner stage

### 3.7 Analytics Dashboard
- Accuracy by 3P category
- Accuracy by Benner stage
- Time-per-question trends
- Progression map showing mastery trajectory
- Recommended next-stage questions

### 3.8 Bookmarks & Notes
- Bookmark any question
- Add personal notes to questions
- Filter and search bookmarks

### 3.9 Admin Panel
- CRUD for questions (with all tags)
- User management
- Question analytics (most missed, avg time)
- Bulk import/export

### 3.10 Subscription System
- Free tier: limited daily questions
- Premium tier: full access
- Stripe-ready payment hooks

## 4. UX Site Map

```
/                       → Landing Page
/login                  → Login
/register               → Register
/dashboard              → Student Dashboard
/questions              → Question Bank (browse/search)
/quiz/builder           → Custom Quiz Builder
/quiz/:id               → Active Quiz
/quiz/:id/results       → Quiz Results
/exam                   → Exam Simulator Setup
/exam/:id               → Active Exam
/exam/:id/results       → Exam Results
/analytics              → Analytics Dashboard
/bookmarks              → Bookmarks & Notes
/study/benner/:stage    → Study by Benner Stage
/admin                  → Admin Dashboard
/admin/questions        → Question Management
/admin/questions/new    → Create Question
/admin/questions/:id    → Edit Question
/admin/users            → User Management
/admin/analytics        → Platform Analytics
```

## 5. Non-Functional Requirements
- Mobile-first responsive design
- Sub-200ms API response times
- Accessible (WCAG 2.1 AA)
- Dark/light mode support
- Data export capability
