import React from 'react';
import { CheckCircle, Printer, Download, Calendar, MapPin, Bus, QrCode, ArrowRight } from 'lucide-react';

const Ticket = ({ ticketData, onBackToHome }) => {
  // ticketData කියන්නේ අපි Booking එකේදී හදාගන්න Data ටික
  const { booking_id, bus, seats, total_amount, date, passenger } = ticketData;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 animate-fadeIn">
      
      {/* 1. SUCCESS HEADER */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500">Success! Your journey is officially booked. We've sent a copy to your email.</p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* 2. LEFT SIDE: THE TICKET CARD */}
        <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                
                {/* Green Header */}
                <div className="bg-green-500 p-6 flex justify-between items-center text-white">
                    <div>
                        <p className="text-xs font-bold uppercase opacity-80 mb-1">Electronic Ticket</p>
                        <h2 className="text-2xl font-bold">#BUS-{booking_id || '992834'}</h2>
                    </div>
                    <QrCode className="w-12 h-12 opacity-80" />
                </div>

                {/* Ticket Details */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* Dashed Line Divider (Visual only) */}
                    <div className="absolute top-8 bottom-8 left-1/2 w-px border-l-2 border-dashed border-gray-200 hidden md:block"></div>

                    {/* From / To Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">From</p>
                            <h3 className="text-xl font-bold text-gray-900">{bus.start_location}</h3>
                            <p className="text-sm text-gray-500">Main Bus Stand</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">To</p>
                            <h3 className="text-xl font-bold text-gray-900">{bus.end_location}</h3>
                            <p className="text-sm text-gray-500">City Center</p>
                        </div>
                    </div>

                    {/* Date / Time / Seats */}
                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Date</p>
                                <p className="font-bold text-gray-800">{new Date(date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Time</p>
                                <p className="font-bold text-gray-800">{new Date(bus.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Seats</p>
                                <p className="font-bold text-gray-800 text-lg">{seats.join(', ')}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Class</p>
                                <p className="font-bold text-gray-800">{bus.bus_type}</p>
                            </div>
                        </div>
                         <div>
                             <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Paid</p>
                             <p className="font-bold text-blue-600 text-xl">LKR {total_amount}</p>
                        </div>
                    </div>
                </div>

                {/* Bus Image Section */}
                <div className="bg-gray-50 p-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                         <p className="font-bold text-gray-800 mb-1">{bus.operator_name}</p>
                         <p className="text-sm text-gray-500">{bus.bus_number}</p>
                    </div>
                    {/* Bus Image (Placeholder) */}
                    <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" alt="Bus" className="w-16 h-16 opacity-80" />
                </div>
            </div>
        </div>

        {/* 3. RIGHT SIDE: ACTION BUTTONS */}
        <div className="w-full md:w-80 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">Ticket Actions</h3>
                <div className="space-y-3">
                    <button onClick={() => window.print()} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center transition-colors">
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                    </button>
                    <button onClick={() => window.print()} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center transition-colors">
                        <Printer className="w-4 h-4 mr-2" /> Print Ticket
                    </button>
                    <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center transition-colors">
                        <Calendar className="w-4 h-4 mr-2" /> Add to Calendar
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-4">You can modify your booking or request a refund up to 24 hours before departure.</p>
                <button className="text-sm font-bold text-blue-600 hover:underline">Manage Booking →</button>
            </div>

             <div className="text-center">
                 <button onClick={onBackToHome} className="text-gray-500 font-medium hover:text-gray-900 flex items-center justify-center mx-auto">
                     <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Return to Dashboard
                 </button>
             </div>

        </div>

      </div>
    </div>
  );
};

export default Ticket;