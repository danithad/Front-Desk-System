'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Clock, User, Plus, X, Search } from 'lucide-react'
import { format } from 'date-fns'

interface Doctor {
  id: number
  name: string
  specialization: string
  status: 'Available' | 'Busy' | 'Off Duty'
  nextAvailable: string | null
}

interface Appointment {
  id: number
  patientName: string
  doctorId: number
  date: string
  time: string
  status: 'Booked' | 'Completed' | 'Canceled'
  doctor: Doctor
}

const appointmentSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  doctorId: z.number().min(1, 'Please select a doctor'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
})

type AppointmentForm = z.infer<typeof appointmentSchema>

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filter, setFilter] = useState('All')
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [searchTerm, setSearchTerm] = useState('')
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
  })

  const watchedDoctorId = watch('doctorId')
  const watchedDate = watch('date')

  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
  }, [selectedDate])

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/api/appointments?date=${selectedDate}`)
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors')
      setDoctors(response.data)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const scheduleAppointment = async (data: AppointmentForm) => {
    try {
      await axios.post('/api/appointments', data)
      setShowScheduleForm(false)
      reset()
      fetchAppointments()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error scheduling appointment')
    }
  }

  const updateAppointmentStatus = async (id: number, status: Appointment['status']) => {
    try {
      await axios.put(`/api/appointments/${id}/status`, { status })
      fetchAppointments()
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const cancelAppointment = async (id: number) => {
    try {
      await axios.delete(`/api/appointments/${id}`)
      fetchAppointments()
    } catch (error) {
      console.error('Error canceling appointment:', error)
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'All' || appointment.status === filter
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'Booked':
        return 'text-blue-500'
      case 'Completed':
        return 'text-green-500'
      case 'Canceled':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getDoctorStatusColor = (status: Doctor['status']) => {
    switch (status) {
      case 'Available':
        return 'text-green-500'
      case 'Busy':
        return 'text-yellow-500'
      case 'Off Duty':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Appointment Management</h3>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-white">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-white">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search patients"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Available Doctors */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Available Doctors</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{doctor.name}</h5>
                    <p className="text-gray-400 text-sm">{doctor.specialization}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${getDoctorStatusColor(doctor.status)}`}>
                  {doctor.status}
                </span>
              </div>
              <div className="mt-3 flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>
                  Next available: {doctor.nextAvailable ? format(new Date(doctor.nextAvailable), 'MMM dd, hh:mm a') : 'Now'}
                </span>
              </div>
              <button className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm">
                View Schedule
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div>
        <h4 className="text-lg font-medium text-white mb-4">Appointments</h4>
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <h5 className="text-white font-medium">{appointment.patientName}</h5>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <User className="h-4 w-4" />
                    <span>{appointment.doctor.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                <select
                  value={appointment.status}
                  onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as Appointment['status'])}
                  className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Booked">Booked</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
                <button
                  onClick={() => cancelAppointment(appointment.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule New Appointment Button */}
      <button
        onClick={() => setShowScheduleForm(true)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
      >
        <Plus className="h-5 w-5" />
        <span>Schedule New Appointment</span>
      </button>

      {/* Schedule Appointment Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Schedule New Appointment</h3>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">Enter the appointment details.</p>
            <form onSubmit={handleSubmit(scheduleAppointment)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Patient
                </label>
                <input
                  {...register('patientName')}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient name"
                />
                {errors.patientName && (
                  <p className="text-red-400 text-sm mt-1">{errors.patientName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Doctor
                </label>
                <select
                  {...register('doctorId', { valueAsNumber: true })}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                {errors.doctorId && (
                  <p className="text-red-400 text-sm mt-1">{errors.doctorId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time
                </label>
                <div className="relative">
                  <input
                    {...register('time')}
                    type="time"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {errors.time && (
                  <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date
                </label>
                <input
                  {...register('date')}
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.date && (
                  <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
