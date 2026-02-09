
const http = require('http');

// Config
const BASE_URL = 'http://localhost:5000';
const ADMIN_EMAIL = 'admin@savari.com';
const ADMIN_PASS = 'admin123';
const USER_EMAIL = 'test_passenger_debug@example.com';
const USER_PASS = 'password123';

async function testLogin() {
    console.log('--- TESTING LOGIN ENDPOINTS (HTTP via fetch) ---');

    // 1. Test Admin Login
    console.log(`\n1. Testing Admin Login (${ADMIN_EMAIL})...`);
    try {
        const res = await fetch(`${BASE_URL}/api/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS })
        });

        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log('Response:', data);

        const cookies = res.headers.get('set-cookie');
        if (cookies) {
            console.log('✅ Cookies Received:', cookies);
        } else {
            console.log('❌ NO COOKIES RECEIVED! Admin auth will fail on next step.');
        }

    } catch (e) {
        console.error('Admin Login Request Failed:', e.message);
    }

    // 2. Test Passenger Login
    console.log(`\n2. Testing Passenger Login (${USER_EMAIL})...`);
    try {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: USER_EMAIL, password: USER_PASS })
        });

        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log('Response:', data);

        if (res.status === 200) {
            console.log('✅ Passenger Login Successful via HTTP');
        } else {
            console.log('❌ Passenger Login Failed via HTTP');
        }

    } catch (e) {
        console.error('Passenger Login Request Failed:', e.message);
    }
}

// Check if server is running
fetch(BASE_URL).then(() => {
    // It might return 404 because / is not defined, but that's fine, server is up.
    testLogin();
}).catch((e) => {
    // If it's 404, it means server IS running. Connection refused means NOT running.
    if (e.cause && e.cause.code === 'ECONNREFUSED') {
        console.error(`❌ Server is NOT running on ${BASE_URL}. Please start it first.`);
        process.exit(1);
    } else {
        testLogin();
    }
});
