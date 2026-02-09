const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ඔයාගේ Secret Key එක
const SECRET_KEY = process.env.SECRET_KEY || "magiya_highly_secure_secret_key_999";

// --- 1. ADMIN LOGIN ---
const adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();
        const user = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);

        if (user.rows.length === 0) return res.status(401).json({ message: "User Not Found" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ message: "Password Mismatch" });

        // 🔥 SECURITY: Only allow 'admin' role
        if (user.rows[0].role !== 'admin') {
            return res.status(403).json({ message: "Access Denied: Admins Only" });
        }

        if (user.rows[0].account_status !== 'Active') {
            return res.status(403).json({ message: "Account Suspended" });
        }

        const token = jwt.sign(
            { user_id: user.rows[0].user_id, role: user.rows[0].role },
            SECRET_KEY,
            { expiresIn: '2h' }
        );

        // 🔥 SECURITY: HTTP-Only Cookie for Admin
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS in production
            sameSite: 'strict',
            maxAge: 7200000 // 2 Hours
        });

        res.json({
            message: "Admin Login Successful",
            user: { name: user.rows[0].name, email: user.rows[0].email, role: 'admin' }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// --- 2. ADMIN LOGOUT ---
const adminLogout = (req, res) => {
    res.clearCookie('admin_token');
    res.json({ message: "Logged Out" });
};

// --- 3. CHECK AUTH (For Admin) ---
const checkAuth = (req, res) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ authenticated: false });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ authenticated: false });
        if (decoded.role !== 'admin') return res.status(403).json({ authenticated: false });

        res.json({ authenticated: true, user_id: decoded.user_id });
    });
};

// --- 4. USER LOGIN ---
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(400).json({ message: "Invalid Email" });

        // 🔥 SECURITY: Block Admins from Passenger Login
        if (user.rows[0].role === 'admin') {
            return res.status(403).json({ message: "Admins must use /admin-login" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(400).json({ message: "Invalid Password" });

        const token = jwt.sign({ user_id: user.rows[0].user_id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.rows[0].user_id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role } });
    } catch (err) { res.status(500).send("Server Error"); }
};

// --- 5. USER REGISTER ---
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            "INSERT INTO Users (name, email, phone, password, role, loyalty_points, account_status) VALUES ($1, $2, $3, $4, 'passenger', 0, 'Active')",
            [name, email, phone, hashedPassword]
        );
        res.json({ message: "Success" });
    } catch (err) { res.status(500).send(err.message); }
};

// --- 6. GET PASSENGER COUNT (🔥 NEW ADDITION) ---
const getPassengerCount = async (req, res) => {
    try {
        // 'passenger' role එක තියෙන අය පමණක් ගණන් කිරීම
        const result = await pool.query("SELECT COUNT(*) FROM Users WHERE role = 'passenger'");
        res.json({ count: parseInt(result.rows[0].count) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Functions ටික එළියට යවනවා
module.exports = {
    adminLogin,
    adminLogout,
    checkAuth,
    userLogin,
    registerUser,
    getPassengerCount // ✅ අලුත් Function එක මෙතනට දැම්මා
};