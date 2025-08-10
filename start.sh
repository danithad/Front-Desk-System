#!/bin/bash

echo "Starting Front Desk System..."
echo

echo "Starting Backend Server..."
cd backend
gnome-terminal --title="Backend Server" -- bash -c "npm run start:dev; exec bash" &

echo
echo "Starting Frontend Server..."
cd ../frontend
gnome-terminal --title="Frontend Server" -- bash -c "npm run dev; exec bash" &

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo
echo "Default login credentials:"
echo "Email: admin@clinic.com"
echo "Password: admin123"
echo
read -p "Press Enter to continue..."
