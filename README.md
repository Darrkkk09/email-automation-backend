# Email Automation - AI-Powered Email Draft Generator

## 📋 Table of Contents

1. [Problem Statement](#problem-statement)
2. [Solution](#solution)
3. [Architecture Overview](#architecture-overview)
4. [Tech Stack](#tech-stack)
5. [Features](#features)
6. [Project Structure](#project-structure)
7. [Installation & Setup](#installation--setup)
8. [Environment Variables](#environment-variables)
9. [API Endpoints](#api-endpoints)
10. [How It Works](#how-it-works)
11. [Implementation Details](#implementation-details)
12. [Screenshots/UI](#screenshotsui)
13. [Future Enhancements](#future-enhancements)

---

## Problem Statement

Writing professional emails can be challenging and time-consuming. People often struggle with:
- **Writer's block** - Not knowing how to start or structure an email
- **Tone management** - Balancing professionalism with warmth
- **Time consumption** - Spending hours crafting the perfect email
- **Multiple iterations** - Needing to rewrite emails for different recipients/contexts
- **Verification issues** - Ensuring email identity before sending

---

## Solution

**Email Automation** is an AI-powered email drafting and sending platform that:

1. **Verifies User Identity** - Uses OTP (One-Time Password) authentication to verify users before they can send emails
2. **Generates AI Drafts** - Uses Groq's Llama-3.3-70b model to generate multiple email drafts in different tones (Professional, Human, Friendly, Concise, etc.)
3. **Rich Text Editor** - Provides a "Zen Editor" for editing drafts before sending
4. **Direct Sending** - Sends emails directly through Gmail SMTP with attachment support
5. **Beautiful UI** - Modern, elegant interface with smooth animations

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│    Backend      │
│   (Next.js)    │◀────│   (NestJS)      │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │   Groq AI API   │
                        │  (Llama-3.3)    │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Gmail SMTP     │
                        │  (Nodemailer)   │
                        └─────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Language**: TypeScript

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **AI Integration**: Groq API (Llama-3.3-70b-versatile)
- **Email Service**: Nodemailer (Gmail SMTP)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator, class-transformer

---

## Features

### 🔐 Authentication
- Email OTP verification
- JWT-based session management
- Secure token storage

### ✉️ Email Generation
- AI-powered draft generation
- Multiple tone variations (Professional, Human, Friendly, Direct, Concise)
- Context-aware email generation
- Subject line suggestions

### 📝 Editor
- Real-time editing
- Character count
- Live sync indicator
- Beautiful modal interface

### 📤 Email Sending
- Direct SMTP sending
- Attachment support
- Custom reply-to address
- Display name customization

### 🎨 UI/UX
- Landing page with hero section
- FAQ section
- Responsive design
- Smooth animations
- Toast notifications

---

## Project Structure

```
Email-Automation/
├── README.md
├── backend/
│   ├── src/
│   │   ├── main.ts                 # Application entry point
│   │   ├── app.module.ts           # Root module
│   │   ├── Email/
│   │   │   ├── email.module.ts     # Email module
│   │   │   ├── email.controller.ts # API endpoints
│   │   │   ├── email.service.ts    # Business logic
│   │   │   └── email.obj.ts        # DTOs/Interfaces
│   │   ├── LLM/
│   │   │   ├── llm.module.ts      # LLM module
│   │   │   ├── llm.service.ts     # AI generation logic
│   │   │   └── llm.controller.ts  # LLM endpoints
│   │   └── User/                   # User module (reserved)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── app/
    │   ├── page.tsx                # Main page
    │   ├── layout.tsx              # Root layout
    │   └── globals.css             # Global styles
    ├── components/
    │   ├── EmailComposer.tsx      # Email input form
    │   ├── DraftGallery.tsx       # Generated drafts display
    │   ├── Verification.tsx       # OTP verification
    │   ├── GmailPage.tsx           # Email sending modal
    │   ├── HeroSection.tsx        # Landing hero
    │   ├── FAQ.tsx                 # FAQ section
    │   └── ToastContext.tsx       # Toast notifications
    ├── lib/
    │   └── api-client.ts           # API client functions
    ├── types/
    │   └── email.ts                # TypeScript types
    ├── package.json
    └── tailwind.config.ts
```

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Gmail account with App Password
- Groq API Key

### Clone the Repository
```
bash
git clone <repository-url>
cd Email-Automation
```

### Backend Setup
```
bash
cd backend
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env

# Start development server
npm run start:dev
```

### Frontend Setup
```
bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
```

---

## Environment Variables

### Backend (.env)
```
env
# Required
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password
MAIL_DISPLAY_NAME=Your Name
GROQ_API_KEY=your-groq-api-key
JWT_SECRET=your-super-secret-jwt-key

# Optional (with defaults)
PORT=5000
```

### Frontend (.env.local)
```
env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Getting Gmail App Password
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Search for "App Passwords" in settings
4. Create a new app password for "Mail"
5. Use the 16-character password as `MAIL_PASS`

### Getting Groq API Key
1. Go to [Groq Console](https://console.groq.com/)
2. Create an account/Login
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `gsk_`)

---

## API Endpoints

### Email Controller

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/email/request-otp` | Send OTP to user's email |
| POST | `/email/verify-otp` | Verify OTP and get auth token |
| POST | `/email/improve` | Generate AI email drafts |
| POST | `/email/send` | Send email (with attachment) |

#### Request OTP
```
http
POST /email/request-otp
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Verify OTP
```
http
POST /email/verify-otp
Content-Type: application/json

{
  "otp": "123456",
  "token": "eyJhbGc..."
}
```

#### Generate Drafts
```
http
POST /email/improve
Content-Type: application/json

{
  "context": "Hiring Manager at Google",
  "description": "I want to apply for the Software Engineer position"
}
```

#### Send Email
```
http
POST /email/send
Content-Type: multipart/form-data

{
  "to": "recipient@example.com",
  "replyTo": "sender@gmail.com",
  "subject": "Application for Software Engineer Position",
  "description": "Dear Hiring Manager...",
  "UserName": "John Doe",
  "attachment": <file>
}
```

---

## How It Works

### 1. User Verification Flow
```
User enters email → Backend generates 6-digit OTP → 
OTP sent via Gmail → User enters OTP → 
Backend verifies OTP → JWT token issued → 
User can now send emails
```

### 2. Email Generation Flow
```
User enters context & description → 
Frontend calls /email/improve → 
Backend calls Groq API (Llama-3.3) → 
AI generates 6 different tone variations → 
Frontend displays Draft Gallery → 
User selects a draft → 
Opens in Zen Editor → 
User edits and sends
```

### 3. Email Sending Flow
```
User clicks "Open Dispatch" → 
Gmail compose modal opens → 
User fills recipient → 
Backend sends via Gmail SMTP → 
Success/failure notification
```

---

## Implementation Details

### Backend Implementation

#### JWT Authentication
- OTP tokens expire in 5 minutes
- Auth tokens (after verification) expire in 7 days
- Tokens are signed with `JWT_SECRET`

#### Groq AI Integration
- Model: `llama-3.3-70b-versatile`
- Temperature: 0.4 (balanced creativity)
- Returns structured JSON with multiple drafts
- Supports tones: Professional, Human, Friendly, Direct, Concise

#### Email Sending
- Uses Nodemailer with Gmail SMTP
- Supports attachments up to file size limits
- Sanitizes user input to prevent header injection
- Custom display name support

### Frontend Implementation

#### State Management
- React useState for local state
- Session storage for verification state
- Local storage for auth token

#### UI Components
- **Verification**: Multi-step form (email → OTP → verified)
- **EmailComposer**: Input form with context & description
- **DraftGallery**: Grid display of generated drafts
- **Zen Editor**: Full-screen modal for editing
- **GmailPage**: Email sending interface

#### Animations
- Framer Motion for complex animations
- CSS transitions for simple effects
- Tailwind utility classes for responsive design

---

## Screenshots/UI

### Landing Page
- Clean, minimal design
- Hero section with call-to-action
- FAQ section for user questions

### Verification Modal
- Email input with validation
- OTP entry with 6-digit input
- Success indicator

### Email Composer
- Context input (recipient info)
- Description textarea
- Generate button with loading state

### Draft Gallery
- Grid of draft cards
- Tone badges
- Preview of email body
- Selection animation

### Zen Editor
- Full-screen modal
- Subject line editing
- Body text editing
- Character count
- Open Dispatch button

### Gmail Integration
- Pre-filled compose window
- Attachment support
- Send confirmation

---

## Future Enhancements

- [ ] Save drafts to database
- [ ] Email templates library
- [ ] Analytics dashboard
- [ ] Multiple SMTP providers
- [ ] Team collaboration
- [ ] Email scheduling
- [ ] A/B testing for subject lines
- [ ] Rich text editor for body
- [ ] Mobile app
- [ ] Browser extension

---

## License

MIT License

---

## Author

Built with NestJS, Next.js, and Groq AI
