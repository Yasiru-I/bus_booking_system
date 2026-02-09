
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AdminLogin = ({ setView }) => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/admin/login', loginData, { withCredentials: true });

            // Save admin info to localStorage (but NOT the token, that's in the cookie)
            localStorage.setItem('user', JSON.stringify(res.data.user));

            Swal.fire({
                icon: 'success',
                title: 'Welcome Admin!',
                text: 'Accessing Dashboard...',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                // Force full reload to update App state properly
                window.location.href = '/admin/dashboard';
            });

        } catch (err) {
            console.error("Login Error Details:", err);
            let errorMessage = 'Invalid Credentials';

            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("Server Error Data:", err.response.data);
                if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
            } else if (err.request) {
                // The request was made but no response was received
                errorMessage = "No response from server. Check backend connection.";
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = err.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: errorMessage,
                footer: '<pre>' + JSON.stringify(err.response?.data || {}, null, 2) + '</pre>'
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 transform transition duration-500 hover:scale-105">
                <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">🛡 Admin Panel</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                        type="email"
                        className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-yellow-400"
                        placeholder="admin@savari.com"
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-yellow-400"
                        placeholder="••••••••"
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded transition duration-300"
                >
                    Secure Login 🚀
                </button>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="text-sm text-gray-400 hover:text-white underline"
                    >
                        &larr; Back to Public Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
