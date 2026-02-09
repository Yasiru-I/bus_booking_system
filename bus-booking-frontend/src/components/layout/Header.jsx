import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 w-96">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none focus:ring-0 w-full outline-none text-gray-700"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-all" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>

        <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
          <div className="hidden md:block text-left">
            <p className="font-semibold text-gray-800 text-sm">
              Admin User
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
