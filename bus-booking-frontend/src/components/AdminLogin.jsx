import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Shield, Lock, Mail } from 'lucide-react';

const AdminLogin = ({ onAdminLogin }) => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            Swal.fire('Error', 'Please enter both email and password', 'error');
            return;
        }

        setLoading(true);

        try {
            // Call admin-specific login endpoint
            const res = await axios.post('http://localhost:5000/api/auth/admin-login', loginData, {
                withCredentials: true // Important: Send cookies
            });

            console.log('Admin login response:', res.data);

            Swal.fire({
                icon: 'success',
                title: 'Welcome Admin!',
                text: res.data.message || 'Login successful',
                timer: 2000,
                showConfirmButton: false
            });

            // Call parent callback to update app state
            if (onAdminLogin) {
                onAdminLogin(res.data.user);
            }

        } catch (err) {
            console.error('Admin login error:', err);
            const errorMsg = err.response?.data?.message || 'Invalid admin credentials';
            Swal.fire('Access Denied', errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Admin Badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-blue-200">Secure Administrator Access</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                                <input
                                    type="email"
                                    placeholder="admin@savari.lk"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Authenticating...
                                </span>
                            ) : (
                                'Access Admin Dashboard'
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-yellow-100 font-medium mb-1">Secure Access Only</p>
                                <p className="text-xs text-yellow-200/80">This portal is restricted to authorized administrators. All access attempts are logged.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-blue-200 hover:text-white transition-colors text-sm font-medium"
                    >
                        ← Back to Passenger Portal
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
