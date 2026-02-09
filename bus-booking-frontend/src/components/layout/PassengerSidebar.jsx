// import React from 'react';
// import { LayoutDashboard, Map, Wallet, User, Settings, LogOut } from 'lucide-react';

// const PassengerSidebar = ({ activeTab, setActiveTab, handleLogout }) => {
//   const menuItems = [
//     { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
//     { id: 'search', label: 'Book Trip', icon: Map }, // Search එක වෙනම ගත්තා
//     { id: 'my-bookings', label: 'My Trips', icon: Map },
//     { id: 'wallet', label: 'Wallet', icon: Wallet },
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'settings', label: 'Settings', icon: Settings },
//   ];

//   return (
//     <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col justify-between z-50">
//       <div>
//         {/* Logo Area */}
//         <div className="p-8 flex items-center">
//             <div className="bg-blue-600 p-2 rounded-lg mr-3">
//                 <Map className="text-white w-6 h-6" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-800">Magiya</h1>
//         </div>

//         {/* Menu Items */}
//         <nav className="px-4 space-y-2">
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl transition-all font-medium
//                 ${activeTab === item.id 
//                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
//                   : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'
//                 }`}
//             >
//               <item.icon className="w-5 h-5" />
//               <span>{item.label}</span>
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Logout Button */}
//       <div className="p-4 border-t border-gray-100">
//         <button 
//           onClick={handleLogout}
//           className="w-full flex items-center space-x-3 px-6 py-4 text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium"
//         >
//           <LogOut className="w-5 h-5" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PassengerSidebar;