import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Navigation,
  Bus,
  Users,
  LogOut
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  return (
    <aside className="w-64 bg-white h-full shadow-lg hidden md:block z-50">
      <div className="p-6 border-b flex items-center space-x-2">
        <Bus className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">
          Magiya Admin
        </h1>
      </div>

      <nav className="mt-6 px-4 space-y-2">
        <div
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </div>

        <div
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-5 h-5 mr-3" />
          Bookings
        </div>

        <div
          onClick={() => setActiveTab('schedules')}
          className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'schedules'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <MapPin className="w-5 h-5 mr-3" />
          Schedules
        </div>

        <div
          onClick={() => setActiveTab('routes')}
          className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'routes'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Navigation className="w-5 h-5 mr-3" />
          Routes
        </div>

        <div
          onClick={() => setActiveTab('buses')}
          className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'buses'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bus className="w-5 h-5 mr-3" />
          Buses
        </div>

        <div
          onClick={() => setActiveTab('passengers')}
          className={`flex items-center px-4 py-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'passengers'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-5 h-5 mr-3" />
          Passengers
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
