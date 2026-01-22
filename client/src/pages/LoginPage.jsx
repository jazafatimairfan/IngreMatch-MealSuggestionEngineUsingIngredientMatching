import React from 'react';
import { LogIn, ArrowLeft } from 'lucide-react';

const LoginPage = ({ setCurrentPage }) => {
    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Attempting login...");
        setCurrentPage('landing'); 
        alert("Mock Login Successful! Redirecting to home.");
    };

    return (
        /* - fixed inset-0: Forces the background to cover the entire browser window 
           - z-[999]: Ensures it stays on top of any other layers
           - flex items-center justify-center: Centers the form perfectly
        */
        <div className="fixed inset-0 z-[999] bg-[#EFEFEF] flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border-2 border-[#062b18]/10">
                <button
                    onClick={() => setCurrentPage('landing')}
                    className="flex items-center text-[#062b18] hover:text-[#BB4500] mb-6 transition duration-200 text-sm font-bold"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Landing Page
                </button>
                
                <h2 className="text-4xl font-extrabold text-[#BB4500] mb-4">Welcome Back!</h2>
                <p className="text-lg text-black opacity-70 mb-8">Sign in to access your saved recipes.</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-left text-sm font-bold text-[#062b18] mb-1">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="ingrematch@gmail.com" 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-left text-sm font-bold text-[#062b18] mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full flex items-center justify-center bg-[#062b18] hover:bg-[#BB4500] text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        <LogIn className="w-5 h-5 mr-3" /> Log In Securely
                    </button>
                </form>
<p className="mt-8 text-sm text-gray-500">
    Don't have an account? 
    <button 
        type="button"  // <--- Crucial
        onClick={(e) => {
            e.preventDefault();
            setCurrentPage('signup'); // This now correctly talks to App.jsx
        }} 
        className="ml-1 text-[#BB4500] hover:underline font-bold"
    >
        Sign Up
    </button>
</p>
            </div>
        </div>
    );
};

export default LoginPage;