# 🏥 Front Desk System - Clinic Management

A modern, full-stack web application for managing patient queues and doctor appointments at a clinic. Built with NestJS backend and Next.js frontend.

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- Role-based access control (Admin, Front Desk)
- Secure login/logout functionality

### 📋 Queue Management
- Add walk-in patients with automatic queue numbering
- Update patient status (Waiting → With Doctor → Completed)
- Set priority levels (Normal/Urgent) with urgent patients appearing first
- Filter and search patients
- Remove patients from queue
- Real-time queue position tracking

### 📅 Appointment Management
- View available doctors and their current status
- Schedule appointments with conflict detection
- Update appointment status (Booked → Completed → Canceled)
- Filter appointments by date and status
- Cancel appointments
- Available time slots calculation

### 👨‍⚕️ Doctor Management
- View all doctors with their specializations
- Track doctor availability status (Available, Busy, Off Duty)
- Update doctor status and next available time
- Sample doctors pre-loaded

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: SQLite (TypeORM)
- **Authentication**: JWT (Passport)
- **Validation**: class-validator, class-transformer
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd front-desk-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Backend**
   ```bash
   cd ../backend
   npm run start:dev
   ```
   The backend will run on http://localhost:3001

5. **Start the Frontend**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will run on http://localhost:3002

### Default Login Credentials
- **Email**: `admin@clinic.com`
- **Password**: `admin123`

## 📁 Project Structure

```
front-desk-system/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── doctors/        # Doctor management
│   │   ├── queue/          # Patient queue management
│   │   ├── appointments/   # Appointment management
│   │   ├── entities/       # Database entities
│   │   ├── seed/           # Database seeding
│   │   └── main.ts         # Application entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   └── contexts/      # React contexts
│   ├── package.json
│   └── tailwind.config.js
├── README.md
├── QUICK_START.md
├── start.bat              # Windows startup script
└── start.sh               # Linux/Mac startup script
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login

### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors/:id` - Get doctor by ID
- `POST /doctors` - Create new doctor
- `PUT /doctors/:id` - Update doctor
- `DELETE /doctors/:id` - Delete doctor
- `PUT /doctors/:id/status` - Update doctor status

### Queue Management
- `GET /queue` - Get all patients in queue
- `GET /queue/:id` - Get patient by ID
- `POST /queue` - Add patient to queue
- `PUT /queue/:id` - Update patient
- `DELETE /queue/:id` - Remove patient from queue
- `PUT /queue/:id/status` - Update patient status
- `PUT /queue/:id/priority` - Update patient priority
- `GET /queue/:id/position` - Get queue position

### Appointments
- `GET /appointments` - Get all appointments
- `GET /appointments/:id` - Get appointment by ID
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Cancel appointment
- `PUT /appointments/:id/status` - Update appointment status
- `GET /appointments/available-slots/:doctorId` - Get available time slots

## 🗄️ Database Schema

### Users
- `id`, `name`, `email`, `passwordHash`, `role`, `createdAt`, `updatedAt`

### Doctors
- `id`, `name`, `specialization`, `gender`, `location`, `status`, `nextAvailable`, `createdAt`, `updatedAt`

### PatientQueue
- `id`, `patientName`, `arrivalTime`, `estWaitTime`, `status`, `priority`, `queueNumber`, `createdAt`, `updatedAt`

### Appointments
- `id`, `patientName`, `doctorId`, `date`, `time`, `status`, `createdAt`, `updatedAt`

## 🎯 Key Features Implementation

### Queue Priority System
- Urgent patients automatically appear at the top of the queue
- Queue numbers are automatically assigned
- Real-time status updates

### Appointment Conflict Detection
- Prevents double-booking of time slots
- Validates doctor availability
- Calculates available time slots

### Sample Data
The system comes pre-loaded with:
- Admin user (admin@clinic.com / admin123)
- 4 sample doctors with different specializations and statuses

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Start production server: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Start production server: `npm start`

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Protected API routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please create an issue in the GitHub repository.

---

**Built with ❤️ using NestJS and Next.js**
