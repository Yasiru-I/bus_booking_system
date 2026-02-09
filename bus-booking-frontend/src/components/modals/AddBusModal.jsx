import React from 'react';
import { X } from 'lucide-react';

const AddBusModal = ({
  show,
  onClose,
  newBusData,
  setNewBusData,
  handleAddBusSubmit
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl w-[400px] p-6 shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Bus
        </h2>

        <div className="space-y-4">
          <input
            placeholder="Bus Number"
            className="w-full p-3 border rounded-lg"
            value={newBusData.bus_number}
            onChange={e =>
              setNewBusData({ ...newBusData, bus_number: e.target.value })
            }
          />

          <input
            placeholder="Operator Name"
            className="w-full p-3 border rounded-lg"
            value={newBusData.operator_name}
            onChange={e =>
              setNewBusData({ ...newBusData, operator_name: e.target.value })
            }
          />

          <select
            className="w-full p-3 border rounded-lg"
            value={newBusData.bus_type}
            onChange={e =>
              setNewBusData({ ...newBusData, bus_type: e.target.value })
            }
          >
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
          </select>

          <input
            type="number"
            placeholder="Capacity"
            className="w-full p-3 border rounded-lg"
            value={newBusData.capacity}
            onChange={e =>
              setNewBusData({ ...newBusData, capacity: e.target.value })
            }
          />

          <button
            onClick={() => {
              handleAddBusSubmit(newBusData);
              onClose();
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
          >
            Save Bus
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBusModal;
