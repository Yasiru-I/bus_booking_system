import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';


// --- Layout Components ---
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import PassengerNavbar from './components/layout/PassengerNavbar';

// --- Pages ---
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Buses from './pages/Buses';
import Schedules from './pages/Schedules';
import Routes from './pages/Routes';
import Passengers from './pages/Passengers';

// --- Passenger Pages ---
import PassengerHome from './pages/PassengerHome';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin'; // 🔥 New Admin Login Page

// --- Modals ---
import AddBusModal from './components/modals/AddBusModal';
import AddRouteModal from './components/modals/AddRouteModal';
import AddScheduleModal from './components/modals/AddScheduleModal';
import RegisterPassengerModal from './components/modals/RegisterPassengerModal';

// GLOBAL AXIOS CONFIG: Ensure cookies are sent with EVERY request
axios.defaults.withCredentials = true;

function App() {
  // --- States ---
  const [view, setView] = useState('passenger-home');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  // Auth Data
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', phone: '', password: '' });

  // Admin Data
  const [dashboard, setDashboard] = useState({ income: 0, totalBookings: 0, totalUsers: 0 });
  const [allBookings, setAllBookings] = useState([]);
  const [allBuses, setAllBuses] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [allPassengers, setAllPassengers] = useState([]);
  const [formOptions, setFormOptions] = useState({ buses: [], routes: [] });

  // Modals
  const [showBusModal, setShowBusModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form Data States
  const [newBusData, setNewBusData] = useState({ bus_number: '', operator_name: '', bus_type: 'AC', capacity: 40 });
  const [newScheduleData, setNewScheduleData] = useState({ bus_id: '', route_id: '', departure_time: '', arrival_time: '', price: '', driver_name: '' });
  const [newRouteData, setNewRouteData] = useState({ route_title: '', start_location: '', end_location: '', distance_km: '', estimated_duration: '', stops: [] });
  const [newPassengerData, setNewPassengerData] = useState({ name: '', email: '', phone: '', dob: '', gender: 'Male', sendEmail: true, autoPassword: true });

  // --- Initial Load (Auth Check & Routing) ---
  useEffect(() => {
    // 1. Check URL for Admin Login
    if (window.location.pathname === '/admin-login') {
      setView('admin-login');
      return;
    }

    // 2. Check LocalStorage for User
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);

      // 3. Admin Routing Protection
      if (u.role === 'admin') {
        // If admin tries to go to root, send to dashboard
        setView('admin-dashboard');
        setActiveTab('dashboard');
      } else {
        // Passenger Routing
        setView('passenger-home');
      }
    }
  }, []);

  // --- Fetch Data Based on View ---
  useEffect(() => {
    if (view === 'admin-dashboard') {
      fetchDashboard(); fetchAdminBookings(); fetchAllBuses(); fetchAllSchedules(); fetchFormData(); fetchAllRoutes(); fetchAllPassengers();
    }
  }, [view]);

  // ==========================
  // AUTH FUNCTIONS
  // ==========================
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
      const loggedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);

      const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true });
      Toast.fire({ icon: 'success', title: 'Signed in successfully' });

      // 🔥 Note: Admins are blocked at backend, so this is only for passengers
      setView('passenger-home');
      setActiveTab('home');

    } catch (e) {
      // Show specific error message from backend
      Swal.fire('Login Failed', e.response?.data?.message || 'Invalid Email or Password', 'error');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/register', regData);
      Swal.fire('Success!', 'Registration complete. Please Login.', 'success');
      setView('login');
    } catch (e) { Swal.fire('Error', 'Registration failed.', 'error'); }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?', text: "You will be logged out!", icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        setUser(null);
        setView('passenger-home');
        setActiveTab('home');
        // If it was admin, also call backend to clear cookie
        axios.post('http://localhost:5000/api/auth/admin-logout').catch(e => console.error(e));
        window.history.pushState({}, '', '/'); // Reset URL
      }
    });
  };

  // ==========================
  // ADMIN FUNCTIONS
  // ==========================
  const fetchDashboard = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/dashboard'); setDashboard(res.data); } catch (e) { } };
  const fetchAdminBookings = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/all-bookings'); setAllBookings(res.data); } catch (e) { } };
  const fetchAllBuses = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/buses'); setAllBuses(res.data); } catch (e) { } };
  const fetchAllSchedules = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/schedules'); setAllSchedules(res.data); } catch (e) { } };
  const fetchFormData = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/form-data'); setFormOptions(res.data); } catch (e) { } };
  const fetchAllRoutes = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/routes'); setAllRoutes(res.data); } catch (e) { } };
  const fetchAllPassengers = async () => { try { const res = await axios.get('http://localhost:5000/api/admin/passengers'); setAllPassengers(res.data); } catch (e) { } };

  const handleAddBusSubmit = async (data) => { try { await axios.post('http://localhost:5000/api/admin/add-bus', data); Swal.fire('Success', 'Bus Added!', 'success').then(() => window.location.reload()); } catch (e) { Swal.fire('Error', 'Failed', 'error'); } };
  const deleteBusClick = (id) => { Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!' }).then(async (result) => { if (result.isConfirmed) { try { await axios.delete(`http://localhost:5000/api/admin/bus/${id}`); Swal.fire('Deleted!', 'Bus deleted.', 'success').then(() => window.location.reload()); } catch (e) { Swal.fire('Error', 'Cannot delete', 'error'); } } }); };

  const handleAddRouteSubmit = async (data) => { try { await axios.post('http://localhost:5000/api/admin/add-route', data); Swal.fire('Success', 'Route Added!', 'success').then(() => window.location.reload()); } catch (e) { Swal.fire('Error', 'Failed', 'error'); } };
  const deleteRouteClick = (id) => { Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!' }).then(async (result) => { if (result.isConfirmed) { try { await axios.delete(`http://localhost:5000/api/admin/route/${id}`); Swal.fire('Deleted!', 'Route deleted.', 'success').then(() => window.location.reload()); } catch (e) { Swal.fire('Error', 'Cannot delete', 'error'); } } }); };
  const toggleRouteStatus = async (id, currentStatus) => { try { await axios.put(`http://localhost:5000/api/admin/route-status/${id}`, { status: currentStatus === 'Active' ? 'Inactive' : 'Active' }); fetchAllRoutes(); } catch (e) { } };

  const handleAddScheduleSubmit = async (data) => { try { await axios.post('http://localhost:5000/api/admin/add-schedule', data); Swal.fire('Success', 'Schedule Added!', 'success').then(() => window.location.reload()); } catch (e) { Swal.fire('Error', 'Failed', 'error'); } };
  const deleteTrip = (id) => { Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!' }).then(async (result) => { if (result.isConfirmed) { try { await axios.delete(`http://localhost:5000/api/admin/trip/${id}`); Swal.fire('Deleted!', 'Trip deleted.', 'success').then(() => window.location.reload()); } catch (e) { Swal.fire('Error', 'Cannot delete', 'error'); } } }); };

  const handleAddPassengerSubmit = async (data) => { try { await axios.post('http://localhost:5000/api/admin/add-passenger', data); Swal.fire('Success', 'Passenger Registered!', 'success').then(() => window.location.reload()); } catch (e) { Swal.fire('Error', 'Failed', 'error'); } };
  const togglePassengerStatus = async (id, currentStatus) => { try { await axios.put(`http://localhost:5000/api/admin/passenger-status/${id}`, { status: currentStatus === 'Active' ? 'Suspended' : 'Active' }); fetchAllPassengers(); } catch (e) { } };
  const deletePassengerClick = (id) => { Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!' }).then(async (result) => { if (result.isConfirmed) { try { await axios.delete(`http://localhost:5000/api/admin/passenger/${id}`); Swal.fire('Deleted!', 'Passenger deleted.', 'success').then(() => window.location.reload()); } catch (e) { Swal.fire('Error', 'Cannot delete', 'error'); } } }); };
  const fetchPassengerHistory = async (id) => { const res = await axios.get(`http://localhost:5000/api/admin/passenger-history/${id}`); return res.data; };

  // ==========================
  // VIEW RENDER LOGIC
  // ==========================

  // 1. ADMIN LOGIN VIEW
  if (view === 'admin-login') return <AdminLogin setView={setView} />;

  // 2. PASSENGER LOGIN VIEW
  if (view === 'login') return (
    <div className="auth-container">
      <h1>👋 Passenger Login</h1>
      <input placeholder="Email" onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
      <button className="btn-primary" onClick={handleLogin}>Login</button>
      <p onClick={() => setView('passenger-home')}>Back to Home</p>
      <p onClick={() => setView('register')}>No account? Register</p>
    </div>
  );

  // 2. REGISTER VIEW
  if (view === 'register') return (
    <div className="auth-container">
      <h1>📝 Register</h1>
      <input placeholder="Name" onChange={e => setRegData({ ...regData, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setRegData({ ...regData, email: e.target.value })} />
      <input placeholder="Phone" onChange={e => setRegData({ ...regData, phone: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setRegData({ ...regData, password: e.target.value })} />
      <button className="btn-success" onClick={handleRegister}>Register</button>
      <p onClick={() => setView('passenger-home')}>Back to Home</p>
      <p onClick={() => setView('login')}>Back to Login</p>
    </div>
  );

  // 3. ADMIN DASHBOARD VIEW
  if (view === 'admin-dashboard') return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        {activeTab === 'dashboard' && <Dashboard dashboardData={dashboard} allSchedules={allSchedules} setShowScheduleModal={setShowScheduleModal} />}
        {activeTab === 'bookings' && <Bookings allBookings={allBookings} />}
        {activeTab === 'buses' && <Buses allBuses={allBuses} deleteBusClick={deleteBusClick} setShowBusModal={setShowBusModal} />}
        {activeTab === 'schedules' && <Schedules allSchedules={allSchedules} deleteTripClick={deleteTrip} setShowScheduleModal={setShowScheduleModal} />}
        {activeTab === 'routes' && <Routes allRoutes={allRoutes} setShowRouteModal={setShowRouteModal} deleteRouteClick={deleteRouteClick} toggleRouteStatus={toggleRouteStatus} />}
        {activeTab === 'passengers' && <Passengers allPassengers={allPassengers} togglePassengerStatus={togglePassengerStatus} deletePassengerClick={deletePassengerClick} fetchPassengerHistory={fetchPassengerHistory} setShowRegisterModal={setShowRegisterModal} />}

        <AddBusModal show={showBusModal} onClose={() => setShowBusModal(false)} newBusData={newBusData} setNewBusData={setNewBusData} handleAddBusSubmit={handleAddBusSubmit} />
        <AddScheduleModal show={showScheduleModal} onClose={() => setShowScheduleModal(false)} newScheduleData={newScheduleData} setNewScheduleData={setNewScheduleData} formOptions={formOptions} handleAddScheduleSubmit={handleAddScheduleSubmit} />
        <AddRouteModal show={showRouteModal} onClose={() => setShowRouteModal(false)} newRouteData={newRouteData} setNewRouteData={setNewRouteData} handleAddRouteSubmit={handleAddRouteSubmit} />
        <RegisterPassengerModal show={showRegisterModal} onClose={() => setShowRegisterModal(false)} newPassengerData={newPassengerData} setNewPassengerData={setNewPassengerData} handleAddPassengerSubmit={handleAddPassengerSubmit} />
      </main>
    </div>
  );

  // 4. PASSENGER VIEW (Including Profile)
  return (
    <div className="bg-white font-sans min-h-screen">

      {/* Navbar */}
      <PassengerNavbar
        user={user}
        handleLogout={handleLogout}
        setView={setView}
        setActiveTab={setActiveTab}
      />

      <main>
        {/* 1. HOME & SEARCH PAGE */}
        {(activeTab === 'home' || activeTab === 'dashboard') && (
          <PassengerHome user={user} setView={setView} />
        )}

        {/* 2. MY BOOKINGS PAGE (User Only) */}
        {activeTab === 'my-bookings' && user && (
          <div className="max-w-7xl mx-auto py-10 px-4">
            <MyBookings user={user} />
          </div>
        )}

        {/* 3. PROFILE PAGE (User Only) */}
        {activeTab === 'profile' && user && (
          <Profile user={user} />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">© 2026 Magiya Bus Booking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;