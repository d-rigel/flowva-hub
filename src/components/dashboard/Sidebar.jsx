import React from 'react';
import NavItem from './NavItem';
import { Home, Compass, BookOpen, Layers, CreditCard, Gift, Settings } from 'lucide-react';

const Sidebar = ({ user, handleLogout }) => {
  return (
    // Updated: Full height, flex column layout
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#8B5CF6"/>
            <path d="M30 35 Q35 25 45 28 L55 32 Q58 28 65 30 M35 40 Q40 45 45 45 M55 45 Q60 45 65 40" stroke="white" strokeWidth="3" fill="none"/>
          </svg>
          <span className="text-xl font-bold text-purple-700">Flowva</span>
        </div>
      </div>

      {/* Navigation - Scrollable if needed */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <NavItem icon={<Home size={20} />} label="Home" />
        <NavItem icon={<Compass size={20} />} label="Discover" />
        <NavItem icon={<BookOpen size={20} />} label="Library" />
        <NavItem icon={<Layers size={20} />} label="Tech Stack" />
        <NavItem icon={<CreditCard size={20} />} label="Subscriptions" />
        <NavItem icon={<Gift size={20} />} label="Rewards Hub" active />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>

      {/* User Profile - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
            {user?.first_name?.split(' ').map(word => word[0]).join('').toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user?.first_name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 cursor-pointer"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

