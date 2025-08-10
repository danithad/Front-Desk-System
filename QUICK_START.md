# Quick Start Guide - Front Desk System

## Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn

## Quick Setup

### 1. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE front_desk_system;
```

### 2. Backend Setup
```bash
cd front-desk-system/backend
npm install
cp env.example .env
# Edit .env with your database credentials
npm run start:dev
```

### 3. Frontend Setup
```bash
cd front-desk-system/frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### 5. Login Credentials
- **Email:** admin@clinic.com
- **Password:** admin123

## Windows Users
Run the `start.bat` file in the root directory to start both servers automatically.

## Linux/Mac Users
Run the `start.sh` file in the root directory to start both servers automatically.

## Features Available

### Queue Management
- Add walk-in patients with automatic queue numbers
- Update patient status (Waiting → With Doctor → Completed)
- Set priority (Normal/Urgent) - Urgent patients appear first
- Filter and search patients
- Remove patients from queue

### Appointment Management
- View available doctors and their status
- Schedule appointments with conflict detection
- Update appointment status
- Filter by date and status
- Cancel appointments

### Sample Data
The system comes with sample doctors:
- Dr. Smith (General Practice) - Available
- Dr. Johnson (Pediatrics) - Busy
- Dr. Lee (Cardiology) - Off Duty
- Dr. Patel (Dermatology) - Available

## API Documentation
All endpoints require JWT authentication (except login):
- Authentication: `POST /auth/login`
- Doctors: `GET/POST/PUT/DELETE /doctors`
- Queue: `GET/POST/PUT/DELETE /queue`
- Appointments: `GET/POST/PUT/DELETE /appointments`

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check database credentials in `.env` file
- Verify database `front_desk_system` exists

### Port Conflicts
- Backend runs on port 3001
- Frontend runs on port 3000
- Change ports in respective configuration files if needed

### CORS Issues
- Backend is configured to accept requests from `http://localhost:3000`
- Update CORS settings in `backend/src/main.ts` if needed

## Support
For issues and questions, please refer to the main README.md file.
