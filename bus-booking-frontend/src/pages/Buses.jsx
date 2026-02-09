import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const Buses = ({ 
  allBuses, 
  deleteBusClick, 
  setShowBusModal 
}) => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Bus Management</h2>
          <p className="text-gray-500 mt-1">
            Manage your fleet and vehicles.
          </p>
        </div>

        <button
          onClick={() => setShowBusModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center transition-all shadow-lg hover:shadow-xl"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add New Bus
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900 font-bold text-lg">Bus Fleet</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Bus Number
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Operator
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Capacity
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {allBuses.map((bus) => (
                <tr key={bus.bus_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {bus.bus_number}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {bus.operator_name}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        bus.bus_type === 'AC'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {bus.bus_type}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {bus.capacity} Seats
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteBusClick(bus.bus_id)}
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

export default Buses;
