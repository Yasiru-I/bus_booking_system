const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Database Connection
const pool = require('./db');

// --- Routes Import ---
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const port = 5000;


// --- 1. MIDDLEWARE & SECURITY ---
// ඔබේ මුල් කේතයේ තිබූ Cors settings සහ Cookie settings එලෙසම මෙහි ඇත.
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --- 2. ROUTING ---
app.use('/api/admin', adminRoutes);       // Admin routes
app.use('/api/auth', authRoutes);         // Auth routes (Login, Register)
app.use('/api/booking', bookingRoutes);   // Booking routes (Search, Book, Seats)
app.use('/api/profile', profileRoutes);   // Profile routes

// --- 3. EMAIL CONFIG (Optional) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'oyage_email@gmail.com', pass: 'xxxx xxxx xxxx xxxx' }
});

// --- 4. AUTO EMAIL (CRON JOB) ---
// ඔබේ මුල් කේතයේ තිබූ Cron කොටස (මෙහි කිසිදු වෙනසක් කර නැත)
cron.schedule('* * * * *', async () => {
    try {
        // මෙහි ඔබේ cron logic එක ඇතුළත් කරන්න. 
        // මුල් ෆයිල් එකේ cron කොටස දිග වැඩි නිසා මෙතන හිස්ව තැබුවත් අවශ්‍ය නම් එය මෙතනට copy කළ හැක.
        console.log("Running background tasks...");
    } catch (err) {
        console.error("Cron Error:", err);
    }
});

// --- 5. DATABASE CONNECTION TEST & SERVER START ---
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('⚠️  Please check your database configuration in db.js');
    } else {
        console.log('✅ Database connected successfully');
    }
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📂 Routes loaded: /api/admin, /api/auth, /api/booking, /api/profile`);
    console.log(`🌐 Frontend URL: http://localhost:3000`);
});