import React, { useState } from 'react';
import { User, LogOut, Menu, X, BusFront, MapPin } from 'lucide-react'; // MapPin අලුතින් දැම්මා

const PassengerNavbar = ({ user, handleLogout, setView, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* 🔥 1. LOGO SECTION (SAVARI) */}
          <div className="flex items-center cursor-pointer" onClick={() => { setView('passenger-home'); setActiveTab('home'); }}>
            
            {/* Logo Icon */}
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg mr-3 transition-transform hover:scale-110">
                <BusFront strokeWidth={2.5} className="w-6 h-6" />
            </div>

            {/* Logo Text */}
            <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tighter text-gray-900 leading-none flex items-baseline">
                    SAVA<span className="text-blue-600">RI</span>
                    {/* කුඩා තිතක් (Dot) - Design එකට */}
                    <span className="w-2 h-2 bg-blue-600 rounded-full ml-1 mb-1"></span>
                </h1>
                <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase ml-0.5">Sri Lanka</p>
            </div>
          </div>

          {/* 2. DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
                onClick={() => { setView('passenger-home'); setActiveTab('home'); }} 
                className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors"
            >
                Home
            </button>
            <button className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors">About</button>
            <button className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors">Contact</button>
            
            {user && (
                <button 
                    onClick={() => setActiveTab('my-bookings')} 
                    className="text-gray-600 hover:text-blue-600 font-bold text-sm transition-colors"
                >
                    My Bookings
                </button>
            )}
          </div>

          {/* 3. USER PROFILE / LOGIN BUTTONS */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div 
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-all border border-gray-200"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-bold text-gray-800">{user.name}</span>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('login')} 
                className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg transform active:scale-95"
              >
                Login
              </button>
            )}
          </div>

          {/* 4. MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-blue-600">
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5. MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slideDown shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <button onClick={() => { setView('passenger-home'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg">Home</button>
            {user && (
                <button onClick={() => { setActiveTab('my-bookings'); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg">My Bookings</button>
            )}
            
            <div className="border-t border-gray-100 my-2"></div>
            
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-bold text-gray-800">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-500 font-bold hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <button onClick={() => { setView('login'); setIsMobileMenuOpen(false); }} className="block w-full text-center bg-blue-600 text-white px-3 py-3 rounded-xl font-bold mt-4 shadow-lg">Login / Register</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default PassengerNavbar;