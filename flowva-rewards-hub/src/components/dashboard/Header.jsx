import React from 'react'
import { Bell} from 'lucide-react';

const Header = () => {
  return (
    <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards Hub</h1>
              <p className="text-gray-600">Earn points, unlock rewards, and celebrate your progress!</p>
            </div>
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">1</span>
            </button>
          </div>   
  )
}

export default Header
