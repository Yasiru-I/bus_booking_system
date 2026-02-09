import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Search, MapPin, Users, Clock, BusFront } from 'lucide-react';
import SeatSelection from '../components/SeatSelection';
import Ticket from './Ticket';

// 👇 පින්තූරය Import (bus.jpg)
import busBg from '../assets/bus.jpg';

const PassengerHome = ({ user }) => {
    // --- States ---
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [buses, setBuses] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [isLoadingCount, setIsLoadingCount] = useState(true);

    // Navigation States
    const [selectedBus, setSelectedBus] = useState(null);
    const [ticket, setTicket] = useState(null);

    // --- User Count Backend ---
    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/auth/passenger-count');
                setUserCount(res.data.count);
            } catch (e) {
                console.error("Count Error:", e);
            } finally {
                setIsLoadingCount(false);
            }
        };
        fetchUserCount();
    }, []);

    // --- Search Function ---
    const searchBuses = async () => {
        // Validation
        if (!from || !to || !date) return Swal.fire('Missing Info', 'Please fill all fields', 'warning');

        setSelectedBus(null);
        setTicket(null);

        try {
            // 🔥 FIX: URL එක '/api/booking/search' ලෙස වෙනස් කරන්න
            const res = await axios.get('http://localhost:5000/api/booking/search', {
                params: { from, to, date }
            });

            setBuses(res.data);

            if (res.data.length === 0) {
                Swal.fire('Info', 'No buses found', 'info');
            } else {
                setTimeout(() => {
                    window.scrollTo({ top: 750, behavior: 'smooth' });
                }, 100);
            }
        } catch (e) {
            console.error(e);
            Swal.fire('Error', 'Search Failed', 'error');
        }
    };

    // --- Booking Function ---
    const handleBookingConfirm = async (seats, totalAmount) => {
        if (!user) return Swal.fire('Login Required', 'Please login to book tickets.', 'warning');

        // 🔥 FIX: Robust user ID extraction with fallback and logging
        console.log('Full user object:', user);
        const userId = user.id || user.user_id;
        console.log('Extracted user ID:', userId);

        if (!userId) {
            Swal.fire('Error', 'User ID not found. Please logout and login again.', 'error');
            return;
        }

        try {
            const bookingData = {
                user_id: parseInt(userId), // Ensure it's an integer
                schedule_id: selectedBus.schedule_id,
                seats: seats.map(s => ({ no: s, gender: 'male' })),
                total_amount: totalAmount
            };

            console.log('Sending booking request:', bookingData);

            const res = await axios.post('http://localhost:5000/api/booking/book', bookingData);

            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            Toast.fire({ icon: 'success', title: 'Booking Successful!' });

            setTicket({
                booking_id: res.data.booking_id || Math.floor(Math.random() * 100000),
                bus: selectedBus,
                seats: seats,
                total_amount: totalAmount,
                date: date,
                passenger: user.name
            });
            setSelectedBus(null);
            setBuses([]);

        } catch (e) {
            console.error('Booking error:', e);
            console.error('Error response:', e.response?.data);
            Swal.fire('Error', 'Booking Failed. Please try again.', 'error');
        }
    };

    if (ticket) {
        return (
            <Ticket ticketData={ticket} onBackToHome={() => { setTicket(null); setFrom(''); setTo(''); setDate(''); }} />
        );
    }

    return (
        <div className="min-h-screen relative font-sans text-white bg-gray-900">

            {/* 🔥 BACKGROUND IMAGE */}
            <div className="fixed inset-0 z-0">
                <img
                    src={busBg}
                    className="w-full h-full object-cover"
                    alt="Bus Background"
                />
                {/* Lighter Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">

                {/* ================= HERO SECTION ================= */}
                {!selectedBus && (
                    <>
                        {/* 🔥 CHANGE 1: Hero Section එක දැන් Full Screen (min-h-screen)
                   එතකොට අනිත් දේවල් බලන්න පහළට Scroll කරන්නම වෙනවා.
                */}
                        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">

                            {/* Titles */}
                            <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] mb-2 uppercase text-white drop-shadow-md animate-fadeIn">
                                Book Now
                            </h2>
                            <h1 className="text-4xl md:text-7xl font-black uppercase text-white mb-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight leading-none animate-fadeIn delay-100">
                                For a Seamless Journey
                            </h1>
                            <p className="text-gray-100 text-sm md:text-lg mb-12 font-medium tracking-wide animate-fadeIn delay-200 drop-shadow-md">
                                Effortless travel starts with our trusted service
                            </p>

                            {/* SEARCH BAR */}
                            <div className="w-full max-w-5xl backdrop-blur-xl bg-white/10 border border-white/30 rounded-full p-2 md:p-3 shadow-2xl animate-fadeIn delay-300 hover:bg-white/15 transition-all">
                                <div className="flex flex-col md:flex-row items-center gap-2">
                                    <div className="flex-1 w-full relative group px-2 border-b md:border-b-0 md:border-r border-white/20">
                                        <label className="text-xs text-gray-200 absolute left-4 top-2 font-bold uppercase tracking-wider">From</label>
                                        <input className="w-full pt-6 pb-2 pl-4 bg-transparent border-none outline-none text-white font-bold placeholder-white/50 focus:ring-0" placeholder="Location" value={from} onChange={e => setFrom(e.target.value)} />
                                    </div>
                                    <div className="flex-1 w-full relative group px-2 border-b md:border-b-0 md:border-r border-white/20">
                                        <label className="text-xs text-gray-200 absolute left-4 top-2 font-bold uppercase tracking-wider">To</label>
                                        <input className="w-full pt-6 pb-2 pl-4 bg-transparent border-none outline-none text-white font-bold placeholder-white/50 focus:ring-0" placeholder="Destination" value={to} onChange={e => setTo(e.target.value)} />
                                    </div>
                                    <div className="flex-1 w-full relative group px-2">
                                        <label className="text-xs text-gray-200 absolute left-4 top-2 font-bold uppercase tracking-wider">Date</label>
                                        <input type="date" className="w-full pt-6 pb-2 pl-4 bg-transparent border-none outline-none text-white font-bold placeholder-white/50 focus:ring-0 [color-scheme:dark]" value={date} onChange={e => setDate(e.target.value)} />
                                    </div>
                                    <button onClick={searchBuses} className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all active:scale-95 text-lg shadow-blue-500/30">
                                        <Search className="w-5 h-5 inline mr-2" /> Search
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-200 text-xs font-medium mt-4 animate-fadeIn delay-300 drop-shadow-md">Convenient payments with all major cards.</p>
                        </div>

                        {/* 🔥 CHANGE 2: LIVE CUSTOMER COUNT
                   දැන් මේක තියෙන්නේ Hero Section එකෙන් එළියේ. 
                   ඒ නිසා මේක බලන්න පහළට Scroll කරන්න ඕනේ.
                */}
                        <div className="w-full flex justify-end px-6 md:px-12 pb-12 mb-8 animate-fadeIn delay-500">
                            <div className="text-right backdrop-blur-xl bg-white/10 p-4 rounded-2xl border border-white/20 flex items-center gap-4 shadow-lg hover:bg-white/20 transition-all">
                                <div className="bg-blue-600 p-3 rounded-full shadow-lg">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-white drop-shadow-md">
                                        {/* 🔥 Logic Fixed: 0 නම් 0+ කියලා පෙන්නනවා (Loading වෙනුවට) */}
                                        {isLoadingCount ? "Loading..." : (userCount !== null ? userCount.toLocaleString() + " +" : "0 +")}
                                    </h3>
                                    <p className="text-gray-200 text-sm font-medium">Happy Travelers</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ================= RESULTS AREA ================= */}
                {selectedBus ? (
                    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn mt-20">
                        <div className="backdrop-blur-xl bg-black/40 rounded-3xl p-6 shadow-2xl text-white border border-white/20">
                            <SeatSelection scheduleId={selectedBus.schedule_id} ticketPrice={selectedBus.ticket_price} totalSeats={selectedBus.capacity || 40} onBack={() => setSelectedBus(null)} onConfirm={handleBookingConfirm} />
                        </div>
                    </div>
                ) : (
                    <>
                        {buses.length > 0 && (
                            <div className="max-w-7xl mx-auto px-6 mb-16 animate-slideUp bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mt-10">
                                <h2 className="text-2xl font-bold mb-6 text-white border-l-4 border-blue-500 pl-4 drop-shadow-md">Available Buses</h2>
                                <div className="grid gap-6">
                                    {buses.map(b => (
                                        <div key={b.schedule_id} className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col md:flex-row gap-8 items-center group text-white">
                                            <div className="text-center md:text-left min-w-[120px] flex flex-col items-center md:items-start">
                                                <div className="bg-white/10 p-3 rounded-full mb-2 md:hidden backdrop-blur-md">
                                                    <Clock className="w-6 h-6 text-blue-300" />
                                                </div>
                                                <div className="text-3xl font-bold text-white drop-shadow-md">{new Date(b.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                <div className="text-xs text-gray-300 uppercase tracking-wide font-bold mt-1">Departure</div>
                                            </div>
                                            <div className="flex-1 w-full text-center md:text-left border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8">
                                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                                    <h3 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2 drop-shadow-sm">
                                                        <BusFront className="w-6 h-6 text-blue-300 hidden md:block" />
                                                        {b.operator_name}
                                                    </h3>
                                                    <span className="bg-blue-500/30 text-white text-xs px-3 py-1 rounded-full border border-blue-400/50 uppercase font-bold w-fit mx-auto md:mx-0 tracking-wider backdrop-blur-md">{b.bus_number}</span>
                                                </div>
                                                <div className="text-xl text-gray-200 mb-4 flex items-center justify-center md:justify-start gap-3 font-medium">
                                                    <span className="font-bold text-white">{b.start_location}</span>
                                                    <span className="text-blue-400 text-2xl">➝</span>
                                                    <span className="font-bold text-white">{b.end_location}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                                    <span className="text-sm bg-purple-500/30 text-purple-100 px-3 py-1 rounded-full border border-purple-400/50 font-medium backdrop-blur-md">{b.bus_type || 'AC'}</span>
                                                    <span className={`text-sm px-3 py-1 rounded-full border font-medium backdrop-blur-md ${b.booked_seats && (b.capacity - b.booked_seats) < 5 ? 'bg-red-500/30 text-red-100 border-red-400/50' : 'bg-green-500/30 text-green-100 border-green-400/50'}`}>
                                                        {b.booked_seats ? `${b.capacity - b.booked_seats} Seats Left` : 'Seats Available'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right min-w-[180px] border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-8 flex flex-col items-center md:items-end justify-center">
                                                <div className="text-gray-300 text-xs font-bold uppercase mb-1">Per Seat</div>
                                                <div className="text-4xl font-bold text-white mb-4 drop-shadow-md">
                                                    <span className="text-lg text-gray-300 font-medium mr-1">LKR</span>
                                                    {b.ticket_price}
                                                </div>
                                                <button onClick={() => setSelectedBus(b)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-blue-500/50 transition-all active:scale-95 text-lg border border-white/10">Select Seats</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default PassengerHome;