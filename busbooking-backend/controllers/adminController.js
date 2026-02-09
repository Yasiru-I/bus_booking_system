const pool = require('../db');
const bcrypt = require('bcryptjs');

// 1. DASHBOARD DATA
const getDashboardData = async (req, res) => {
    try {
        const bookingsCount = await pool.query("SELECT COUNT(*) AS count FROM Booking");
        const income = await pool.query("SELECT SUM(total_amount) AS total FROM Booking");
        const usersCount = await pool.query("SELECT COUNT(*) AS count FROM Users WHERE role = 'passenger'");
        
        const recentBookings = await pool.query(`
            SELECT b.booking_id, u.name, bus.bus_number, r.end_location, b.total_amount, b.booking_status
            FROM Booking b
            JOIN Users u ON b.user_id = u.user_id
            JOIN Schedule s ON b.schedule_id = s.schedule_id
            JOIN Bus bus ON s.bus_id = bus.bus_id
            JOIN Route r ON s.route_id = r.route_id
            ORDER BY b.booking_id DESC LIMIT 5
        `);

        res.json({
            income: income.rows[0].total || 0,
            totalBookings: bookingsCount.rows[0].count,
            totalUsers: usersCount.rows[0].count,
            recent: recentBookings.rows
        });
    } catch (err) { res.status(500).send("Server Error"); }
};

