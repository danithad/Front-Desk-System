import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

// GET - Get all doctors
export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM doctors 
      ORDER BY name ASC
    `
    
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add new doctor
export async function POST(request: NextRequest) {
  try {
    const { name, specialization, gender, location, status = 'Available' } = await request.json()

    if (!name || !specialization || !gender || !location) {
      return NextResponse.json(
        { message: 'Name, specialization, gender, and location are required' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO doctors (name, specialization, gender, location, status)
      VALUES (${name}, ${specialization}, ${gender}, ${location}, ${status})
      RETURNING *
    `

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error adding doctor:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
