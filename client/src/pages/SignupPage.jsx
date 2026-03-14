import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

const SignupPage = ({ setCurrentPage, setSignupEmail }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Step 1: Register user in your main database
      await axios.post("http://localhost:5000/api/auth/signup", {
        username: name,
        email,
        password,
      });

      // Step 2: Send OTP email
      await axios.post("http://localhost:5000/send-otp", { email });

      // Step 3: Go to OTP page
      setSignupEmail(email);
      setCurrentPage("otp");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setLoading(true);
      try {
        // Get user info from Google
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const googleEmail = res.data.email;
        const googleName = res.data.name;

        // Register in database
        await axios.post("http://localhost:5000/api/auth/signup", {
          username: googleName,
          email: googleEmail,
          password: "google_oauth_" + tokenResponse.access_token.slice(0, 10),
        });

        // Send OTP to their Gmail
        await axios.post("http://localhost:5000/send-otp", { email: googleEmail });

        setSignupEmail(googleEmail);
        setCurrentPage("otp");

      } catch (err) {
        console.error(err);
        setError("Error with Google login. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google login failed."),
  });

  return (
    <div className="fixed inset-0 z-[999] bg-[#EFEFEF] flex items-center justify-center min-h-screen">
      <div className="w-full max-w-xs bg-white p-7 rounded-3xl shadow-2xl border-2 border-[#062b18]/10">

        {/* Back Button */}
        <button
          onClick={() => setCurrentPage("landing")}
          className="flex items-center text-[#062b18] hover:text-[#BB4500] mb-4 text-xs font-semibold"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-extrabold text-[#BB4500] mb-1 text-center">Create Account</h2>
        <p className="text-sm text-black opacity-70 mb-5 text-center">
          Sign up to save and access your recipes.
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none text-sm"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#062b18] outline-none text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-[#062b18] hover:bg-[#BB4500] text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-95 text-sm disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>

        {error && <p className="text-center mt-2 text-red-500 text-sm">{error}</p>}

        {/* Already have account */}
        <p className="mt-3 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <button
            onClick={() => setCurrentPage("login")}
            className="ml-1 text-[#BB4500] hover:underline font-semibold"
          >
            Log In
          </button>
        </p>

        {/* OR Divider */}
        <div className="flex items-center my-3">
          <hr className="flex-1 border-gray-300 border-t" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300 border-t" />
        </div>

        {/* Google login */}
        <button
          onClick={() => googleLogin()}
          disabled={loading}
          className="w-full flex items-center justify-center bg-[#062b18] hover:bg-[#BB4500] text-white font-bold py-3 rounded-xl transition-all shadow-sm active:scale-95 text-sm disabled:opacity-50"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignupPage;