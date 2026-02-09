import React from 'react';
import { X } from 'lucide-react';

const AddScheduleModal = ({
  show,
  onClose,
  newScheduleData,
  setNewScheduleData,
  formOptions,
  handleAddScheduleSubmit
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl w-[500px] p-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Schedule
        </h2>

        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Select Bus
          </label>

          <select
            className="w-full p-3 border rounded-lg"
            onChange={e =>
              setNewScheduleData({ ...newScheduleData, bus_id: e.target.value })
            }
          >
            <option>Select Bus...</option>
            {formOptions.buses.map(b => (
              <option key={b.bus_id} value={b.bus_id}>
                {b.bus_number}
              </option>
            ))}
          </select>

          <label className="text-xs font-bold text-gray-500 uppercase">
            Select Route
          </label>

          <select
            className="w-full p-3 border rounded-lg"
            onChange={e =>
              setNewScheduleData({
                ...newScheduleData,
                route_id: e.target.value
              })
            }
          >
            <option>Select Route...</option>
            {formOptions.routes.map(r => (
              <option key={r.route_id} value={r.route_id}>
                {r.start_location} to {r.end_location}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="datetime-local"
              className="w-full p-3 border rounded-lg"
              onChange={e =>
                setNewScheduleData({
                  ...newScheduleData,
                  departure_time: e.target.value
                })
              }
            />

            <input
              type="datetime-local"
              className="w-full p-3 border rounded-lg"
              onChange={e =>
                setNewScheduleData({
                  ...newScheduleData,
                  arrival_time: e.target.value
                })
              }
            />
          </div>

          <input
            placeholder="Driver Name"
            className="w-full p-3 border rounded-lg"
            onChange={e =>
              setNewScheduleData({
                ...newScheduleData,
                driver_name: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Price (LKR)"
            className="w-full p-3 border rounded-lg"
            onChange={e =>
              setNewScheduleData({
                ...newScheduleData,
                price: e.target.value
              })
            }
          />

          <button
            onClick={() => {
              handleAddScheduleSubmit(newScheduleData);
              onClose();
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
          >
            Publish Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddScheduleModal;
