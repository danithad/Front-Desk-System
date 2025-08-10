import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const id = parseInt(params.id)

    if (!status || !['Waiting', 'With Doctor', 'Completed'].includes(status)) {
      return NextResponse.json(
        { message: 'Valid status is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE patient_queue 
      SET status = ${status}, updatedAt = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating status:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