// 2. ALL BOOKINGS (ADMIN VIEW)
const getAllBookings = async (req, res) => {
    try {
        const query = `
            SELECT b.booking_id, u.name as passenger_name, u.email, 
            bus.bus_number, bus.operator_name, 
            r.start_location, r.end_location, 
            s.departure_time, b.booking_status, b.total_amount
            FROM Booking b
            JOIN Users u ON b.user_id = u.user_id
            JOIN Schedule s ON b.schedule_id = s.schedule_id
            JOIN Bus bus ON s.bus_id = bus.bus_id
            JOIN Route r ON s.route_id = r.route_id
            ORDER BY b.booking_id DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) { res.status(500).send("Server Error"); }
};

// 3. BUS MANAGEMENT
const getBuses = async (req, res) => {
    const result = await pool.query("SELECT * FROM Bus ORDER BY bus_id DESC");
    res.json(result.rows);
};

const addBus = async (req, res) => {
    try {
        const { bus_number, operator_name, bus_type, capacity } = req.body;
        await pool.query("INSERT INTO Bus (bus_number, operator_name, bus_type, capacity) VALUES ($1, $2, $3, $4)", [bus_number, operator_name, bus_type, capacity]);
        res.json({ message: "Bus Added Successfully" });
    } catch (err) { res.status(500).send("Error adding bus"); }
};

const deleteBus = async (req, res) => {
    try {
        await pool.query("DELETE FROM Bus WHERE bus_id = $1", [req.params.id]);
        res.json({ message: "Bus Deleted" });
    } catch (err) { res.status(500).send("Cannot delete: Bus might be used in a trip."); }
};

// 4. ROUTE MANAGEMENT
const getRoutes = async (req, res) => {
    const result = await pool.query("SELECT * FROM Route ORDER BY route_id DESC");
    res.json(result.rows);
};

const addRoute = async (req, res) => {
    try {
        const { route_title, start_location, end_location, distance_km, estimated_duration, stops } = req.body;
        const newRoute = await pool.query("INSERT INTO Route (route_title, start_location, end_location, distance_km, estimated_duration, status) VALUES ($1, $2, $3, $4, $5, 'Active') RETURNING route_id", [route_title, start_location, end_location, distance_km, estimated_duration]);
        
        const routeID = newRoute.rows[0].route_id;
        if (stops && stops.length > 0) {
            for (let i = 0; i < stops.length; i++) {
                if(stops[i].trim() !== "") {
                    await pool.query("INSERT INTO Route_Stops (route_id, stop_name, stop_order) VALUES ($1, $2, $3)", [routeID, stops[i], i + 1]);
                }
            }
        }
        res.json({ message: "Route Added!" });
    } catch (err) { res.status(500).send("Error adding route"); }
};

const deleteRoute = async (req, res) => {
    try {
        await pool.query("DELETE FROM Route WHERE route_id = $1", [req.params.id]);
        res.json({ message: "Route Deleted" });
    } catch (err) { res.status(500).send("Error deleting route"); }
};

// 5. SCHEDULE MANAGEMENT
const getSchedules = async (req, res) => {
    const query = `SELECT s.*, b.bus_number, b.operator_name, r.start_location, r.end_location FROM Schedule s JOIN Bus b ON s.bus_id = b.bus_id JOIN Route r ON s.route_id = r.route_id ORDER BY s.departure_time ASC`;
    const result = await pool.query(query);
    res.json(result.rows);
};

const addSchedule = async (req, res) => {
    try {
        const { bus_id, route_id, departure_time, arrival_time, price, driver_name } = req.body;
        await pool.query("INSERT INTO Schedule (bus_id, route_id, departure_time, arrival_time, ticket_price, driver_name, status) VALUES ($1, $2, $3, $4, $5, $6, 'Scheduled')", [bus_id, route_id, departure_time, arrival_time, price, driver_name]);
        res.json({ message: "Schedule Added!" });
    } catch (err) { res.status(500).send("Error adding schedule"); }
};

const getFormData = async (req, res) => {
    const buses = await pool.query("SELECT bus_id, bus_number FROM Bus");
    const routes = await pool.query("SELECT route_id, start_location, end_location FROM Route");
    res.json({ buses: buses.rows, routes: routes.rows });
};

// 6. PASSENGER MANAGEMENT
const getPassengers = async (req, res) => {
    const result = await pool.query("SELECT u.*, (SELECT COUNT(*) FROM Booking b WHERE b.user_id = u.user_id) as total_bookings FROM Users u WHERE u.role = 'passenger' ORDER BY u.user_id DESC");
    res.json(result.rows);
};

// ... උඩ කෑලි එහෙමම තියන්න ...

const getPassengerHistory = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. User Details
        const userDetails = await pool.query("SELECT * FROM Users WHERE user_id = $1", [userId]);

        // 2. Booking History (Bus Number, Operator එක්ක)
        const bookingHistory = await pool.query(`
            SELECT b.booking_id, r.start_location, r.end_location, b.total_amount, b.booking_status, 
            s.departure_time, bus.operator_name, bus.bus_number
            FROM Booking b
            JOIN Schedule s ON b.schedule_id = s.schedule_id
            JOIN Route r ON s.route_id = r.route_id
            JOIN Bus bus ON s.bus_id = bus.bus_id
            WHERE b.user_id = $1
            ORDER BY b.booking_id DESC
        `, [userId]);

        // 3. 🔥 Support Tickets (මේක කලින් අතපසු වුනා)
        const supportTickets = await pool.query(
            "SELECT * FROM Support_Tickets WHERE user_id = $1 ORDER BY created_at DESC", 
            [userId]
        );

        // 4. 🔥 Refunds (මේකත් කලින් අතපසු වුනා)
        const refunds = await pool.query(
            "SELECT * FROM Refunds WHERE user_id = $1 ORDER BY request_date DESC", 
            [userId]
        );

        // 5. Stats (ගණනය කිරීම්)
        const totalTrips = bookingHistory.rows.length;
        // Total Amount එක Number එකක් බවට හරවා එකතු කිරීම
        const totalSpent = bookingHistory.rows.reduce((sum, trip) => sum + parseFloat(trip.total_amount || 0), 0);

        res.json({
            user: userDetails.rows[0],
            history: bookingHistory.rows,
            tickets: supportTickets.rows, // යවනවා
            refunds: refunds.rows,        // යවනවා
            stats: { totalTrips, totalSpent }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching history");
    }
};

// ... පහල අනිත් කෑලි එහෙමම තියන්න (module.exports ... etc)
const updatePassengerStatus = async (req, res) => {
    await pool.query("UPDATE Users SET account_status = $1 WHERE user_id = $2", [req.body.status, req.params.id]);
    res.json({ message: "Updated" });
};

const deletePassenger = async (req, res) => {
    try {
        await pool.query("DELETE FROM Users WHERE user_id = $1", [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).send("Error"); }
};

const addPassenger = async (req, res) => {
    try {
        const { name, email, phone, dob, gender, autoPassword } = req.body;
        const plainPassword = autoPassword ? Math.random().toString(36).slice(-8) : 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        await pool.query("INSERT INTO Users (name, email, phone, dob, gender, password, role, loyalty_points, account_status) VALUES ($1, $2, $3, $4, $5, $6, 'passenger', 0, 'Active')", [name, email, phone, dob, gender, hashedPassword]);
        res.json({ message: "Passenger Added" });
    } catch (err) { res.status(500).send(err.message); }
};

// ... (වෙනත් කෝඩ්) ...

// 🔥 NEW: මගහැරුණු කොටස් එකතු කිරීම

// 1. ෂෙඩියුල් එකක් (Trip) Delete කිරීම
const deleteSchedule = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        // මුලින්ම Booking_Seat සහ Booking මකන්න ඕනේ (Foreign Key නිසා)
        await pool.query("DELETE FROM Booking_Seat WHERE booking_id IN (SELECT booking_id FROM Booking WHERE schedule_id = $1)", [scheduleId]);
        await pool.query("DELETE FROM Booking WHERE schedule_id = $1", [scheduleId]);
        // අන්තිමට Schedule එක මකනවා
        await pool.query("DELETE FROM Schedule WHERE schedule_id = $1", [scheduleId]);
        res.json({ message: "Trip Deleted Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting trip");
    }
};

// 2. එක බස් එකක යන මගීන්ගේ ලිස්ට් එක (Manifest)
const getTripPassengers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.name, u.phone, u.email, bs.seat_number, bs.passenger_gender
            FROM Booking_Seat bs 
            JOIN Booking b ON bs.booking_id = b.booking_id 
            JOIN Users u ON b.user_id = u.user_id 
            WHERE b.schedule_id = $1 
            ORDER BY bs.seat_number ASC
        `, [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Error fetching passengers");
    }
};

// 3. Route Status මාරු කිරීම (Active/Inactive)
const updateRouteStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        await pool.query("UPDATE Route SET status = $1 WHERE route_id = $2", [status, req.params.id]);
        res.json({ message: "Route Status Updated" });
    } catch (err) {
        res.status(500).send("Error updating route status");
    }
};

module.exports = {
    getDashboardData, getAllBookings,
    getBuses, addBus, deleteBus,
    getRoutes, addRoute, deleteRoute,
    getSchedules, addSchedule, getFormData,
    getPassengers, getPassengerHistory, updatePassengerStatus, deletePassenger, addPassenger,
    deleteSchedule,     // <-- Add this
    getTripPassengers,  // <-- Add this
    updateRouteStatus   // <-- Add this
};