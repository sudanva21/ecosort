# EcoSort - AI-Powered Waste Classification

## 🌱 Overview

EcoSort is a complete full-stack, eco-friendly web application that uses AI to classify waste into categories (Dry/Wet/Recyclable) and provides disposal guidelines. Built with React + Vite, Supabase, and n8n, it features authentication, real-time database, AI-powered image classification, and gamification elements like streaks, badges, and leaderboards.

## 🎯 Complete Tech Stack

**Frontend:**
- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion (animations)
- Lucide React (icons)
- React Router DOM 6

**Backend:**
- **Supabase**: Authentication, PostgreSQL database, Row Level Security
- **n8n**: Workflow automation for AI processing
- **Gemini 2.5 Flash**: Image analysis and waste detection
- **Groq AI (Llama 3.3 70B)**: Natural language generation for descriptions

## ✨ Features

### Authentication & User Management
- **Secure Login/Register**: Email-based authentication via Supabase
- **Protected Routes**: Authenticated access to classification and gamification
- **User Profiles**: Automatic profile creation and management
- **Session Management**: Persistent auth with automatic token refresh

### Core Functionality
- **AI Waste Classification**: Upload or capture images for instant AI-powered waste categorization
- **Disposal Guidelines**: Detailed instructions for proper waste disposal
- **Real-time Processing**: Fast classification with confidence scores
- **Database Integration**: All classifications saved to Supabase
- **n8n Workflows**: Complete AI processing pipeline with Gemini & Groq

### Gamification
- **Green Streak**: Track consecutive days of classifications
- **Badge System**: Earn badges (Eco Rookie → Green Warrior → Zero-Waste Hero)
- **Global Leaderboard**: Compete with other eco-warriors
- **Social Sharing**: Share achievements on social platforms

### Design
- **Eco-Friendly Theme**: Natural green gradients and soft tones
- **Glassmorphic UI**: Modern backdrop blur effects
- **Smooth Animations**: Framer Motion powered transitions
- **Fully Responsive**: Works seamlessly on all devices
- **Accessible**: ARIA labels and semantic HTML

## 🗂️ Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Header.jsx           # Navigation with auth status ✨ UPDATED
│   ├── Footer.jsx           # Footer with branding
│   ├── UploadBox.jsx        # Image upload/capture
│   ├── ResultCard.jsx       # Classification results
│   ├── DisposalGuide.jsx    # Disposal instructions
│   ├── StreakBadge.jsx      # User streak display
│   ├── Leaderboard.jsx      # Global rankings
│   └── ProtectedRoute.jsx   # Route auth guard ✨ NEW
├── pages/                   # Route pages
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # Login page ✨ NEW
│   ├── Register.jsx         # Registration page ✨ NEW
│   ├── Classify.jsx         # Classification interface ✨ UPDATED
│   ├── Guide.jsx            # Disposal guidelines
│   └── Gamification.jsx     # Achievements & leaderboard
├── context/                 # State management
│   ├── AuthContext.jsx      # Auth state ✨ NEW
│   └── AppContext.jsx       # App state
├── hooks/                   # Custom React hooks
│   ├── useImageUpload.js    # Image handling
│   └── useClassification.js # Classification logic ✨ UPDATED
├── lib/                     # External services
│   └── supabase.js          # Supabase client ✨ NEW
├── utils/                   # Utility functions
│   └── api.js               # API calls (Supabase integrated) ✨ UPDATED
├── styles/                  # Styling
│   ├── globals.css          # Global styles
│   └── theme.css            # Theme variables
├── App.jsx                  # Main app ✨ UPDATED
├── main.jsx                 # Entry point
└── index.css                # Tailwind imports

Root Files:
├── supabase-schema.sql                      # Database schema ✨ NEW
├── n8n-waste-classification-workflow.json   # AI classification ✨ NEW
├── n8n-disposal-guide-workflow.json         # Guide generation ✨ NEW
└── SUPABASE_N8N_SETUP.md                    # Setup guide ✨ NEW
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase account (already configured)
- n8n instance (for AI workflows)

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up Supabase database:**
   - Go to your Supabase SQL Editor
   - Run the SQL in `supabase-schema.sql`
   - Verify tables are created

3. **Import n8n workflows:**
   - Import `n8n-waste-classification-workflow.json`
   - Import `n8n-disposal-guide-workflow.json`
   - Update webhook URLs in `src/utils/api.js`
   - Activate both workflows

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser:** `http://localhost:5173`

6. **Create an account** and start classifying waste!

📖 **For detailed setup instructions, see `SUPABASE_N8N_SETUP.md`**

### Build for Production

```bash
npm run build
npm run preview
```

## 🔗 n8n Integration

The application is designed to integrate with n8n workflows for AI classification. Update the webhook URLs in `src/utils/api.js`:

```javascript
const N8N_CLASSIFY_WEBHOOK = 'https://your-n8n-instance.com/webhook/classify-waste';
const N8N_GUIDE_WEBHOOK = 'https://your-n8n-instance.com/webhook/disposal-guide';
```

### Expected n8n Response Format

**Classification Endpoint:**
```json
{
  "category": "Recyclable" | "Wet" | "Dry",
  "confidence": 92,
  "description": "Plastic bottle detected - can be recycled"
}
```

**Disposal Guide Endpoint:**
```json
{
  "category": "Recyclable",
  "description": "Items that can be processed and reused",
  "icon": "recycle",
  "tips": ["Clean items before recycling", "..."],
  "examples": ["Plastic bottles", "Glass containers", "..."],
  "color": "#2ECC71"
}
```

## 🎨 Color Palette

- Primary Green: `#10b981` (Emerald-500)
- Dark Green: `#1b5e20`
- Light Green: `#a5d6a7`
- Accent Green: `#2ecc71`
- Secondary: `#28a745`

## 📦 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM 6
- **State Management**: React Context API

## 🎯 Key Components

### useImageUpload Hook
Handles image selection, camera capture, and preview generation.

### useClassification Hook
Manages classification state, API calls, and error handling with loading states.

### AppContext
Provides global state for classification history, streak tracking, and current classification.

## 📱 Pages

1. **Home**: Hero section with features showcase and CTAs
2. **Classify**: Image upload, classification, and results
3. **Guide**: Comprehensive disposal guidelines with category tabs
4. **Gamification**: Streaks, badges, and leaderboard

## 🏆 Gamification System

- **Eco Rookie**: 1+ day streak
- **Green Warrior**: 10+ day streak  
- **Zero-Waste Hero**: 30+ day streak

Streaks are stored in localStorage and persist across sessions.

## 🔧 Customization

### Adding New Waste Categories

1. Update mock data in `src/utils/api.js` (mockGuides object)
2. Add category to the categories array in `src/pages/Guide.jsx`
3. Add color mapping in `src/components/ResultCard.jsx` (getCategoryConfig)

### Modifying Animations

Animation configurations are in individual components using Framer Motion. Adjust `initial`, `animate`, and `transition` props.

### Changing Theme Colors

Update Tailwind config in `tailwind.config.js` and CSS variables in `src/styles/theme.css`.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🌍 Contributing

Contributions welcome! This project promotes sustainability and environmental awareness.

---

**Made with 💚 for Planet Earth**
