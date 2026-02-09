import React from 'react';
import { PlusCircle, Trash2, Navigation, ToggleLeft, ToggleRight, TrendingUp } from 'lucide-react';

const Routes = ({
  allRoutes,
  setShowRouteModal,
  deleteRouteClick,
  toggleRouteStatus
}) => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Route Management</h2>
          <p className="text-gray-500 mt-1">
            Configure and monitor your transportation networks.
          </p>
        </div>

        <button
          onClick={() => setShowRouteModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center transition-all shadow-lg hover:shadow-xl"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Route
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Routes</p>
            <h3 className="text-3xl font-bold text-gray-800 mt-2">
              {allRoutes.length}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <Navigation className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Active Routes</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {allRoutes.filter(r => r.status === 'Active').length}
            </h3>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900 font-bold text-lg">Available Routes</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Route Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Distance
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Duration
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
              {allRoutes.map(route => (
                <tr key={route.route_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-3">
                        <Navigation size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {route.route_title || `${route.start_location} to ${route.end_location}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {route.start_location} ➝ {route.end_location}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {route.distance_km} KM
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {route.estimated_duration}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRouteStatus(route.route_id, route.status)}
                      className="focus:outline-none"
                    >
                      {route.status === 'Active'
                        ? <ToggleRight className="w-8 h-8 text-green-500" />
                        : <ToggleLeft className="w-8 h-8 text-gray-400" />
                      }
                    </button>
                    <span
                      className={`ml-2 text-xs font-bold ${
                        route.status === 'Active'
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {route.status || 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteRouteClick(route.route_id)}
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

export default Routes;
