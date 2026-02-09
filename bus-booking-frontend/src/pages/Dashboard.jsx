import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { TrendingUp, Calendar, Users, Bus, PlusCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// --- Chart.js Registration ---
// Charts වැඩ කිරීමට මෙය අනිවාර්ය වේ.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ 
  dashboardData, 
  allSchedules, 
  setShowScheduleModal 
}) => {

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (LKR)',
      data: [
        150000, 
        180000, 
        160000, 
        210000, 
        190000, 
        dashboardData.income || 0
      ],
      backgroundColor: 'rgba(37, 99, 235, 0.8)',
      borderRadius: 8
    }]
  };

  const bookingsChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Bookings',
      data: [
        45, 
        52, 
        48, 
        65, 
        85, 
        95, 
        dashboardData.totalBookings || 0
      ],
      borderColor: 'rgba(37, 99, 235, 1)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Overview</h2>
          <p className="text-gray-500 mt-1">
            System performance and statistics.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center transition-all shadow-lg hover:shadow-xl"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Quick Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            LKR {dashboardData.income || 0}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {dashboardData.totalBookings || 0}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Passengers</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {dashboardData.totalUsers || 0}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Active Trips</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">
            {allSchedules.length}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Revenue Overview
          </h3>
          <div className="h-64">
            {/* options prop එක එකතු කිරීම මගින් Canvas Error එක අඩු කරගත හැක */}
            <Bar 
              data={revenueChartData} 
              options={{ 
                maintainAspectRatio: false,
                responsive: true 
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Weekly Bookings
          </h3>
          <div className="h-64">
            <Line 
              data={bookingsChartData} 
              options={{ 
                maintainAspectRatio: false,
                responsive: true
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;