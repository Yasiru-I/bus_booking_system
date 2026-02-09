import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, MapPin, Wallet, Award, XCircle, Download } from 'lucide-react';

const MyBookings = ({ user }) => {  // 🔥 FIX: Accept user prop
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔥 FIX: Fetch bookings using user_id from URL parameter
  const fetchBookings = async () => {
    if (!user || !user.id) {
      console.error("User not logged in or user ID missing");
      return;
    }

    try {
      // Use correct endpoint: /api/booking/my-bookings/:user_id
      const userId = parseInt(user.id) || parseInt(user.user_id);
      const response = await axios.get(`http://localhost:5000/api/booking/my-bookings/${userId}`);

      console.log('Bookings fetched:', response.data);
      setBookings(response.data);

    } catch (err) {
      console.error("Error fetching bookings:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]); // Re-fetch when user changes

  // 2. Cancel Booking Function
  const handleCancelBooking = async (bookingId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to cancel this trip?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:5000/api/booking/cancel-booking', { booking_id: bookingId });
          Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
          fetchBookings(); // ලිස්ට් එක refresh කරනවා
        } catch (error) {
          Swal.fire('Error', 'Failed to cancel booking', 'error');
        }
      }
    });
  };

  // 3. Filter Logic
  const getFilteredBookings = () => {
    return bookings.filter(b => {
      const now = new Date();
      const departureDate = new Date(b.departure_time);

      // Tab Filter
      if (filter === 'Upcoming') {
        // Show only future trips that are not cancelled
        if (departureDate <= now || b.booking_status === 'cancelled') return false;
      }
      if (filter === 'Completed') {
        // Show only past trips that are confirmed
        if (departureDate > now || b.booking_status === 'cancelled') return false;
      }
      if (filter === 'Cancelled') {
        // Show only cancelled bookings
        if (b.booking_status !== 'cancelled') return false;
      }

      // Search Filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          b.start_location.toLowerCase().includes(term) ||
          b.end_location.toLowerCase().includes(term) ||
          b.operator_name.toLowerCase().includes(term)
        );
      }
      return true;
    });
  };

  const filteredData = getFilteredBookings();

  // 4. Stats Calculation
  const totalDistance = bookings.reduce((sum, b) => b.booking_status === 'confirmed' ? sum + (b.distance_km || 0) : sum, 0);
  const totalSpent = bookings.reduce((sum, b) => b.booking_status === 'confirmed' ? sum + parseFloat(b.total_amount) : sum, 0);
  const rewardPoints = bookings.length > 0 ? bookings[0].loyalty_points : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fadeIn">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Trips & Booking History</h1>
        <p className="text-gray-500 mt-1">Keep track of your journeys, manage tickets, and download invoices.</p>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by destination or operator..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === tab
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Route & Reference</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fare</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No bookings found</td></tr>
              ) : (
                filteredData.map((booking) => (
                  <tr key={booking.booking_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-bold text-gray-900">{booking.start_location} → {booking.end_location}</p>
                          <p className="text-xs text-gray-500">{booking.operator_name} • {booking.bus_number}</p>
                          <p className="text-xs text-gray-400">Ref: #{booking.booking_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{new Date(booking.departure_time).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{new Date(booking.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">LKR {parseFloat(booking.total_amount).toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {booking.booking_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleCancelBooking(booking.booking_id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1 ml-auto"
                        disabled={booking.booking_status === 'cancelled'}
                      >
                        <XCircle className="w-4 h-4" />
                        {booking.booking_status === 'cancelled' ? 'Cancelled' : 'Cancel'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl flex items-center border border-blue-100">
          <div className="bg-blue-100 p-3 rounded-xl mr-4">
            <MapPin className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase">Total Distance</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(0)} km</h3>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl flex items-center border border-green-100">
          <div className="bg-green-100 p-3 rounded-xl mr-4">
            <Wallet className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-green-600 uppercase">Total Spent</p>
            <h3 className="text-2xl font-bold text-gray-900">LKR {totalSpent}</h3>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl flex items-center border border-purple-100">
          <div className="bg-purple-100 p-3 rounded-xl mr-4">
            <Award className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase">Reward Points</p>
            <h3 className="text-2xl font-bold text-gray-900">{rewardPoints} pts</h3>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyBookings;