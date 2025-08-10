'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, User, AlertTriangle, X, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface PatientQueue {
  id: number
  patientName: string
  arrivalTime: string
  estWaitTime: number
  status: 'Waiting' | 'With Doctor' | 'Completed'
  priority: 'Normal' | 'Urgent'
  queueNumber: number
}

const addPatientSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  priority: z.enum(['Normal', 'Urgent']),
})

type AddPatientForm = z.infer<typeof addPatientSchema>

export default function QueueManagement() {
  const [patients, setPatients] = useState<PatientQueue[]>([])
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddPatientForm>({
    resolver: zodResolver(addPatientSchema),
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:3001/queue')
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPatient = async (data: AddPatientForm) => {
    try {
      await axios.post('http://localhost:3001/queue', data)
      setShowAddForm(false)
      reset()
      fetchPatients()
    } catch (error) {
      console.error('Error adding patient:', error)
    }
  }

  const updateStatus = async (id: number, status: PatientQueue['status']) => {
    try {
      await axios.put(`http://localhost:3001/queue/${id}/status`, { status })
      fetchPatients()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const updatePriority = async (id: number, priority: PatientQueue['priority']) => {
    try {
      await axios.put(`http://localhost:3001/queue/${id}/priority`, { priority })
      fetchPatients()
    } catch (error) {
      console.error('Error updating priority:', error)
    }
  }

  const removePatient = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/queue/${id}`)
      fetchPatients()
    } catch (error) {
      console.error('Error removing patient:', error)
    }
  }

  const filteredPatients = patients.filter(patient => {
    const matchesFilter = filter === 'All' || patient.status === filter
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusIcon = (status: PatientQueue['status']) => {
    switch (status) {
      case 'Waiting':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'With Doctor':
        return <User className="h-4 w-4 text-blue-500" />
      case 'Completed':
        return <Clock className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: PatientQueue['status']) => {
    switch (status) {
      case 'Waiting':
        return 'text-yellow-500'
      case 'With Doctor':
        return 'text-blue-500'
      case 'Completed':
        return 'text-green-500'
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
        <h3 className="text-xl font-semibold text-white">Queue Management</h3>
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
            <option value="Waiting">Waiting</option>
            <option value="With Doctor">With Doctor</option>
            <option value="Completed">Completed</option>
          </select>
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
            <Clock className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                {patient.queueNumber}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-white font-medium">{patient.patientName}</h4>
                  {patient.priority === 'Urgent' && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  {getStatusIcon(patient.status)}
                  <span className={getStatusColor(patient.status)}>{patient.status}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Arrival: {format(new Date(patient.arrivalTime), 'hh:mm a')} | 
                  Est. Wait: {patient.estWaitTime} min
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={patient.status}
                onChange={(e) => updateStatus(patient.id, e.target.value as PatientQueue['status'])}
                className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Waiting">Waiting</option>
                <option value="With Doctor">With Doctor</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={patient.priority}
                onChange={(e) => updatePriority(patient.id, e.target.value as PatientQueue['priority'])}
                className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
              <button
                onClick={() => removePatient(patient.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Patient Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
      >
        <Plus className="h-5 w-5" />
        <span>Add New Patient to Queue</span>
      </button>

      {/* Add Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Add New Patient</h3>
            <form onSubmit={handleSubmit(addPatient)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Patient Name
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
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                </select>
                {errors.priority && (
                  <p className="text-red-400 text-sm mt-1">{errors.priority.message}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Patient'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
