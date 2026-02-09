
const pool = require('./db');
const bcrypt = require('bcryptjs');

async function debugAdmin() {
    try {
        console.log('--- DEBUGGING ADMIN USER ---');

        // 1. List all users to see what's in there
        const res = await pool.query("SELECT user_id, name, email, role, password, account_status FROM Users");
        console.log('Total Users:', res.rowCount);
        console.table(res.rows);

        // 2. Check specific admin email
        const email = 'admin@savari.com'; // Adjust if you know the specific email
        const adminUser = res.rows.find(u => u.email === email);

        if (adminUser) {
            console.log(`\nFound Admin User: ${adminUser.email}`);
            console.log(`Role: ${adminUser.role}`);
            // ... (rest of the logic)
        } else {
            console.log(`\nUser ${email} NOT FOUND. Creating one...`);
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('admin123', salt);

            // Generate random phone to avoid conflict
            const randomPhone = '07' + Math.floor(Math.random() * 100000000);

            await pool.query(
                "INSERT INTO Users (name, email, phone, password, role, account_status) VALUES ($1, $2, $3, $4, $5, $6)",
                ['Super Admin', email, randomPhone, hash, 'admin', 'Active']
            );
            console.log(`Created Admin User: ${email} / admin123`);
        }

        // Cleanup empty user
        await pool.query("DELETE FROM Users WHERE email = '' OR email IS NULL");
        console.log("Cleaned up invalid users.");

    } catch (err) {
        console.error('Debug Error:', err);
    } finally {
        pool.end();
    }
}

debugAdmin();
