const pool = require('../db');

// 1. Profile විස්තර සහ Co-passengers ගන්න
const getProfile = async (req, res) => {
    try {
        const { user_id } = req.params;
        const userRes = await pool.query("SELECT name, email, phone, dob, gender, address, notify_email, notify_whatsapp, notify_sms FROM Users WHERE user_id = $1", [user_id]);
        const passRes = await pool.query("SELECT * FROM Co_Passengers WHERE user_id = $1", [user_id]);

        res.json({ user: userRes.rows[0], co_passengers: passRes.rows });
    } catch (err) { res.status(500).send("Server Error"); }
};

// 2. Profile Update කරන්න
const updateProfile = async (req, res) => {
    try {
        const { user_id, name, phone, dob, address, gender } = req.body;
        await pool.query(
            "UPDATE Users SET name=$1, phone=$2, dob=$3, address=$4, gender=$5 WHERE user_id=$6",
            [name, phone, dob, address, gender, user_id]
        );
        res.json({ message: "Profile Updated!" });
    } catch (err) { res.status(500).send("Update Failed"); }
};

// 3. Co-passenger කෙනෙක් Add කරන්න
const addCoPassenger = async (req, res) => {
    try {
        const { user_id, name, age, gender, relation } = req.body;
        await pool.query("INSERT INTO Co_Passengers (user_id, name, age, gender, relation) VALUES ($1, $2, $3, $4, $5)", 
        [user_id, name, age, gender, relation]);
        res.json({ message: "Added Successfully" });
    } catch (err) { res.status(500).send("Error"); }
};

// 4. Co-passenger Delete කරන්න
const deleteCoPassenger = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM Co_Passengers WHERE passenger_id = $1", [id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).send("Error"); }
};

module.exports = { getProfile, updateProfile, addCoPassenger, deleteCoPassenger };