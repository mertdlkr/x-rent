'use client'

import { useState, useEffect } from 'react'
import { Clock, DollarSign, Shield, TrendingUp, Calendar, Eye } from 'lucide-react'

interface RentalDashboardProps {
  publicKey: string
}

interface RentalData {
  id: number
  type: 'lending' | 'borrowing'
  tokenSymbol: string
  amount: string
  rate: string
  duration: string
  status: 'active' | 'completed' | 'expired'
  startDate: string
  endDate: string
}

export default function RentalDashboard({ publicKey }: RentalDashboardProps) {
  const [rentals, setRentals] = useState<RentalData[]>([])
  const [stats, setStats] = useState({
    totalEarned: '0',
    activeRentals: 0,
    totalLent: '0',
    totalBorrowed: '0'
  })

  useEffect(() => {
    loadUserData()
  }, [publicKey])

  const loadUserData = async () => {
    // Mock data - replace with actual contract calls
    const mockRentals: RentalData[] = [
      {
        id: 1,
        type: 'lending',
        tokenSymbol: 'USDC',
        amount: '1000',
        rate: '5%',
        duration: '7 days',
        status: 'active',
        startDate: '2025-01-15',
        endDate: '2025-01-22'
      },
      {
        id: 2,
        type: 'borrowing',
        tokenSymbol: 'XLM',
        amount: '500',
        rate: '3%',
        duration: '14 days',
        status: 'completed',
        startDate: '2025-01-01',
        endDate: '2025-01-15'
      }
    ]

    setRentals(mockRentals)
    setStats({
      totalEarned: '47.25',
      activeRentals: 1,
      totalLent: '1000',
      totalBorrowed: '500'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'lending' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-black">${stats.totalEarned}</h3>
          <p className="text-gray-800">Total Earned</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-black">{stats.activeRentals}</h3>
          <p className="text-gray-800">Active Rentals</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-black">${stats.totalLent}</h3>
          <p className="text-gray-800">Total Lent</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-black">${stats.totalBorrowed}</h3>
          <p className="text-gray-800">Total Borrowed</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Recent Activity</h2>
        </div>
        
        <div className="p-6">
          {rentals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-black mb-2">No Activity Yet</h3>
              <p className="text-gray-700">Start lending or borrowing to see your activity here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rentals.map((rental) => (
                <div
                  key={rental.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(rental.type)}`}>
                        {rental.type === 'lending' ? 'Lending' : 'Borrowing'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">#{rental.id}</span>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-700">Token & Amount</p>
                      <p className="font-semibold text-gray-900">{rental.amount} {rental.tokenSymbol}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Rate</p>
                      <p className="font-semibold text-gray-900">{rental.rate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Duration</p>
                      <p className="font-semibold text-gray-900">{rental.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">Period</p>
                      <p className="font-semibold text-sm text-gray-900">
                        {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {rental.status === 'active' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Expires in {Math.ceil((new Date(rental.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                        {rental.type === 'borrowing' && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Return Tokens
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 