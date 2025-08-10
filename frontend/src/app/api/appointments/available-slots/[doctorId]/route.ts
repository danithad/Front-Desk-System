import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const doctorId = parseInt(params.doctorId)

    if (!date) {
      return NextResponse.json(
        { message: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Get booked appointments for the doctor on the specified date
    const bookedResult = await sql`
      SELECT time FROM appointments 
      WHERE doctorId = ${doctorId} 
      AND date = ${date} 
      AND status = 'Booked'
    `

    const bookedTimes = bookedResult.rows.map(row => row.time)

    // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
    const availableSlots = []
    const startHour = 9
    const endHour = 17

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        if (!bookedTimes.includes(time)) {
          availableSlots.push(time)
        }
      }
    }

    return NextResponse.json(availableSlots)
  } catch (error) {
    console.error('Error getting available slots:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
