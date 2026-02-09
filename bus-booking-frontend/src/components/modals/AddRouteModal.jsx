import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const AddRouteModal = ({
  show,
  onClose,
  newRouteData,
  setNewRouteData,
  handleAddRouteSubmit
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl w-[520px] p-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Route
        </h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <input
            placeholder="Route Title"
            className="w-full p-3 border rounded-lg"
            value={newRouteData.route_title}
            onChange={e =>
              setNewRouteData({ ...newRouteData, route_title: e.target.value })
            }
          />

          <input
            placeholder="Start Location"
            className="w-full p-3 border rounded-lg"
            value={newRouteData.start_location}
            onChange={e =>
              setNewRouteData({ ...newRouteData, start_location: e.target.value })
            }
          />

          <input
            placeholder="End Location"
            className="w-full p-3 border rounded-lg"
            value={newRouteData.end_location}
            onChange={e =>
              setNewRouteData({ ...newRouteData, end_location: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Distance (KM)"
            className="w-full p-3 border rounded-lg"
            value={newRouteData.distance_km}
            onChange={e =>
              setNewRouteData({ ...newRouteData, distance_km: e.target.value })
            }
          />

          <input
            placeholder="Estimated Duration"
            className="w-full p-3 border rounded-lg"
            value={newRouteData.estimated_duration}
            onChange={e =>
              setNewRouteData({
                ...newRouteData,
                estimated_duration: e.target.value
              })
            }
          />

          <div>
            <label className="text-sm font-bold text-gray-600 mb-2 block">
              Route Stops
            </label>

            {newRouteData.stops.map((stop, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  className="flex-1 p-3 border rounded-lg"
                  placeholder={`Stop ${index + 1}`}
                  value={stop}
                  onChange={e => {
                    const updatedStops = [...newRouteData.stops];
                    updatedStops[index] = e.target.value;
                    setNewRouteData({ ...newRouteData, stops: updatedStops });
                  }}
                />

                <button
                  onClick={() => {
                    const updatedStops = newRouteData.stops.filter(
                      (_, i) => i !== index
                    );
                    setNewRouteData({ ...newRouteData, stops: updatedStops });
                  }}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setNewRouteData({
                  ...newRouteData,
                  stops: [...newRouteData.stops, '']
                })
              }
              className="flex items-center gap-2 text-blue-600 font-bold text-sm mt-2"
            >
              <Plus className="w-4 h-4" />
              Add Stop
            </button>
          </div>

          <button
            onClick={() => {
              handleAddRouteSubmit(newRouteData);
              onClose();
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
          >
            Save Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRouteModal;
