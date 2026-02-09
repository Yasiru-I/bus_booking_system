const pool = require('./db');

async function checkSchema() {
    try {
        // Get Users table structure
        const users = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users'
            ORDER BY ordinal_position
        `);
        console.log('Users Table Schema:');
        console.log(users.rows);

        // Get Booking table structure  
        const booking = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'booking'
            ORDER BY ordinal_position
        `);
        console.log('\nBooking Table Schema:');
        console.log(booking.rows);

        pool.end();
    } catch (err) {
        console.error(err);
        pool.end();
    }
}

checkSchema();
