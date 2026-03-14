import React, { useState, useRef } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpVerification from './pages/OtpVerification';
import RecipePage from './pages/RecipePage';

const App = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState('landing');
    const [user, setUser] = useState(null);
    const [signupEmail, setSignupEmail] = useState(""); // ← needed for OTP
    const leadCaptureRef = useRef(null);

    const scrollToLeadCapture = () => {
        leadCaptureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#EFEFEF] text-black font-sans">
            <main className="flex-grow w-full">

                {currentPage === 'landing' && (
                    <LandingPage
                        scrollToLeadCapture={scrollToLeadCapture}
                        leadCaptureRef={leadCaptureRef}
                        handleLeadCapture={(e) => { e.preventDefault(); setShowModal(true); }}
                        setCurrentPage={setCurrentPage}
                    />
                )}

                {currentPage === 'login' && (
                    <LoginPage setCurrentPage={setCurrentPage} />
                )}

                {/* SignupPage now gets setSignupEmail so it can pass email to OTP page */}
                {currentPage === 'signup' && (
                    <SignupPage
                        setCurrentPage={setCurrentPage}
                        setSignupEmail={setSignupEmail}
                    />
                )}

                {/* OTP page receives the email that was entered during signup */}
                {currentPage === 'otp' && (
                    <OtpVerification
                        email={signupEmail}
                        setCurrentPage={setCurrentPage}
                    />
                )}

                {currentPage === 'recipes' && (
                    <RecipePage setCurrentPage={setCurrentPage} user={user} />
                )}

            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white p-10 rounded-2xl text-center max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-3xl font-bold mb-3">Success!</h3>
                        <button onClick={() => setShowModal(false)} className="bg-[#BB4500] text-white px-6 py-2 rounded-xl">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;