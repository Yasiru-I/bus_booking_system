
const pool = require('./db');
const bcrypt = require('bcryptjs');

async function debugLogin() {
    try {
        console.log('--- DEBUGGING LOGIN LOGIC ---');
        const email = 'admin@savari.com';
        const password = 'admin123';

        console.log(`Attempting login for: ${email}`);

        // 1. Fetch User
        const user = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            console.log('❌ User NOT FOUND in DB');
            return;
        }

        const dbUser = user.rows[0];
        console.log(`✅ User Found: ID=${dbUser.user_id}, Role=${dbUser.role}`);
        console.log(`stored hash: ${dbUser.password}`);

        // 2. Compare Password
        console.log(`Comparing '${password}' with stored hash...`);
        const validPassword = await bcrypt.compare(password, dbUser.password);

        if (validPassword) {
            console.log('✅ Password MATCHES!');
        } else {
            console.log('❌ Password DOES NOT MATCH.');

            // Force fix
            console.log('🔧 FIXING PASSWORD...');
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(password, salt);
            await pool.query("UPDATE Users SET password = $1 WHERE email = $2", [newHash, email]);
            console.log('✅ Password updated manually. Try logging in now.');
        }

    } catch (err) {
        console.error('Debug Error:', err);
    } finally {
        pool.end();
    }
}

debugLogin();
