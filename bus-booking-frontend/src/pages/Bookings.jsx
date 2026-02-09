import React, { useState } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Bookings = ({ allBookings }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);

  const downloadAllBookingsPDF = () => {
    const doc = new jsPDF();
    doc.text("Magiya - Full Booking Report", 14, 20);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Passenger', 'Bus/Route', 'Date', 'Status', 'Amount']],
      body: allBookings.map(b => [
        `#BK-${b.booking_id}`,
        b.passenger_name,
        `${b.bus_number} (${b.start_location} to ${b.end_location})`,
        new Date(b.departure_time).toDateString(),
        b.booking_status,
        `LKR ${b.total_amount}`
      ])
    });

    doc.save('all_bookings_report.pdf');
  };

  const downloadSingleReceipt = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(0, 78, 146);
    doc.text("Magiya Booking Receipt", 105, 20, null, null, "center");

    doc.setDrawColor(0);
    doc.setFillColor(245, 245, 245);
    doc.rect(14, 30, 182, 100, "F");

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Booking ID: #BK-${booking.booking_id}`, 20, 45);
    doc.text(`Date: ${new Date().toDateString()}`, 140, 45);

    doc.line(20, 50, 190, 50);

    doc.setFontSize(14);
    doc.text("Passenger Details", 20, 65);
    doc.setFontSize(11);
    doc.text(`Name: ${booking.passenger_name}`, 20, 75);
    doc.text(`Email: ${booking.email}`, 20, 82);

    doc.setFontSize(14);
    doc.text("Trip Details", 110, 65);
    doc.setFontSize(11);
    doc.text(`Bus: ${booking.bus_number} (${booking.operator_name})`, 110, 75);
    doc.text(`Route: ${booking.start_location} to ${booking.end_location}`, 110, 82);

    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0);
    doc.text(`Total Paid: LKR ${booking.total_amount}`, 105, 115, null, null, "center");

    doc.save(`receipt_bk_${booking.booking_id}.pdf`);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6 mb-8">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">
          Booking Management
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-gray-900 font-bold text-lg">Passenger List</h3>
          <button
            onClick={downloadAllBookingsPDF}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Passenger
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Bus
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {allBookings.map((b) => (
                <tr key={b.booking_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">
                    #BK-{b.booking_id}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {b.passenger_name}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {b.email}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {b.bus_number}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(b.departure_time).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    LKR {b.total_amount}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => downloadSingleReceipt(b)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                    </div>
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

export default Bookings;
