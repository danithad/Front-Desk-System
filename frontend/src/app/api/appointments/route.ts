import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

// GET - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    let query = sql`
      SELECT a.*, d.name as doctorName, d.specialization 
      FROM appointments a
      LEFT JOIN doctors d ON a.doctorId = d.id
    `

    if (date) {
      query = sql`
        SELECT a.*, d.name as doctorName, d.specialization 
        FROM appointments a
        LEFT JOIN doctors d ON a.doctorId = d.id
        WHERE DATE(a.date) = ${date}
      `
    }

    query = sql`${query} ORDER BY a.date ASC, a.time ASC`
    
    const result = await query
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new appointment
export async function POST(request: NextRequest) {
  try {
    const { patientName, doctorId, date, time } = await request.json()

    if (!patientName || !doctorId || !date || !time) {
      return NextResponse.json(
        { message: 'Patient name, doctor ID, date, and time are required' },
        { status: 400 }
      )
    }

    // Check for conflicting appointments
    const conflictResult = await sql`
      SELECT id FROM appointments 
      WHERE doctorId = ${doctorId} 
      AND date = ${date} 
      AND time = ${time} 
      AND status = 'Booked'
    `

    if (conflictResult.rows.length > 0) {
      return NextResponse.json(
        { message: 'This time slot is already booked' },
        { status: 400 }
      )
    }

    // Create appointment
    const result = await sql`
      INSERT INTO appointments (patientName, doctorId, date, time, status)
      VALUES (${patientName}, ${doctorId}, ${date}, ${time}, 'Booked')
      RETURNING *
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
