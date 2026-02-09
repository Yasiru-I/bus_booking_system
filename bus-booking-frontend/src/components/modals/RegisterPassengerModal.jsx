import React from 'react';
import { X, UserPlus, Mail, Phone, Settings, Lock } from 'lucide-react';

const RegisterPassengerModal = ({
  show,
  onClose,
  newPassengerData,
  setNewPassengerData,
  handleAddPassengerSubmit
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[600px] p-8 shadow-2xl relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-black text-gray-900 mb-1">Register New Passenger</h2>
        <p className="text-sm text-gray-500 mb-6">Add a new traveler to the system.</p>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
              <input 
                placeholder="John Doe" 
                className="w-full p-3 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={newPassengerData.name} 
                onChange={e => setNewPassengerData({...newPassengerData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
              <input 
                placeholder="john@example.com" 
                className="w-full p-3 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={newPassengerData.email} 
                onChange={e => setNewPassengerData({...newPassengerData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
              <input 
                placeholder="+94 77 123 4567" 
                className="w-full p-3 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={newPassengerData.phone} 
                onChange={e => setNewPassengerData({...newPassengerData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Date of Birth</label>
              <input 
                type="date" 
                className="w-full p-3 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                value={newPassengerData.dob} 
                onChange={e => setNewPassengerData({...newPassengerData, dob: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Gender</label>
            <div className="flex gap-4">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input 
                    type="radio" 
                    name="gender" 
                    value={g} 
                    checked={newPassengerData.gender === g} 
                    onChange={() => setNewPassengerData({...newPassengerData, gender: g})} 
                  /> {g}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3 pt-6 border-t">
          <button onClick={onClose} className="flex-1 py-3 border rounded-xl font-bold hover:bg-gray-50">Cancel</button>
          <button 
            onClick={() => { handleAddPassengerSubmit(newPassengerData); onClose(); }} 
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5"/> Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPassengerModal;