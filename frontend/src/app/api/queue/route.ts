import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

// GET - Get all patients in queue
export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM patient_queue 
      ORDER BY priority DESC, arrivalTime ASC
    `
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching queue:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add new patient to queue
export async function POST(request: NextRequest) {
  try {
    const { patientName, priority = 'Normal', estWaitTime = 0 } = await request.json()

    if (!patientName) {
      return NextResponse.json(
        { message: 'Patient name is required' },
        { status: 400 }
      )
    }

    // Get the next queue number
    const lastPatientResult = await sql`
      SELECT queueNumber FROM patient_queue 
      ORDER BY queueNumber DESC 
      LIMIT 1
    `
    
    const nextQueueNumber = lastPatientResult.rows.length > 0 
      ? lastPatientResult.rows[0].queuenumber + 1 
      : 1

    // Insert new patient
    const result = await sql`
      INSERT INTO patient_queue (patientName, arrivalTime, estWaitTime, status, priority, queueNumber)
      VALUES (${patientName}, NOW(), ${estWaitTime}, 'Waiting', ${priority}, ${nextQueueNumber})
      RETURNING *
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error adding patient:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
