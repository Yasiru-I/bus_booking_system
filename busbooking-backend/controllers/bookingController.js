const pool = require('../db');

// 1. Search Buses
const searchBuses = async (req, res) => {
    try {
        const { from, to, date } = req.query;
        const query = `
            SELECT s.schedule_id, s.departure_time, s.arrival_time, s.ticket_price, 
                   b.bus_number, b.operator_name, b.bus_type, b.capacity, 
                   r.start_location, r.end_location,
                   (SELECT COUNT(*) FROM Booking_Seat bs JOIN Booking bk ON bs.booking_id = bk.booking_id WHERE bk.schedule_id = s.schedule_id) AS booked_seats
            FROM Schedule s 
            JOIN Bus b ON s.bus_id = b.bus_id 
            JOIN Route r ON s.route_id = r.route_id
            WHERE r.start_location ILIKE $1 AND r.end_location ILIKE $2 AND DATE(s.departure_time) = $3::date
        `;
        const result = await pool.query(query, [`%${from}%`, `%${to}%`, date]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// 2. Create Booking
const createBooking = async (req, res) => {
    try {
        console.log('📥 Booking Request Received:', req.body);
        const { user_id, schedule_id, seats, total_amount } = req.body;

        // Validation
        if (!user_id || !schedule_id || !seats || !total_amount) {
            console.error('❌ Missing required fields:', { user_id, schedule_id, seats: seats ? 'exists' : 'missing', total_amount });
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // A. Booking එක හදනවා
        console.log('Creating booking for user:', user_id, 'schedule:', schedule_id);
        const newBooking = await pool.query(
            "INSERT INTO Booking (user_id, schedule_id, total_amount, booking_status) VALUES ($1, $2, $3, 'confirmed') RETURNING booking_id",
            [user_id, schedule_id, total_amount]
        );

        const bookingId = newBooking.rows[0].booking_id;
        console.log('✅ Booking created with ID:', bookingId);

        // B. Seats ටික Save කරනවා
        console.log('Saving seats:', seats);
        for (const seat of seats) {
            await pool.query("INSERT INTO Booking_Seat (booking_id, seat_number, passenger_gender) VALUES ($1, $2, $3)",
                [bookingId, seat.no, seat.gender]);
        }
        console.log('✅ Seats saved');

        // C. Loyalty Points
        const pointsToAdd = Math.floor(total_amount / 100);
        await pool.query("UPDATE Users SET loyalty_points = loyalty_points + $1 WHERE user_id = $2", [pointsToAdd, user_id]);
        console.log('✅ Loyalty points added:', pointsToAdd);

        res.json({ message: "Booked & Points Added!", booking_id: bookingId });

    } catch (err) {
        console.error('❌ Booking Error:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ error: err.message, details: err.detail || 'No additional details' });
    }
};

// 3. My Bookings (FIXED HERE)
const getMyBookings = async (req, res) => {
    try {
        const { user_id } = req.params; // URL එකෙන් user_id එක ගන්නවා

        const query = `
            SELECT b.booking_id, b.total_amount, b.booking_status, b.created_at,
            s.departure_time, 
            bus.operator_name, bus.bus_number, 
            r.start_location, r.end_location, r.distance_km,
            u.loyalty_points
            FROM Booking b
            JOIN Users u ON b.user_id = u.user_id 
            JOIN Schedule s ON b.schedule_id = s.schedule_id 
            JOIN Bus bus ON s.bus_id = bus.bus_id 
            JOIN Route r ON s.route_id = r.route_id 
            WHERE b.user_id = $1
            ORDER BY b.booking_id DESC
        `;

        const result = await pool.query(query, [user_id]);
        res.json(result.rows);

    } catch (err) {
        console.error("Error in getMyBookings:", err);
        res.status(500).send("Error fetching bookings");
    }
};

// 4. Cancel Booking
const cancelBooking = async (req, res) => {
    try {
        const { booking_id } = req.body;
        await pool.query("DELETE FROM Booking_Seat WHERE booking_id = $1", [booking_id]);
        await pool.query("UPDATE Booking SET booking_status = 'cancelled' WHERE booking_id = $1", [booking_id]);
        res.json({ message: "Cancelled Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error cancelling booking");
    }
};

// 5. Get Booked Seats
const getBookedSeats = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT seat_number FROM Booking_Seat bs JOIN Booking b ON bs.booking_id = b.booking_id WHERE b.schedule_id = $1 AND b.booking_status = 'confirmed'`,
            [req.params.schedule_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching seats");
    }
};

// 6. Last Booking
const getLastBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT b.booking_id, b.total_amount, b.created_at as booking_date, 
                   s.departure_time, s.arrival_time, 
                   r.start_location, r.end_location,
                   bus.bus_number, bus.operator_name
            FROM Booking b
            JOIN Schedule s ON b.schedule_id = s.schedule_id
            JOIN Route r ON s.route_id = r.route_id
            JOIN Bus bus ON s.bus_id = bus.bus_id
            WHERE b.user_id = $1
            ORDER BY b.booking_id DESC 
            LIMIT 1
        `;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.json({ found: false });
        res.json({ found: true, booking: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    searchBuses,
    createBooking,
    getMyBookings,
    cancelBooking,
    getBookedSeats,
    getLastBooking
};