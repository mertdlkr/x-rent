'use client'

import { Wallet, Sparkles } from 'lucide-react'

interface ConnectWalletProps {
  onConnect: () => void
}

export default function ConnectWallet({ onConnect }: ConnectWalletProps) {
  return (
    <button
      onClick={onConnect}
      className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
      <div className="relative flex items-center space-x-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Wallet className="w-5 h-5" />
        </div>
        <span className="text-lg">Connect Freighter Wallet</span>
        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
      </div>
    </button>
  )
} 