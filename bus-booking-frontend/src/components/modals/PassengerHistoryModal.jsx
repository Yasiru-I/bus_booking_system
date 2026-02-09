import React from 'react';
import { X, Mail, Phone, MapPin, Ban, Download, MessageSquare, RefreshCcw } from 'lucide-react';

const PassengerHistoryModal = ({
  selectedPassengerHistory,
  setSelectedPassengerHistory,
  historyTab,
  setHistoryTab,
  handleModalStatusToggle,
  exportFullPassengerReport
}) => {
  if (!selectedPassengerHistory) return null;

  const { user, history, tickets, refunds } = selectedPassengerHistory;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-[1000px] h-[750px] shadow-2xl relative flex overflow-hidden">
        
        <button
          onClick={() => setSelectedPassengerHistory(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* LEFT SIDE: User Profile Summary */}
        <div className="w-[30%] bg-gray-50 border-r border-gray-100 p-8 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-white shadow-md overflow-hidden">
              {user.name.charAt(0)}
            </div>
            <div className={`absolute bottom-1 right-1 w-6 h-6 border-2 border-white rounded-full ${user.account_status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>

          <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
          
          <div className="w-full space-y-4 text-left mt-6">
            <div className="flex items-center gap-3 text-gray-600 text-sm"><Mail className="w-4 h-4" /> {user.email}</div>
            <div className="flex items-center gap-3 text-gray-600 text-sm"><Phone className="w-4 h-4" /> {user.phone}</div>
            <div className="flex items-center gap-3 text-gray-600 text-sm"><MapPin className="w-4 h-4" /> Colombo, Sri Lanka</div>
          </div>

          <div className="mt-auto w-full pt-6 border-t border-gray-200">
            <button
              onClick={handleModalStatusToggle}
              className={`w-full py-2 border rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${user.account_status === 'Active' ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-green-100 text-green-600 hover:bg-green-50'}`}
            >
              <Ban className="w-4 h-4" />
              {user.account_status === 'Active' ? 'Suspend Account' : 'Activate Account'}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: History Tabs */}
        <div className="w-[70%] p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900">Passenger History</h2>
            <button onClick={exportFullPassengerReport} className="px-4 py-2 border rounded-lg text-sm font-bold flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>

          <div className="flex gap-6 border-b mb-6">
            {['bookings', 'tickets', 'refunds'].map(tab => (
              <button
                key={tab}
                onClick={() => setHistoryTab(tab)}
                className={`pb-2 border-b-2 font-bold text-sm transition-all ${historyTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {historyTab === 'bookings' && (
              history.length > 0 ? history.map(b => (
                <div key={b.booking_id} className="border p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{b.start_location} → {b.end_location}</p>
                    <p className="text-xs text-gray-500">{new Date(b.departure_time).toLocaleDateString()}</p>
                  </div>
                  <span className="font-bold text-blue-600">LKR {b.total_amount}</span>
                </div>
              )) : <p className="text-center text-gray-400 py-10">No bookings found.</p>
            )}

            {historyTab === 'tickets' && (
              <div className="text-center text-gray-400 py-10">
                <MessageSquare className="w-10 h-10 mx-auto mb-2" /> No support tickets.
              </div>
            )}

            {historyTab === 'refunds' && (
              <div className="text-center text-gray-400 py-10">
                <RefreshCcw className="w-10 h-10 mx-auto mb-2" /> No refund requests.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerHistoryModal;