# 🚀 Vercel Deployment Guide

This guide will help you deploy your Front Desk System to Vercel with PostgreSQL database.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **PostgreSQL Database**: We'll use Vercel Postgres

## 🔧 Step-by-Step Deployment

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `danithad/Front-Desk-System`
4. Select the repository and click "Import"

### 2. Configure Project Settings

1. **Framework Preset**: Next.js (should be auto-detected)
2. **Root Directory**: `frontend` (since your Next.js app is in the frontend folder)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 3. Set Up Environment Variables

In your Vercel project settings, add these environment variables:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Set Up Vercel Postgres

1. In your Vercel project dashboard, go to "Storage"
2. Click "Create Database"
3. Select "Postgres"
4. Choose a plan (Hobby is free)
5. Select a region close to your users
6. Click "Create"

### 5. Connect Database to Project

1. After creating the database, Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

2. These will be automatically available to your API routes

### 6. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

### 7. Initialize Database

After deployment, you need to initialize the database:

1. Visit: `https://your-project-name.vercel.app/api/init`
2. This will create all tables and sample data
3. You should see a success message with admin credentials

## 🔐 Default Login Credentials

After database initialization:
- **Email**: `admin@clinic.com`
- **Password**: `admin123`

## 📁 Project Structure for Vercel

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   │       └── route.ts
│   │   │   ├── queue/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── status/
│   │   │   │       │   └── route.ts
│   │   │   │       └── priority/
│   │   │   │           └── route.ts
│   │   │   ├── doctors/
│   │   │   │   └── route.ts
│   │   │   ├── appointments/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── status/
│   │   │   │           └── route.ts
│   │   │   └── init/
│   │   │       └── route.ts
│   │   ├── components/             # React Components
│   │   ├── contexts/               # React Contexts
│   │   └── ...
│   └── ...
├── package.json
├── vercel.json
└── ...
```

## 🔧 API Endpoints

Your API routes will be available at:
- `POST /api/auth/login` - User authentication
- `GET /api/queue` - Get all patients in queue
- `POST /api/queue` - Add patient to queue
- `PUT /api/queue/[id]/status` - Update patient status
- `PUT /api/queue/[id]/priority` - Update patient priority
- `DELETE /api/queue/[id]` - Remove patient from queue
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Add new doctor
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/[id]/status` - Update appointment status
- `DELETE /api/appointments/[id]` - Cancel appointment
- `GET /api/appointments/available-slots/[doctorId]` - Get available time slots
- `POST /api/init` - Initialize database

## 🚨 Important Notes

1. **Database Initialization**: You must call `/api/init` after deployment to set up the database
2. **Environment Variables**: Make sure `JWT_SECRET` is set in Vercel
3. **CORS**: No CORS configuration needed since frontend and API are on the same domain
4. **File System**: Vercel is serverless, so no file system access (no SQLite)

## 🔍 Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure TypeScript types are installed
- Verify all imports are correct

### Database Errors
- Make sure Vercel Postgres is connected
- Check environment variables are set
- Call `/api/init` to initialize database

### API Errors
- Check browser console for errors
- Verify API routes are in correct locations
- Ensure database tables exist

## 🎉 Success!

Once deployed, your Front Desk System will be fully functional on Vercel with:
- ✅ Next.js frontend
- ✅ API routes for all functionality
- ✅ PostgreSQL database
- ✅ JWT authentication
- ✅ Queue management
- ✅ Appointment management
- ✅ Doctor management

Your app will be available at: `https://your-project-name.vercel.app`
