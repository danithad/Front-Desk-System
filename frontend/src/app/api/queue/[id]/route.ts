import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    const result = await sql`
      DELETE FROM patient_queue 
      WHERE id = ${id}
      RETURNING *
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Patient removed from queue' })
  } catch (error) {
    console.error('Error removing patient:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
