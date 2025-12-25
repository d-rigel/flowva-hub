import React from 'react'

const NavItem = ({ icon, label, active }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
      active
        ? 'bg-purple-100 text-purple-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default NavItem
