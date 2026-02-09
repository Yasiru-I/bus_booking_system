import React from 'react';
import { PlusCircle, Trash2, Clock, Users } from 'lucide-react';

const Schedules = ({
  allSchedules,
  deleteTripClick,
  setShowScheduleModal
}) => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Schedules</h2>
          <p className="text-gray-500 mt-1">
            Monitor and manage intercity trip deployments.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center transition-all shadow-lg hover:shadow-xl"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Trip
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900 font-bold text-lg">Active Trips</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Trip ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Route
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Departure
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Bus & Driver
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {allSchedules.map(trip => (
                <tr key={trip.schedule_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    #TRP-{trip.schedule_id}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">
                      {trip.start_location}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      to {trip.end_location}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900 font-medium mb-1">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(trip.departure_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(trip.departure_time).toDateString()}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900">
                      {trip.bus_number}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Users className="w-3 h-3 mr-1" />
                      {trip.driver_name || 'No Driver'}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        trip.status === 'Scheduled' || trip.status === 'On Time'
                          ? 'bg-green-100 text-green-700'
                          : trip.status === 'Delayed'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteTripClick(trip.schedule_id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
