
const pool = require('./db');

async function auditUsers() {
    console.log('--- USER DATA AUDIT ---');
    try {
        const res = await pool.query("SELECT user_id, email, role, password, account_status FROM Users");
        console.table(res.rows.map(u => ({
            id: u.user_id,
            email: u.email,
            role: u.role,
            status: u.account_status,
            password_start: u.password.substring(0, 7),
            is_hashed: u.password.startsWith('$2')
        })));
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
}

auditUsers();
