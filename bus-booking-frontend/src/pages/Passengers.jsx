import React, { useState } from 'react';
import PassengerHistoryModal from '../components/modals/PassengerHistoryModal';
import {
  UserPlus,
  Download,
  Star,
  Trash2,
  MoreHorizontal,
  Ban
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Passengers = ({
  allPassengers,
  togglePassengerStatus,
  deletePassengerClick,
  handleAddPassengerSubmit,
  fetchPassengerHistory,
  setShowRegisterModal
}) => {
  const [openActionMenu, setOpenActionMenu] = useState(null);
  const [selectedPassengerHistory, setSelectedPassengerHistory] = useState(null);
  
  // 🔥 FIX 1: ඉතිහාසය පෙන්වන Tabs සඳහා State එක හැදුවා
  const [historyTab, setHistoryTab] = useState('bookings');

  const downloadPassengerListPDF = () => {
    const doc = new jsPDF();
    doc.text("Magiya - Passenger Directory", 14, 20);

    autoTable(doc, {
      startY: 35,
      head: [['ID', 'Name', 'Email', 'Phone', 'Points', 'Status', 'Last Trip']],
      body: allPassengers.map(p => [
        `#${p.user_id}`,
        p.name,
        p.email,
        p.phone,
        `${p.loyalty_points || 0} pts`,
        p.account_status,
        p.last_trip ? new Date(p.last_trip).toLocaleDateString() : 'N/A'
      ])
    });

    doc.save('passenger_list.pdf');
  };

  const handleViewHistory = async (id) => {
    try {
        const historyData = await fetchPassengerHistory(id);
        setSelectedPassengerHistory(historyData);
        setHistoryTab('bookings'); // Modal එක open වෙනකොට මුලින්ම Bookings පෙන්වන්න
    } catch (error) {
        console.error("Error fetching history:", error);
    }
  };

  return (
    <div className="p-8" onClick={() => setOpenActionMenu(null)}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Passenger Directory</h2>
          <p className="text-gray-500 mt-1">
            Manage registered travelers and their loyalty profiles.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center transition-all shadow-lg hover:shadow-xl"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Register New Passenger
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-gray-900 font-bold text-lg">Passenger List</h3>

          <button
            onClick={downloadPassengerListPDF}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-visible min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Passenger Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Email / Phone
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Bookings
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Loyalty Points
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Last Trip
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {allPassengers.map(p => (
                <tr key={p.user_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {p.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">{p.email}</span>
                      <span className="text-xs text-gray-400">{p.phone}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {p.total_bookings}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center text-yellow-600 font-bold text-sm">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {p.loyalty_points || 0} pts
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.account_status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.account_status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.last_trip
                      ? new Date(p.last_trip).toLocaleDateString()
                      : 'N/A'}
                  </td>

                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewHistory(p.user_id)}
                        className="text-blue-600 font-bold text-xs hover:underline"
                      >
                        Edit
                      </button>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenu(
                              openActionMenu === p.user_id ? null : p.user_id
                            );
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>

                        {openActionMenu === p.user_id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                            <button
                              onClick={() =>
                                togglePassengerStatus(p.user_id, p.account_status)
                              }
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Ban className="w-4 h-4" />
                              {p.account_status === 'Active'
                                ? 'Block User'
                                : 'Unblock User'}
                            </button>

                            <button
                              onClick={() => deletePassengerClick(p.user_id)}
                              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
      
      {/* 🔥 FIX 2: Modal එකට යවන Props නිවැරදි කළා */}
      <PassengerHistoryModal
        selectedPassengerHistory={selectedPassengerHistory}
        setSelectedPassengerHistory={setSelectedPassengerHistory}
        historyTab={historyTab}
        setHistoryTab={setHistoryTab}
        handleModalStatusToggle={() => {
            if (selectedPassengerHistory) {
                togglePassengerStatus(selectedPassengerHistory.user.user_id, selectedPassengerHistory.user.account_status);
                // Status එක මාරු වුණාම UI එක update වෙන්න පොඩි වෙනසක්
                setSelectedPassengerHistory({
                    ...selectedPassengerHistory,
                    user: {
                        ...selectedPassengerHistory.user,
                        account_status: selectedPassengerHistory.user.account_status === 'Active' ? 'Suspended' : 'Active'
                    }
                });
            }
        }}
        exportFullPassengerReport={() => alert("Report Export feature coming soon!")}
      />

    </div>
  );
};

export default Passengers;