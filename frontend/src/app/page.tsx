'use client'

import { useState, useEffect } from 'react'
import { isConnected, requestAccess } from '@stellar/freighter-api'
import { 
  Wallet, 
  Clock, 
  Shield, 
  TrendingUp, 
  ArrowRight, 
  Star,
  Users,
  DollarSign,
  Zap,
  Globe,
  PlayCircle,
  Award,
  BarChart3,
  Flame,
  LogOut
} from 'lucide-react'
import ConnectWallet from '@/components/ConnectWallet'
import RentalDashboard from '@/components/RentalDashboard'
import CreateListing from '@/components/CreateListing'
import BrowseListings from '@/components/BrowseListings'

export default function HomePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rent' | 'lend'>('dashboard')
  const [animatedStats, setAnimatedStats] = useState({ 
    tvl: 0, 
    apy: 0, 
    users: 0, 
    volume: 0, 
    yield: 0,
    pools: 0
  })

  useEffect(() => {
    checkWalletConnection()
    animateStats()
  }, [])

  const animateStats = () => {
    const targets = { 
      tvl: 24.7, 
      apy: 18.5, 
      users: 15247, 
      volume: 8.3, 
      yield: 2.1,
      pools: 47
    }
    const duration = 2500
    const steps = 80
    const stepTime = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      
      setAnimatedStats({
        tvl: Number((targets.tvl * progress).toFixed(1)),
        apy: Number((targets.apy * progress).toFixed(1)),
        users: Math.floor(targets.users * progress),
        volume: Number((targets.volume * progress).toFixed(1)),
        yield: Number((targets.yield * progress).toFixed(1)),
        pools: Math.floor(targets.pools * progress)
      })

      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, stepTime)
  }

  const checkWalletConnection = async () => {
    try {
      const connected = await isConnected()
      if (connected) {
        // Using window.freighter as fallback
        const key = await (window as any).freighter?.getPublicKey?.() || 'mock-key'
        setPublicKey(key)
        setIsWalletConnected(true)
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const connectWallet = async () => {
    try {
      await requestAccess()
      // Using window.freighter as fallback
      const key = await (window as any).freighter?.getPublicKey?.() || 'mock-key'
      setPublicKey(key)
      setIsWalletConnected(true)
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const disconnectWallet = () => {
    setIsWalletConnected(false)
    setPublicKey('')
    // Reset active tab to dashboard when disconnecting
    setActiveTab('dashboard')
  }

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        
        <div className="relative z-10">
          <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">X-Rent</h1>
                  <div className="hidden md:block bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-3 py-1 rounded-full border border-blue-400/30">
                    <span className="text-blue-300 text-xs font-bold tracking-wider">DeFi Protocol</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#features" className="text-white/80 hover:text-white transition-colors">Protocol</a>
                  <a href="#stats" className="text-white/80 hover:text-white transition-colors">Analytics</a>
                  <a href="#yield" className="text-white/80 hover:text-white transition-colors">Yield</a>
                  <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Community</a>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium">
                    Launch App
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-lg rounded-full px-6 py-2 mb-8">
                <Flame className="w-4 h-4 text-orange-400 mr-2" />
                <span className="text-white/90 text-sm">🔥 Hottest DeFi Protocol on Stellar</span>
              </div>
              
              <h1 className="text-7xl md:text-8xl font-extrabold text-white mb-6 leading-tight">
                Next-Gen
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DeFi Lending
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
                Maximize yield on your crypto assets with our 
                <span className="text-blue-400 font-semibold"> automated lending protocol</span>. 
                Earn up to <span className="text-green-400 font-bold">18.5% APY</span> through 
                innovative yield farming strategies on Stellar blockchain.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <ConnectWallet onConnect={connectWallet} />
                <button className="group flex items-center bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl transition-all duration-300 backdrop-blur-lg border border-white/20">
                  <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </div>

              <div id="stats" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg mb-3 mx-auto">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">${animatedStats.tvl}M</div>
                  <div className="text-white/70 text-sm">Total Value Locked</div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg mb-3 mx-auto">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{animatedStats.apy}%</div>
                  <div className="text-white/70 text-sm">Max APY</div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg mb-3 mx-auto">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{animatedStats.users.toLocaleString()}</div>
                  <div className="text-white/70 text-sm">DeFi Users</div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/20 rounded-lg mb-3 mx-auto">
                    <BarChart3 className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">${animatedStats.volume}B</div>
                  <div className="text-white/70 text-sm">24h Volume</div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-pink-500/20 rounded-lg mb-3 mx-auto">
                    <Award className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">${animatedStats.yield}M</div>
                  <div className="text-white/70 text-sm">Daily Yield</div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-indigo-500/20 rounded-lg mb-3 mx-auto">
                    <Globe className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{animatedStats.pools}</div>
                  <div className="text-white/70 text-sm">Liquidity Pools</div>
                </div>
              </div>
            </div>
          </div>

          <div id="features" className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">Advanced DeFi Protocol</h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Experience the most sophisticated decentralized finance features with institutional-grade security
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Audited Smart Contracts</h3>
                <p className="text-white/70 mb-4">
                  Multiple security audits by leading firms. Battle-tested contracts with $24M+ TVL and zero exploits
                </p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                  <span className="text-sm font-medium">View Audit Reports</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Optimized Yield Farming</h3>
                <p className="text-white/70 mb-4">
                  Auto-compounding strategies, liquidity mining rewards, and dynamic APY optimization up to 18.5%
                </p>
                <div className="flex items-center text-green-400 group-hover:text-green-300">
                  <span className="text-sm font-medium">Calculate Yields</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Multi-Asset Liquidity Pools</h3>
                <p className="text-white/70 mb-4">
                  Support for 50+ crypto assets with automated market making and impermanent loss protection
                </p>
                <div className="flex items-center text-purple-400 group-hover:text-purple-300">
                  <span className="text-sm font-medium">Explore Pools</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-white/70 mb-4">
                  Sub-second transactions on Stellar network with minimal fees under $0.01
                </p>
                <div className="flex items-center text-yellow-400 group-hover:text-yellow-300">
                  <span className="text-sm font-medium">Start Trading</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-pink-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Flexible Terms</h3>
                <p className="text-white/70 mb-4">
                  Custom rental periods, rates, and collateral requirements with automated execution
                </p>
                <div className="flex items-center text-pink-400 group-hover:text-pink-300">
                  <span className="text-sm font-medium">Set Terms</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:border-indigo-400/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
                <p className="text-white/70 mb-4">
                  Real-time TVL tracking, yield optimization tools, portfolio analytics and risk assessment
                </p>
                <div className="flex items-center text-indigo-400 group-hover:text-indigo-300">
                  <span className="text-sm font-medium">View Analytics</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <div id="testimonials" className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-6">DeFi Community</h2>
              <p className="text-xl text-white/70">Trusted by DeFi natives and institutional investors</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 text-lg">
                  "Best DeFi yields I've found. The auto-compounding feature has 3x my returns compared to manual farming."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">DK</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">DegenKing.eth</div>
                    <div className="text-white/60 text-sm">Yield Farmer</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 text-lg">
                  "Institutional-grade security with retail-friendly UX. Perfect for our treasury management strategy."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">AL</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Alex Liu</div>
                    <div className="text-white/60 text-sm">DAO Treasurer</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 text-lg">
                  "Revolutionary protocol. The cross-chain features and flash loan integration are game-changing."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">CR</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">CryptoRebel</div>
                    <div className="text-white/60 text-sm">MEV Searcher</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-20 text-center">
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-16 border border-white/20">
              <h2 className="text-5xl font-bold text-white mb-6">
                Join the DeFi Revolution
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Experience the future of decentralized finance. Start earning maximum yield today.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">$24.7M</div>
                  <div className="text-white/70">Total Value Locked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">18.5%</div>
                  <div className="text-white/70">Maximum APY</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">15,247</div>
                  <div className="text-white/70">Active DeFi Users</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ConnectWallet onConnect={connectWallet} />
                <button className="flex items-center bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl transition-colors backdrop-blur-lg border border-white/20">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Protocol Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  X-Rent
                </h1>
                <div className="hidden md:block bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full border border-blue-200">
                  <span className="text-blue-700 text-xs font-bold tracking-wider">DeFi Protocol</span>
                </div>
              </div>
              
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  DeFi Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('rent')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'rent'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Borrow Assets
                </button>
                <button
                  onClick={() => setActiveTab('lend')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'lend'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Provide Liquidity
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-lg border border-blue-200">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-mono text-blue-700">
                  {`${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`}
                </span>
              </div>
              <button 
                onClick={disconnectWallet}
                className="flex items-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors border border-red-200"
                title="Disconnect Wallet"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <RentalDashboard publicKey={publicKey} />}
        {activeTab === 'rent' && <BrowseListings publicKey={publicKey} />}
        {activeTab === 'lend' && <CreateListing publicKey={publicKey} />}
      </main>
    </div>
  )
}
