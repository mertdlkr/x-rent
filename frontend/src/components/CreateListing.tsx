'use client'

import { useState } from 'react'
import { Plus, Info, DollarSign, Clock, Shield } from 'lucide-react'

interface CreateListingProps {
  publicKey: string
}

export default function CreateListing({ publicKey }: CreateListingProps) {
  const [formData, setFormData] = useState({
    tokenAddress: '',
    tokenSymbol: 'USDC',
    amount: '',
    rentalRate: '',
    minDuration: '1',
    maxDuration: '30',
    collateralRate: '15'
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const commonTokens = [
    { symbol: 'USDC', name: 'USD Coin', address: 'USDC_ADDRESS' },
    { symbol: 'XLM', name: 'Stellar Lumens', address: 'XLM_ADDRESS' },
    { symbol: 'USDT', name: 'Tether USD', address: 'USDT_ADDRESS' },
    { symbol: 'BTC', name: 'Bitcoin', address: 'BTC_ADDRESS' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!formData.rentalRate || parseFloat(formData.rentalRate) <= 0) {
      newErrors.rentalRate = 'Rental rate must be greater than 0'
    }

    if (parseInt(formData.minDuration) > parseInt(formData.maxDuration)) {
      newErrors.maxDuration = 'Max duration must be greater than min duration'
    }

    if (!formData.tokenAddress) {
      newErrors.tokenAddress = 'Please select a token'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Here you would call the smart contract
      console.log('Creating listing with data:', formData)
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Listing created successfully!')
      
      // Reset form
      setFormData({
        tokenAddress: '',
        tokenSymbol: 'USDC',
        amount: '',
        rentalRate: '',
        minDuration: '1',
        maxDuration: '30',
        collateralRate: '15'
      })
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Failed to create listing. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectToken = (token: any) => {
    setFormData(prev => ({
      ...prev,
      tokenSymbol: token.symbol,
      tokenAddress: token.address
    }))
  }

  const calculatePreview = () => {
    const amount = parseFloat(formData.amount) || 0
    const rate = parseFloat(formData.rentalRate) || 0
    const maxDays = parseInt(formData.maxDuration) || 0
    
    const maxEarnings = (amount * rate * maxDays) / 100
    const collateral = (amount * parseFloat(formData.collateralRate)) / 100
    
    return { maxEarnings, collateral }
  }

  const preview = calculatePreview()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Token Listing</h1>
        <p className="text-gray-600">
          List your tokens for rental and earn passive income from other users
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Token Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Token
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonTokens.map((token) => (
                  <button
                    key={token.symbol}
                    type="button"
                    onClick={() => selectToken(token)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.tokenSymbol === token.symbol
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-xs text-gray-500">{token.name}</div>
                  </button>
                ))}
              </div>
              {errors.tokenAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.tokenAddress}</p>
              )}
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Lend
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-3 text-gray-500">
                  {formData.tokenSymbol}
                </span>
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Rental Rate */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Rental Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.rentalRate}
                  onChange={(e) => handleInputChange('rentalRate', e.target.value)}
                  placeholder="e.g., 5 for 5% per day"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
                <span className="absolute right-3 top-3 text-gray-500">%</span>
              </div>
              {errors.rentalRate && (
                <p className="text-red-500 text-sm mt-1">{errors.rentalRate}</p>
              )}
            </div>

            {/* Duration Range */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.minDuration}
                  onChange={(e) => handleInputChange('minDuration', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.maxDuration}
                  onChange={(e) => handleInputChange('maxDuration', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
                {errors.maxDuration && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxDuration}</p>
                )}
              </div>
            </div>

            {/* Collateral Rate */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Collateral (%)
              </label>
              <input
                type="number"
                value={formData.collateralRate}
                onChange={(e) => handleInputChange('collateralRate', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="10"
                max="50"
                step="1"
              />
              <p className="text-gray-500 text-sm mt-1">
                Borrowers must provide this percentage as collateral (10-50%)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Listing</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Earnings Preview */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              Earnings Preview
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Max Earnings:</span>
                <span className="font-semibold">
                  {preview.maxEarnings.toFixed(2)} {formData.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Required Collateral:</span>
                <span className="font-semibold">
                  {preview.collateral.toFixed(2)} {formData.tokenSymbol}
                </span>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Important Information
            </h3>
            
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>Your tokens will be held in a secure smart contract escrow</span>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>Rental fees are paid upfront by borrowers</span>
              </div>
              <div className="flex items-start space-x-2">
                <DollarSign className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>Platform takes a 2.5% fee from rental earnings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 