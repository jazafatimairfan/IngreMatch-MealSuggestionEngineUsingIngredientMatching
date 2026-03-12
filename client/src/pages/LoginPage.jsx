import React, { useState } from 'react'; // Added useState
import { LogIn, ArrowLeft, Loader2 } from 'lucide-react'; // Added Loader2 for better UX

const LoginPage = ({ setCurrentPage }) => {
    // 1. Create state to capture inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 2. Call your Node.js login API
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
    // 3. Success!
    localStorage.setItem("user", JSON.stringify(data.user));
    alert(`Welcome back, ${data.user.username}!`);
                setCurrentPage('recipes'); // Change this to whatever your recipe page name is
            } else {
                // 4. Handle errors (User not found or Wrong Password)
                if (data.error === "User not found") {
                    alert("Account not found. Please sign up first!");
                    setCurrentPage('signup');
                } else {
                    alert(data.error || "Login failed. Please check your credentials.");
                }
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Could not connect to the server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                            value={email} // Controlled input
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-left text-sm font-bold text-[#062b18] mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} // Controlled input
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center bg-[#062b18] hover:bg-[#BB4500] text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        ) : (
                            <LogIn className="w-5 h-5 mr-3" /> 
                        )}
                        {isLoading ? "Checking..." : "Log In Securely"}
                    </button>
                </form>

                <p className="mt-8 text-sm text-gray-500">
                    Don't have an account? 
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage('signup');
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