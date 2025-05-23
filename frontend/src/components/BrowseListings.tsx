'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Clock, Shield, User, DollarSign } from 'lucide-react'

interface BrowseListingsProps {
  publicKey: string
}

interface TokenListing {
  id: number
  lender: string
  tokenSymbol: string
  amount: string
  rentalRate: string
  minDuration: number
  maxDuration: number
  collateralRate: string
  isAvailable: boolean
}

export default function BrowseListings({ publicKey }: BrowseListingsProps) {
  const [listings, setListings] = useState<TokenListing[]>([])
  const [filteredListings, setFilteredListings] = useState<TokenListing[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedToken, setSelectedToken] = useState('all')
  const [sortBy, setSortBy] = useState('rate-low')
  const [isLoading, setIsLoading] = useState(true)

  const tokenFilters = ['all', 'USDC', 'XLM', 'USDT', 'BTC']

  useEffect(() => {
    loadListings()
  }, [])

  useEffect(() => {
    filterAndSortListings()
  }, [listings, searchTerm, selectedToken, sortBy])

  const loadListings = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual contract calls
      const mockListings: TokenListing[] = [
        {
          id: 1,
          lender: 'GABC...XYZ',
          tokenSymbol: 'USDC',
          amount: '1000',
          rentalRate: '3.5',
          minDuration: 1,
          maxDuration: 30,
          collateralRate: '15',
          isAvailable: true
        },
        {
          id: 2,
          lender: 'GDEF...UVW',
          tokenSymbol: 'XLM',
          amount: '5000',
          rentalRate: '5.0',
          minDuration: 3,
          maxDuration: 14,
          collateralRate: '20',
          isAvailable: true
        },
        {
          id: 3,
          lender: 'GHIJ...RST',
          tokenSymbol: 'USDT',
          amount: '2500',
          rentalRate: '4.2',
          minDuration: 1,
          maxDuration: 60,
          collateralRate: '12',
          isAvailable: true
        }
      ]

      setListings(mockListings)
    } catch (error) {
      console.error('Error loading listings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortListings = () => {
    let filtered = listings.filter(listing => {
      const matchesSearch = listing.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.lender.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesToken = selectedToken === 'all' || listing.tokenSymbol === selectedToken
      
      return matchesSearch && matchesToken && listing.isAvailable
    })

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rate-low':
          return parseFloat(a.rentalRate) - parseFloat(b.rentalRate)
        case 'rate-high':
          return parseFloat(b.rentalRate) - parseFloat(a.rentalRate)
        case 'amount-low':
          return parseFloat(a.amount) - parseFloat(b.amount)
        case 'amount-high':
          return parseFloat(b.amount) - parseFloat(a.amount)
        default:
          return 0
      }
    })

    setFilteredListings(filtered)
  }

  const handleRentTokens = async (listing: TokenListing, duration: number) => {
    try {
      console.log('Renting tokens:', { listing, duration })
      // Here you would call the smart contract
      alert(`Rental request for ${listing.amount} ${listing.tokenSymbol} for ${duration} days`)
    } catch (error) {
      console.error('Error renting tokens:', error)
      alert('Failed to rent tokens. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Token Listings</h1>
        <p className="text-gray-600">
          Find and rent tokens from other users with flexible terms
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tokens or lenders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Token Filter */}
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {tokenFilters.map(token => (
              <option key={token} value={token}>
                {token === 'all' ? 'All Tokens' : token}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rate-low">Rate: Low to High</option>
            <option value="rate-high">Rate: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
            <option value="amount-high">Amount: High to Low</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-center text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            {filteredListings.length} listings found
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Listings Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onRent={handleRentTokens}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ListingCardProps {
  listing: TokenListing
  onRent: (listing: TokenListing, duration: number) => void
}

function ListingCard({ listing, onRent }: ListingCardProps) {
  const [selectedDuration, setSelectedDuration] = useState(listing.minDuration)
  const [isExpanded, setIsExpanded] = useState(false)

  const calculateCosts = () => {
    const amount = parseFloat(listing.amount)
    const rate = parseFloat(listing.rentalRate)
    const collateralRate = parseFloat(listing.collateralRate)
    
    const rentalFee = (amount * rate * selectedDuration) / 100
    const collateral = (amount * collateralRate) / 100
    const platformFee = rentalFee * 0.025 // 2.5% platform fee
    
    return {
      rentalFee: rentalFee.toFixed(2),
      collateral: collateral.toFixed(2),
      platformFee: platformFee.toFixed(2),
      total: (rentalFee + collateral + platformFee).toFixed(2)
    }
  }

  const costs = calculateCosts()

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {listing.tokenSymbol.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{listing.amount} {listing.tokenSymbol}</h3>
              <p className="text-sm text-gray-500 flex items-center">
                <User className="w-3 h-3 mr-1" />
                {listing.lender.slice(0, 8)}...
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">{listing.rentalRate}%</div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {listing.minDuration}-{listing.maxDuration} days
          </div>
          <div className="flex items-center text-gray-600">
            <Shield className="w-4 h-4 mr-2" />
            {listing.collateralRate}% collateral
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rental Duration
          </label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from(
              { length: listing.maxDuration - listing.minDuration + 1 },
              (_, i) => listing.minDuration + i
            ).map(days => (
              <option key={days} value={days}>
                {days} day{days > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Rental Fee:</span>
            <span className="font-medium">{costs.rentalFee} {listing.tokenSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Collateral:</span>
            <span className="font-medium">{costs.collateral} {listing.tokenSymbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform Fee:</span>
            <span className="font-medium">{costs.platformFee} {listing.tokenSymbol}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total Cost:</span>
            <span>{costs.total} {listing.tokenSymbol}</span>
          </div>
        </div>

        <button
          onClick={() => onRent(listing, selectedDuration)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <DollarSign className="w-4 h-4" />
          <span>Rent Tokens</span>
        </button>
      </div>
    </div>
  )
} 