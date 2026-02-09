
const pool = require('./db');
const bcrypt = require('bcryptjs');

async function debugPassengerLogin() {
    console.log('--- DEBUGGING PASSENGER LOGIN ---');
    const testEmail = 'test_passenger_debug@example.com';
    const testPass = 'password123';

    try {
        // 1. DELETE existing test user
        await pool.query("DELETE FROM Users WHERE email = $1", [testEmail]);

        // 2. REGISTER (Hash password)
        console.log(`Creating test user: ${testEmail}`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testPass, salt);
        
        const insertRes = await pool.query(
            "INSERT INTO Users (name, email, phone, password, role, account_status) VALUES ($1, $2, $3, $4, 'passenger', 'Active') RETURNING user_id",
            ['Test Passenger', testEmail, '0771234567', hashedPassword]
        );
        console.log(`✅ Test User Created. ID: ${insertRes.rows[0].user_id}`);

        // 3. ATTEMPT LOGIN (Simulation of authController.userLogin)
        console.log(`Attempting login...`);
        const userQuery = await pool.query("SELECT * FROM Users WHERE email = $1", [testEmail]);
        
        if (userQuery.rows.length === 0) {
            console.log('❌ User NOT FOUND during login check!');
            return;
        }

        const dbUser = userQuery.rows[0];
        console.log(`User Found. Role: ${dbUser.role}`);
        
        const validPassword = await bcrypt.compare(testPass, dbUser.password);
        if (validPassword) {
            console.log('✅ Password Match! Login Logic Logic is Correct.');
        } else {
            console.log('❌ Password Mismatch during login check!');
        }

    } catch (err) {
        console.error('Debug Error:', err);
    } finally {
        pool.end();
    }
}

debugPassengerLogin();
