import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

const SeatSelection = ({ scheduleId, ticketPrice, totalSeats, onBack, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  // --- Backend එකෙන් Book කරපු සීට් ටික ගන්නවා ---
useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/booking/seats/${scheduleId}`);
        
        // 🔥 FIX: Database එකෙන් එන ඕනෑම දෙයක් Number එකක් බවට හරවනවා
        // මේකෙන් String ("1") සහ Number (1) ප්‍රශ්නය විසඳෙනවා.
        const booked = res.data.map(seat => Number(seat.seat_number));
        
        console.log("Booked Seats (Formatted):", booked); // Console එකේ බලාගන්න
        setBookedSeats(booked);

      } catch (e) {
        console.error("Failed to fetch seats", e);
      }
    };
    
    if(scheduleId) fetchBookedSeats();
  }, [scheduleId]);
  // සීට් එකක් Click කළාම
  const toggleSeat = (seatNo) => {
    // 🔥 FIX: මෙතනත් parseInt දාලා check කරනවා
    if (bookedSeats.includes(seatNo)) return; 

    if (selectedSeats.includes(seatNo)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNo));
    } else {
      if (selectedSeats.length >= 5) return alert("You can only select up to 5 seats!");
      setSelectedSeats([...selectedSeats, seatNo]);
    }
  };

  const totalAmount = selectedSeats.length * ticketPrice;

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto animate-fadeIn">
      
      {/* 🟢 LEFT SIDE: SEAT MAP */}
      <div className="flex-1 bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl text-gray-800 border border-white/20">
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select Seats</h2>
            <p className="text-gray-500 text-sm">Bus Capacity: {totalSeats} Seats</p>
          </div>
          <button onClick={onBack} className="text-blue-600 text-sm font-bold hover:underline">
            Change Bus
          </button>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap gap-4 mb-8 bg-gray-100/50 p-3 rounded-xl justify-center border border-gray-200">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-gray-300 rounded bg-white"></div>
                <span className="text-gray-600 text-sm font-medium">Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded border border-gray-400"></div>
                <span className="text-gray-600 text-sm font-medium">Booked</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded border border-blue-600"></div>
                <span className="text-gray-600 text-sm font-medium">Selected</span>
            </div>
        </div>

        {/* DRIVER SEAT */}
        <div className="flex justify-end mb-4 px-10">
            <div className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
               <img src="https://cdn-icons-png.flaticon.com/512/5094/5094262.png" alt="Driver" className="w-6 opacity-50"/>
            </div>
        </div>

        {/* SEAT GRID */}
        <div className="bg-gray-100/80 rounded-3xl p-8 border border-gray-200 relative">
          <div className="grid grid-cols-4 gap-x-6 gap-y-4 max-w-xs mx-auto">
            {Array.from({ length: totalSeats }).map((_, i) => {
              const seatNo = i + 1;
              const isBooked = bookedSeats.includes(seatNo);
              const isSelected = selectedSeats.includes(seatNo);

              // Seat Colors
              let seatClass = "bg-white border-2 border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500"; 
              
              if (isBooked) {
                  // 🔥 Book වුන සීට් අළු පාට (Gray)
                  seatClass = "bg-gray-400 border-gray-400 text-white cursor-not-allowed opacity-60"; 
              }
              
              if (isSelected) {
                  seatClass = "bg-blue-600 border-blue-600 text-white shadow-lg scale-105"; 
              }

              return (
                <button
                  key={seatNo}
                  disabled={isBooked}
                  onClick={() => toggleSeat(seatNo)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 ${seatClass} ${
                     (i % 4 === 1) ? "mr-8" : ""
                  }`}
                >
                  {isSelected ? <CheckCircle className="w-5 h-5" /> : seatNo}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🔵 RIGHT SIDE: SUMMARY CARD */}
      <div className="w-full lg:w-96">
        <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-24 text-gray-800">
          <h3 className="text-xl font-bold mb-6 border-b pb-4 border-gray-100">Booking Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Selected Seats</span>
              <span className="font-bold text-gray-900">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Count</span>
              <span className="font-bold text-gray-900">{selectedSeats.length} Seats</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Price per Seat</span>
              <span className="font-bold text-gray-900">LKR {ticketPrice}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xl font-black text-blue-600 mb-8 pt-4 border-t border-gray-100">
            <span>Total</span>
            <span>LKR {totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={() => onConfirm(selectedSeats, totalAmount)}
            disabled={selectedSeats.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 ${
              selectedSeats.length === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30"
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;