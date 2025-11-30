# Social Connect - Migrated Full-Stack Social Media Application

A modern, feature-rich social media platform **migrated from React/Express to Next.js/NestJS**, featuring real-time video calling, instant messaging, and comprehensive social networking capabilities powered by Stream.

## 🌐 Live Demo

<a href='https://streamify-frontend-t8hu.onrender.com/'> View Live Demo on Render </a>

*If the demo is unavailable, please contact me or run it locally using the instructions below.*

## 📋 Description

Social Connect is a full-stack social media application that I **completely migrated from React/Express to Next.js/NestJS** for improved performance, better developer experience, and modern architecture patterns. The platform combines traditional social networking features with real-time communication capabilities powered by Stream's APIs.

This project demonstrates a successful framework migration while maintaining all original functionality including real-time video calling, instant messaging, social networking with follow/follower relationships, and user discovery features.

The application prioritizes functionality and ease of testing, offering a streamlined authentication process without email verification requirements.

## 🔄 Migration Work

### What I Did

**Complete Framework Migration: React/Express → Next.js/NestJS**

- ✅ Migrated entire frontend from React (CRA/Vite) to **Next.js 14** with App Router
- ✅ Refactored complete backend from Express to **NestJS** with proper module architecture
- ✅ Implemented server-side rendering capabilities with Next.js
- ✅ Restructured backend with NestJS modules, controllers, services, and guards
- ✅ Converted all API routes to NestJS controller endpoints
- ✅ Updated authentication flow for NestJS Passport integration
- ✅ Migrated database models to NestJS/Mongoose schemas
- ✅ Refactored all React components to Next.js App Router patterns
- ✅ Updated state management to work with Next.js architecture
- ✅ Maintained 100% feature parity with original application
- ✅ Improved code organization and type safety throughout

**No additional features were added** - this was a pure migration project focused on modernizing the tech stack.

## ✨ Core Features (Preserved from Original)

### Communication Features
- 📹 HD Video Calling (Stream Video API)
- 💬 Real-time Chat (Stream Chat API)
- 🔔 Notifications

### Authentication
- 🔐 Google OAuth integration
- 🔑 JWT token management
- 🛡️ Protected routes

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
│   ├── lib/                  # Utilities and helpers
│   └── public/               # Static assets
│
├── backend/                   # NestJS application
│   ├── src/
│   │   ├── auth/             # Authentication module
│   │   ├── users/            # Users module
│   │   ├── stream/           # Stream integration
│   │   └── main.ts           # Application entry
│   └── ...
│
└── README.md
```

## 🎨 Features

### User Management
- Register/Login with Google OAuth
- Profile creation and editing
- Avatar upload and display
- Bio and personal information

### Social Features
- Follow/Unfollow users
- View followers and following lists
- User search and discovery
- "Who to Follow" recommendations

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

This is a learning project showcasing framework migration. Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests
- Use as reference for your own migrations

## 📚 What I Learned

Through this migration project, I gained hands-on experience with:

- **Framework Migration**: Successfully migrating a complete full-stack application between major frameworks
- **Next.js App Router**: Modern Next.js patterns, server components, and routing
- **NestJS Architecture**: Modular backend design with dependency injection and decorators
- **Type Safety**: Leveraging TypeScript across the entire stack
- **API Design**: Converting Express routes to NestJS controllers
- **Database Management**: Adapting Mongoose schemas to NestJS modules
- **Authentication**: Implementing Passport.js in NestJS context
- **Real-time Features**: Maintaining WebRTC video calls and WebSocket chat during migration
- **Code Organization**: Improving project structure and maintainability
- **Deployment**: Deploying migrated full-stack applications

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Original tutorial for the base functionality
- Stream.io for their excellent real-time APIs
- The Next.js and NestJS communities for documentation and support
- Google OAuth for authentication infrastructure

## 📧 Contact

For questions, issues, or collaboration opportunities, please open an issue in the repository.

---

**Built as a learning project in framework migration and modern full-stack development**
