import React, { useState } from 'react';
import { UserPlus, ArrowLeft, User, Mail, Lock, Loader2 } from 'lucide-react';

const SignupPage = ({ setCurrentPage }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // This is what we send to the backend
        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password, // Send plain, backend will hash it
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
        };

        try {
            // Replace '/api/signup' with your actual backend URL later
            // const response = await fetch('http://localhost:5000/api/signup', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(userData)
            // });

            // if (response.ok) { ... }

            console.log("Real App Data Prepared:", userData);
            
            // Mock delay to simulate server hashing and DB save
            setTimeout(() => {
                alert("Account created! In a real app, your password was just hashed on the server and saved to the DB.");
                setIsLoading(false);
                setCurrentPage('login');
            }, 1500);

        } catch (error) {
            console.error("Signup error:", error);
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
                
                <h2 className="text-4xl font-extrabold text-[#062b18] mb-4">Join IngreMatch</h2>
                <p className="text-lg text-black opacity-70 mb-8">Start matching your ingredients today.</p>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="text-left">
                        <label className="block text-sm font-bold text-[#062b18] mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="yourName" 
                                required 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none"
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-bold text-[#062b18] mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                type="email" 
                                placeholder="ingrematch@gmail.com" 
                                required 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none"
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-bold text-[#062b18] mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none"
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full mt-4 flex items-center justify-center bg-[#BB4500] hover:bg-[#062b18] text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        ) : (
                            <UserPlus className="w-5 h-5 mr-3" />
                        )}
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-8 text-sm text-gray-500">
                    Already have an account? 
                    <button 
                        onClick={() => setCurrentPage('login')} 
                        className="ml-1 text-[#062b18] hover:underline font-bold"
                    >
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;