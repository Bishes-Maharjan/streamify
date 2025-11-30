# Social Connect - Migrated Full-Stack Social Media Application

A modern, feature-rich social media platform **migrated from React/Express to Next.js/NestJS**, featuring real-time video calling, instant messaging, and comprehensive social networking capabilities powered by Stream.

## 🌐 Live Demo

<a href='https://streamify-frontend-t8hu.onrender.com/'> View Live Demo on Render </a>

*If the demo is unavailable, please contact me or run it locally using the instructions below.*

## 📋 Description

Social Connect is a full-stack social media application originally built with React and Express, which I **completely migrated to Next.js and NestJS** for improved performance, better developer experience, and modern architecture patterns. The platform combines traditional social networking features with real-time communication capabilities powered by Stream's APIs.

### Key Capabilities:
- **Real-time video calling** for face-to-face conversations
- **Instant messaging** with Stream's chat infrastructure
- **Social networking** with follow/follower relationships
- **User discovery** through an intelligent "Who to Follow" recommendation system
- **Profile management** with detailed follower/following views
- **Authentication** via Google OAuth for seamless onboarding

The application prioritizes functionality and ease of testing, offering a streamlined authentication process without email verification requirements.

## ✨ What I Built

### 🔄 Framework Migration
**From React/Express → Next.js/NestJS**

- ✅ Migrated entire frontend from React (CRA/Vite) to **Next.js 14** with App Router
- ✅ Refactored backend from Express to **NestJS** with proper module architecture
- ✅ Implemented server-side rendering and API routes in Next.js
- ✅ Restructured backend with NestJS modules, controllers, and services
- ✅ Maintained all original functionality while improving code organization

### 🎯 Custom Features Added

Beyond the migration, I implemented two major enhancements:

#### 1. **Follower/Following Profile Viewer**
View complete lists of followers and following directly from user profile pages:
- Dedicated tabs for followers and following lists
- Real-time updates when follow relationships change
- User cards with quick follow/unfollow actions
- Click-through navigation to individual profiles
- Responsive design for mobile and desktop

#### 2. **Enhanced User Discovery (Load More)**
Improved "Who to Follow" component with pagination:
- **Load More** button to fetch additional user recommendations
- Prevents duplicate suggestions
- Filters out already-followed users
- Smooth loading states and error handling
- Optimized API calls to reduce server load

## 🛠️ Tech Stack

### Frontend (Migrated to Next.js)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS / CSS Modules
- **State Management**: React Hooks & Context
- **Real-time**: Stream Chat React SDK
- **Video**: Stream Video React SDK
- **HTTP Client**: Axios / Fetch API

### Backend (Migrated to NestJS)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js with JWT & Google OAuth
- **Real-time Services**: Stream Chat & Video APIs
- **Validation**: class-validator & class-transformer
- **Architecture**: Modular with Controllers, Services, Guards

### Infrastructure
- **Deployment**: Render
- **Database**: MongoDB Atlas
- **CDN**: Stream's global infrastructure

## 📦 Prerequisites

Before running this project, ensure you have:

- Node.js (v18 or higher)
- pnpm (recommended) or npm/yarn
- MongoDB (local instance or Atlas account)
- Stream account (for Chat & Video API keys)
- Google Cloud Console account (for OAuth credentials)

## ⚙️ Environment Setup

### Backend Configuration

Create a `.env` file in the `backend` directory:
```bash
# Stream Configuration (get from https://getstream.io/)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Google OAuth (get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT Secret (create your own secure random string)
JWT_SECRET=your_super_secret_jwt_key_here

# MongoDB (use local or https://www.mongodb.com/atlas)
MONGODB_URI=mongodb://localhost:27017/social-connect
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social-connect

# Server Configuration
PORT=3001

# Optional fields (can be left empty)
MAILER_HOST=
MAILER_PORT=
MAILER_USER=
MAILER_PASS=
```

**Important MongoDB Atlas Users:**
- Go to Network Access in your Atlas dashboard
- Click "Add IP Address"
- Select "Allow Access from Anywhere" (0.0.0.0/0)
- This is required for the app to connect to your database

### Frontend Configuration

Create a `.env.local` file in the `frontend` directory:
```bash
# Stream API Key (same as backend)
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Installation & Running Locally

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd social-connect
```

2. **Setup Backend**
```bash
# Copy environment file (or create .env manually)
mv backend.env.example.txt backend/.env

# Navigate to backend
cd backend

# Install dependencies
pnpm install

# Start development server
pnpm start:dev
```

3. **Setup Frontend** (in a new terminal)
```bash
# Copy environment file (or create .env.local manually)
mv frontend.env.example.txt frontend/.env.local

# Navigate to frontend
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### ⚠️ Important Notes

- **DO NOT change the backend port from 3001** - it's configured in the CORS settings
- **Frontend must run on localhost:3000** - this is whitelisted in the backend CORS configuration
- If you need different ports, update the `enableCors` origin in `backend/src/main.ts`

## 🏗️ Project Structure
```
social-connect/
├── frontend/                  # Next.js application
│   ├── app/                  # App Router pages
│   ├── components/           # Reusable components
│   │   ├── WhoToFollow.tsx  # Enhanced with load more
│   │   └── ...
│   ├── lib/                  # Utilities and helpers
│   └── public/               # Static assets
│
├── backend/                   # NestJS application
│   ├── src/
│   │   ├── auth/             # Authentication module
│   │   ├── users/            # Users module (with follow features)
│   │   ├── stream/           # Stream integration
│   │   └── main.ts           # Application entry
│   └── ...
│
└── README.md
```

## 🎨 Features Breakdown

### User Management
- Register/Login with Google OAuth
- Profile creation and editing
- Avatar upload and display
- Bio and personal information

### Social Features
- Follow/Unfollow users
- View followers list from profile
- View following list from profile
- User search and discovery
- Load more users in recommendations

### Communication
- One-on-one video calls
- Group video conferences
- Real-time text chat
- Message history
- Typing indicators

## 🔧 Development Scripts

### Backend
```bash
pnpm start:dev    # Start development server with hot reload
pnpm start        # Start production server
pnpm build        # Build for production
pnpm test         # Run unit tests
pnpm lint         # Lint code
```

### Frontend
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Lint code
```

## 🚢 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd backend && pnpm install && pnpm build`
4. Set start command: `cd backend && pnpm start:prod`
5. Add all environment variables from `.env`

### Frontend (Render/Vercel)
1. Connect your GitHub repository
2. Set root directory to `frontend`
3. Framework preset: Next.js
4. Add environment variables from `.env.local`
5. Deploy

## 🤝 Contributing

This is a learning project showcasing framework migration and feature development. Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Use as reference for your own migrations

## 📚 What I Learned

Through this migration project, I gained experience with:

- **Framework Migration**: Successfully migrating a full application between major frameworks
- **Next.js App Router**: Modern Next.js patterns and server components
- **NestJS Architecture**: Modular backend design with dependency injection
- **API Design**: RESTful endpoints and real-time integrations
- **Database Management**: MongoDB schemas and Mongoose ODM
- **Authentication**: OAuth flows and JWT token management
- **Real-time Features**: WebRTC video calls and WebSocket chat
- **Deployment**: Full-stack deployment on Render

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Original tutorial that inspired this project
- Stream.io for their excellent APIs
- The Next.js and NestJS communities
- Google OAuth for authentication infrastructure

## 📧 Contact

For questions, issues, or collaboration opportunities, please open an issue in the repository.

---

**Built with ❤️ as a learning project in framework migration and full-stack development**
