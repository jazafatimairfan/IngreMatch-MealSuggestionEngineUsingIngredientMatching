import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const OtpVerification = ({ email, setCurrentPage }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", { email, otp });

      if (res.data.message === "Login successful") {
        // Save user to localStorage so RecipePage and rest of app can use it
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        setMessage("OTP verified! Redirecting...");
        setTimeout(() => setCurrentPage("landing"), 1000);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#EFEFEF] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border-2 border-[#062b18]/10 text-center">

        {/* Back Button */}
        <button
          onClick={() => setCurrentPage("signup")}
          className="flex items-center text-[#062b18] hover:text-[#BB4500] mb-6 transition duration-200 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Signup
        </button>

        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-[#BB4500] mb-4">Verify OTP</h2>
        <p className="text-lg text-black opacity-70 mb-8">
          Enter the OTP sent to <span className="font-semibold text-[#062b18]">{email}</span>
        </p>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6 text-left">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
            maxLength={6}
            className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest font-bold focus:ring-2 focus:ring-[#062b18] outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-[#062b18] hover:bg-[#BB4500] text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {message && (
          <p className={`text-center mt-4 font-medium ${
            message.includes("verified") || message.includes("successful")
              ? "text-green-600"
              : "text-red-500"
          }`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-xs text-gray-400">OTP expires in 5 minutes. Check your email inbox.</p>
      </div>
    </div>
  );
};

export default OtpVerification;