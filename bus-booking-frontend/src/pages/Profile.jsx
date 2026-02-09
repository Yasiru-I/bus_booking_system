import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { User, Users, Shield, Bell, Save, Trash2, PlusCircle } from 'lucide-react';

const Profile = ({ user }) => {
    const [activeTab, setActiveTab] = useState('personal'); // personal, passengers, security
    const [userData, setUserData] = useState({ name: '', phone: '', email: '', dob: '', address: '', gender: '' });
    const [passengers, setPassengers] = useState([]);
    const [newPassenger, setNewPassenger] = useState({ name: '', age: '', gender: 'Male', relation: '' });

    // Data Fetch කිරීම
    const fetchProfile = async () => {
        if (user) {
            try {
                const res = await axios.get(`http://localhost:5000/api/profile/${parseInt(user.id)}`);
                setUserData(res.data.user);
                setPassengers(res.data.co_passengers);
            } catch (err) { console.error(err); }
        }
    };

    useEffect(() => { fetchProfile(); }, [user]);

    // Profile Update Function
    const handleUpdateProfile = async () => {
        try {
            await axios.put('http://localhost:5000/api/profile/update', { ...userData, user_id: parseInt(user.id) });
            Swal.fire('Success', 'Profile Updated Successfully!', 'success');
        } catch (e) { Swal.fire('Error', 'Update Failed', 'error'); }
    };

    // Add Co-Passenger Function
    const handleAddPassenger = async () => {
        try {
            await axios.post('http://localhost:5000/api/profile/add-passenger', { ...newPassenger, user_id: parseInt(user.id) });
            Swal.fire('Success', 'Co-Passenger Added!', 'success');
            setNewPassenger({ name: '', age: '', gender: 'Male', relation: '' }); // Clear form
            fetchProfile(); // Refresh list
        } catch (e) { Swal.fire('Error', 'Failed', 'error'); }
    };

    // Delete Co-Passenger
    const handleDeletePassenger = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/profile/passenger/${id}`);
            fetchProfile();
        } catch (e) { Swal.fire('Error', 'Delete Failed', 'error'); }
    };

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8 animate-fadeIn">

            {/* 1. LEFT SIDEBAR (Navigation) */}
            <div className="w-full md:w-1/4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center mb-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
                        {user?.name.charAt(0)}
                    </div>
                    <h2 className="font-bold text-xl">{user?.name}</h2>
                    <p className="text-sm text-gray-500">Premium Member</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <button onClick={() => setActiveTab('personal')} className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors ${activeTab === 'personal' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600'}`}>
                        <User className="w-5 h-5 mr-3" /> Personal Info
                    </button>
                    <button onClick={() => setActiveTab('passengers')} className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors ${activeTab === 'passengers' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600'}`}>
                        <Users className="w-5 h-5 mr-3" /> Saved Passengers
                    </button>
                    <button onClick={() => setActiveTab('security')} className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600'}`}>
                        <Shield className="w-5 h-5 mr-3" /> Security
                    </button>
                </div>
            </div>

            {/* 2. RIGHT CONTENT AREA */}
            <div className="w-full md:w-3/4">

                {/* --- PERSONAL INFO TAB --- */}
                {activeTab === 'personal' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold mb-6">Personal Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                <input className="w-full p-3 border rounded-lg mt-1" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                <input className="w-full p-3 border rounded-lg mt-1" value={userData.phone} onChange={e => setUserData({ ...userData, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700">Email (Read Only)</label>
                                <input className="w-full p-3 border rounded-lg mt-1 bg-gray-100" value={userData.email} disabled />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700">Date of Birth</label>
                                <input type="date" className="w-full p-3 border rounded-lg mt-1" value={userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : ''} onChange={e => setUserData({ ...userData, dob: e.target.value })} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-bold text-gray-700">Home Address</label>
                                <textarea className="w-full p-3 border rounded-lg mt-1" value={userData.address} onChange={e => setUserData({ ...userData, address: e.target.value })} />
                            </div>
                        </div>
                        <button onClick={handleUpdateProfile} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700">
                            <Save className="w-5 h-5 mr-2" /> Save Changes
                        </button>
                    </div>
                )}

                {/* --- SAVED PASSENGERS TAB --- */}
                {activeTab === 'passengers' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-bold mb-6">Saved Co-passengers</h2>

                        {/* List */}
                        <div className="space-y-4 mb-8">
                            {passengers.map(p => (
                                <div key={p.passenger_id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">{p.name.charAt(0)}</div>
                                        <div>
                                            <h4 className="font-bold">{p.name}</h4>
                                            <p className="text-sm text-gray-500">{p.relation} • {p.age} Yrs • {p.gender}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeletePassenger(p.passenger_id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            ))}
                        </div>

                        {/* Add New Form */}
                        <h3 className="font-bold text-lg mb-4">Add New Passenger</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input placeholder="Name" className="p-3 border rounded-lg" value={newPassenger.name} onChange={e => setNewPassenger({ ...newPassenger, name: e.target.value })} />
                            <input placeholder="Age" type="number" className="p-3 border rounded-lg" value={newPassenger.age} onChange={e => setNewPassenger({ ...newPassenger, age: e.target.value })} />
                            <select className="p-3 border rounded-lg" value={newPassenger.gender} onChange={e => setNewPassenger({ ...newPassenger, gender: e.target.value })}>
                                <option>Male</option><option>Female</option>
                            </select>
                            <input placeholder="Relation (e.g. Wife)" className="p-3 border rounded-lg" value={newPassenger.relation} onChange={e => setNewPassenger({ ...newPassenger, relation: e.target.value })} />
                        </div>
                        <button onClick={handleAddPassenger} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center">
                            <PlusCircle className="w-5 h-5 mr-2" /> Add Passenger
                        </button>
                    </div>
                )}

                {/* --- SECURITY TAB (Placeholder) --- */}
                {activeTab === 'security' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-bold">Security Settings</h2>
                        <p className="text-gray-500">Password change feature coming soon.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Profile;