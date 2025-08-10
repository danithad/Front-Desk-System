import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        passwordHash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'front_desk',
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      )
    `

    // Create doctors table
    await sql`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        gender VARCHAR(50) NOT NULL,
        location VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Available',
        nextAvailable TIMESTAMP,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      )
    `

    // Create patient_queue table
    await sql`
      CREATE TABLE IF NOT EXISTS patient_queue (
        id SERIAL PRIMARY KEY,
        patientName VARCHAR(255) NOT NULL,
        arrivalTime TIMESTAMP DEFAULT NOW(),
        estWaitTime INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Waiting',
        priority VARCHAR(50) DEFAULT 'Normal',
        queueNumber INTEGER NOT NULL,
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      )
    `

    // Create appointments table
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patientName VARCHAR(255) NOT NULL,
        doctorId INTEGER REFERENCES doctors(id),
        date DATE NOT NULL,
        time VARCHAR(10) NOT NULL,
        status VARCHAR(50) DEFAULT 'Booked',
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
      )
    `

    // Create admin user if not exists
    const adminCheck = await sql`
      SELECT id FROM users WHERE email = 'admin@clinic.com'
    `

    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await sql`
        INSERT INTO users (name, email, passwordHash, role)
        VALUES ('Admin User', 'admin@clinic.com', ${hashedPassword}, 'admin')
      `
    }

    // Create sample doctors if not exist
    const doctorsCheck = await sql`
      SELECT COUNT(*) as count FROM doctors
    `

    if (doctorsCheck.rows[0].count === '0') {
      await sql`
        INSERT INTO doctors (name, specialization, gender, location, status) VALUES
        ('Dr. Smith', 'General Practice', 'male', 'Room 101', 'Available'),
        ('Dr. Johnson', 'Pediatrics', 'female', 'Room 102', 'Busy'),
        ('Dr. Lee', 'Cardiology', 'male', 'Room 103', 'Off Duty'),
        ('Dr. Patel', 'Dermatology', 'female', 'Room 104', 'Available')
      `
    }

    return NextResponse.json({ 
      message: 'Database initialized successfully',
      adminUser: {
        email: 'admin@clinic.com',
        password: 'admin123'
      }
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { message: 'Database initialization failed' },
      { status: 500 }
    )
  }
}
