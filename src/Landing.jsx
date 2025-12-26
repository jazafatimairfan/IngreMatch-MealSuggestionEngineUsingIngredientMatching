import React, { useState, useRef } from 'react';
// Lucide icons for visual appeal
import { ChefHat, Utensils, Zap, Heart, Search, ListChecks, Users, BookOpen, Send, CheckCircle, LogIn, ArrowLeft } from 'lucide-react';

// NOTE: This code uses Tailwind CSS custom color classes:
// primary-mahogany: #BB4500
// secondary-white: #EFEFEF
// accent-green: #062b18
// text-black: #000000 (We use text-black for clarity, which is usually #000000 or near black)

// Define the custom styles using a <style> block for colors, as we are in a single-file environment.
// This ensures the custom colors are available as utility classes.
const CustomStyles = () => (
    <style>
        {`
        /* Custom Tailwind Colors via CSS Variables and Utility Classes */
        .primary-mahogany { --tw-bg-opacity: 1; background-color: #BB4500; }
        .text-primary-mahogany { --tw-text-opacity: 1; color: #BB4500; }
        .border-primary-mahogany { --tw-border-opacity: 1; border-color: #BB4500; }
        .ring-primary-mahogany { --tw-ring-opacity: 1; --tw-ring-color: #BB4500; }

        .secondary-white { --tw-bg-opacity: 1; background-color: #EFEFEF; }
        .text-secondary-white { --tw-text-opacity: 1; color: #EFEFEF; }
        .border-secondary-white { --tw-border-opacity: 1; border-color: #EFEFEF; }

        .accent-green { --tw-bg-opacity: 1; background-color: #062b18; }
        .text-accent-green { --tw-text-opacity: 1; color: #062b18; }
        .border-accent-green { --tw-border-opacity: 1; border-color: #062b18; }

        .text-text-black { --tw-text-opacity: 1; color: #000000; }
        .bg-text-black { --tw-bg-opacity: 1; background-color: #000000; }
        `}
    </style>
);


const LoginPage = ({ setCurrentPage }) => {
    const handleLogin = (e) => {
        e.preventDefault();
        // In a real app, this would handle authentication.
        console.log("Attempting login...");
        // After successful (mock) login, redirect back to landing
        setCurrentPage('landing'); 
        alert("Mock Login Successful! Redirecting to home.");
    };

    return (
        <div className="min-h-screen secondary-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center bg-secondary-white p-8 sm:p-10 rounded-3xl shadow-2xl border-2 border-accent-green/30">
                <button
                    onClick={() => setCurrentPage('landing')}
                    className="flex items-center text-accent-green hover:text-primary-mahogany mb-6 transition duration-200 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Landing Page
                </button>
                
                <h2 className="text-4xl font-extrabold text-primary-mahogany mb-4">
                    Welcome Back!
                </h2>
                <p className="text-lg text-text-black opacity-70 mb-8">
                    Sign in to access your saved recipes and custom filters.
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="login-email" className="block text-left text-sm font-medium text-text-black mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="login-email"
                            placeholder="you@ingrematch.com"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent-green focus:border-accent-green text-base"
                        />
                    </div>
                    <div>
                        <label htmlFor="login-password" className="block text-left text-sm font-medium text-text-black mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="login-password"
                            placeholder="••••••••"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-accent-green focus:border-accent-green text-base"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center bg-accent-green hover:bg-primary-mahogany text-secondary-white font-bold py-4 px-8 text-xl rounded-xl transition duration-300 shadow-lg hover:shadow-2xl"
                    >
                        <LogIn className="w-5 h-5 mr-3" />
                        Log In Securely
                    </button>
                </form>

                <p className="mt-8 text-sm text-gray-500">
                    Don't have an account? <a href="#" className="text-primary-mahogany hover:underline font-semibold">Sign Up</a>
                </p>
            </div>
        </div>
    );
};


const LandingContent = ({ scrollToLeadCapture, leadCaptureRef, handleLeadCapture, setShowModal }) => {
    // --- Hero Section ---
    const HeroSection = () => (
        <section className="bg-secondary-white py-16 sm:py-24 text-center">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-accent-green mb-6 leading-tight">
                    Don't Waste Ingredients. <span className="text-primary-mahogany">Dine Smart.</span>
                </h1>
                <p className="text-xl text-text-black mb-10 max-w-2xl mx-auto opacity-80">
                    Turn your current refrigerator contents into delicious, personalized recipes instantly.
                </p>
                {/* --- Call to Action (Leads to trackable form) --- */}
                <button
                    onClick={scrollToLeadCapture}
                    className="inline-flex items-center justify-center bg-primary-mahogany hover:bg-primary-mahogany/80 text-secondary-white font-bold py-4 px-10 text-lg rounded-2xl transition duration-300 shadow-[0_10px_20px_rgba(187,69,0,0.5)] transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 ring-primary-mahogany/70"
                >
                    <Zap className="w-6 h-6 mr-3" />
                    Unlock Your Free Recipe Match!
                </button>
                <p className="text-sm text-text-black opacity-60 mt-4">Takes less than 30 seconds!</p>
            </div>
        </section>
    );
    
    // --- Lead Capture Section (The trackable form) ---
    const LeadCaptureForm = () => (
        <section ref={leadCaptureRef} id="lead-capture" className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8 border-t border-b border-primary-mahogany/20">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-accent-green mb-4">
                    Find Your Perfect Recipe Match
                </h2>
                <p className="text-lg text-gray-700 mb-10">
                    Enter your ingredients and your email to instantly receive a custom recipe tailored just for you.
                </p>
                
                <div className="bg-secondary-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-primary-mahogany/30">
                    <form onSubmit={handleLeadCapture}>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label htmlFor="ingredients" className="block text-left text-sm font-medium text-text-black mb-1">
                                    1. List Your Key Ingredients (e.g., Chicken, potatoes, spinach)
                                </label>
                                <input
                                    type="text"
                                    id="ingredients"
                                    placeholder="Separate ingredients with commas"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-mahogany focus:border-primary-mahogany text-base"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-left text-sm font-medium text-text-black mb-1">
                                    2. Your Email Address (Required for recipe delivery)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="you@example.com"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary-mahogany focus:border-primary-mahogany text-base"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center bg-accent-green hover:bg-primary-mahogany text-secondary-white font-bold py-4 px-8 text-xl rounded-xl transition duration-300 shadow-lg hover:shadow-2xl"
                        >
                            <Send className="w-6 h-6 mr-3" />
                            Generate & Get My Recipe!
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );

    // --- Problem Section ---
    const ProblemSection = () => (
        <section id="problem" className="bg-accent-green text-secondary-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-primary-mahogany">The Problem We Solve</h2>
                <p className="text-xl opacity-80 max-w-3xl mx-auto mb-16">
                    Food waste and decision fatigue in the kitchen are costly—both for your wallet and the planet.
                </p>

                <div className="grid md:grid-cols-3 gap-8 text-text-black">
                    {/* Card 1: Food Waste */}
                    <div className="bg-secondary-white p-8 rounded-2xl shadow-xl transition duration-500 hover:shadow-primary-mahogany/50 hover:-translate-y-1">
                        <Utensils className="w-10 h-10 text-primary-mahogany mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">Ingredient Graveyard</h3>
                        <p className="text-gray-700">
                            Up to 25% of purchased groceries go bad because you didn't have a matching recipe plan for them.
                        </p>
                    </div>

                    {/* Card 2: Decision Fatigue */}
                    <div className="bg-secondary-white p-8 rounded-2xl shadow-xl transition duration-500 hover:shadow-primary-mahogany/50 hover:-translate-y-1">
                        <BookOpen className="w-10 h-10 text-primary-mahogany mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">Endless Searching</h3>
                        <p className="text-gray-700">
                            Tired of endlessly scrolling recipe sites trying to find a dish that fits your random on-hand ingredients?
                        </p>
                    </div>

                    {/* Card 3: Budget Strain */}
                    <div className="bg-secondary-white p-8 rounded-2xl shadow-xl transition duration-500 hover:shadow-primary-mahogany/50 hover:-translate-y-1">
                        <Heart className="w-10 h-10 text-primary-mahogany mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold mb-3">Unhealthy Choices</h3>
                        <p className="text-gray-700">
                            When meal planning is hard, fast food becomes easy. We make healthy, home-cooked meals simple.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );

    // --- Solution/Services Section ---
    const SolutionSection = () => (
        <section id="solution" className="bg-secondary-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 text-accent-green">
                    Your Smart Kitchen Solution
                </h2>

                {/* Services Covered */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ServiceCard
                        icon={<Search className="w-10 h-10 text-primary-mahogany" />}
                        title="AI Ingredient Match"
                        description="Our engine uses smart logic to instantly match your exact ingredients to thousands of recipes."
                    />
                    <ServiceCard
                        icon={<ListChecks className="w-10 h-10 text-primary-mahogany" />}
                        title="Custom Dietary Filters"
                        description="Filter results by Keto, Vegan, Gluten-Free, or any allergy. Health goals, met."
                    />
                    <ServiceCard
                        icon={<Users className="w-10 h-10 text-primary-mahogany" />}
                        title="Portion Optimization"
                        description="Scale recipes perfectly for a family of four or a quick meal for one, minimizing leftovers."
                    />
                    <ServiceCard
                        icon={<ChefHat className="w-10 h-10 text-primary-mahogany" />}
                        title="Recipe Rating & Scoring"
                        description="Community-driven ratings and complexity scores ensure you pick a dish you'll actually enjoy making."
                    />
                </div>
            </div>
        </section>
    );

    // Reusable Service Card component
    const ServiceCard = ({ icon, title, description }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-start hover:shadow-xl transition duration-300">
            <div className="p-3 mb-4 rounded-full bg-primary-mahogany/10">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-accent-green mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );


    // --- How To Use Section (Visual Representation) ---
    const HowToUseSection = () => (
        <section id="how-to-use" className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 text-accent-green">
                    How IngreMatch Works in 3 Simple Steps
                </h2>

                <div className="relative flex flex-col items-center">

                    {/* Vertical Timeline/Line (Desktop only) */}
                    <div className="hidden lg:block absolute h-full w-0.5 bg-primary-mahogany/30 left-1/2 transform -translate-x-1/2"></div>

                    {/* Step 1 */}
                    <HowToCard
                        step="1"
                        title="List What You Have"
                        description="Quickly list all the fresh or pantry items you have on hand in our simple form."
                        icon={<ListChecks className="w-8 h-8" />}
                        isLeft={true}
                    />

                    {/* Step 2 */}
                    <HowToCard
                        step="2"
                        title="The Engine Matches"
                        description="The IngreMatch engine instantly scans its database to find recipes using only those items."
                        icon={<Zap className="w-8 h-8" />}
                        isLeft={false}
                    />

                    {/* Step 3 */}
                    <HowToCard
                        step="3"
                        title="Cook Your Perfect Meal"
                        description="Receive your tailored recipe and access a simple, step-by-step guide to cooking with zero waste."
                        icon={<ChefHat className="w-8 h-8" />}
                        isLeft={true}
                    />
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={scrollToLeadCapture}
                        className="inline-flex items-center justify-center bg-accent-green hover:bg-accent-green/80 text-secondary-white font-bold py-3 px-8 text-lg rounded-xl transition duration-300 shadow-md hover:shadow-lg"
                    >
                        Try the Live Match Now
                    </button>
                </div>

            </div>
        </section>
    );

    // Reusable How-To Card component for visual flow
    const HowToCard = ({ step, title, description, icon, isLeft }) => (
        <div className={`relative w-full lg:w-1/2 my-10 flex ${isLeft ? 'lg:pr-12' : 'lg:pl-12 lg:self-end'}`}>
            {/* Circle Icon and Line (Mobile/Left Side) */}
            <div className="flex-shrink-0 flex flex-col items-center mr-6 lg:hidden">
                <div className="w-10 h-10 rounded-full primary-mahogany flex items-center justify-center text-secondary-white font-bold text-xl ring-4 ring-primary-mahogany/30 shadow-md">
                    {step}
                </div>
                {step !== '3' && <div className="h-full w-0.5 bg-primary-mahogany/30 mt-2"></div>}
            </div>

            {/* Card Content */}
            <div className={`bg-white p-6 rounded-2xl shadow-xl border border-primary-mahogany/20 w-full ${isLeft ? 'lg:text-right' : 'lg:text-left'}`}>
                <h3 className="text-2xl font-extrabold text-primary-mahogany mb-2">
                    <span className="lg:hidden mr-2">Step {step}:</span>{title}
                </h3>
                <p className="text-gray-700 text-base">{description}</p>
            </div>

            {/* Desktop Circle Icon (On the main line) */}
            <div className={`hidden lg:flex absolute top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full primary-mahogany items-center justify-center text-secondary-white font-bold text-xl ring-8 ring-secondary-white shadow-xl ${isLeft ? 'right-0 -mr-5' : 'left-0 -ml-5'}`}>
                {step}
            </div>
        </div>
    );

    // --- Proof (Testimonials) Section ---
    const ProofSection = () => (
        <section id="proof" className="accent-green/95 py-20 px-4 sm:px-6 lg:px-8 text-secondary-white">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-secondary-white">What Our Users Say</h2>
                <p className="text-xl opacity-80 max-w-3xl mx-auto mb-12 text-primary-mahogany/80">
                    Real feedback from people turning waste into wonderful meals.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    <TestimonialCard
                        quote="IngreMatch has completely changed my grocery budget. I throw away virtually nothing now. It's truly a smart engine!"
                        author="— Sarah Khan, Home Cook"
                    />
                    <TestimonialCard
                        quote="I used to spend 30 minutes every night figuring out dinner. Now, I have a perfect recipe in 30 seconds. Lifesaver."
                        author="— Sheeza Tariq, Working woman"
                    />
                    <TestimonialCard
                        quote="The matching is uncanny. It paired my leftover kale and sad-looking chicken into a gourmet meal. Highly recommend."
                        author="— Zaidan Ali, Food Blogger"
                    />
                </div>
            </div>
        </section>
    );

    // Reusable Testimonial Card component
    const TestimonialCard = ({ quote, author }) => (
        <div className="bg-secondary-white p-6 rounded-xl shadow-2xl flex flex-col h-full text-text-black hover:bg-gray-100 transition duration-300">
            <p className="text-lg italic mb-4">"{quote}"</p>
            <p className="text-primary-mahogany font-semibold mt-auto">{author}</p>
        </div>
    );

    // --- About Us Section ---
    const AboutUsSection = () => (
        <section id="about" className="bg-secondary-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 text-accent-green">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                    IngreMatch was founded on a simple principle: to eliminate food waste and kitchen stress. We are a team of passionate food-tech enthusiasts who believe that technology should serve your kitchen, not complicate it. By merging smart matching algorithms with culinary expertise, we empower every user to cook more, waste less, and enjoy the process.
                </p>
                <p className="text-xl font-semibold text-primary-mahogany">
                    Eat smart, live sustainably.
                </p>
            </div>
        </section>
    );

    return (
        <>
            <HeroSection />
            <LeadCaptureForm /> {/* The trackable lead generation form */}
            <ProblemSection />
            <SolutionSection />
            <HowToUseSection />
            <ProofSection />
            <AboutUsSection />
        </>
    );
};


const App = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState('landing'); // State for navigation
    const leadCaptureRef = useRef(null);

    // Function to scroll to the form when CTA is clicked
    const scrollToLeadCapture = () => {
        leadCaptureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    // Handles the final lead capture button click (static/mock success)
    const handleLeadCapture = (e) => {
        e.preventDefault();
        // Simulate lead submission success
        setShowModal(true); // Show success modal instead of alert
        // Reset form fields if needed (omitted for brevity)
    };

    // --- Header (Logo, Tagline, and Navigation) ---
    const Header = () => (
        <header className="sticky top-0 z-50 backdrop-blur-sm shadow-md border-b border-gray-200 
                   bg-gradient-to-r from-accent-green via-accent-green/30 to-accent-green">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                {/* Logo and Tagline */}
                <button 
                    onClick={() => setCurrentPage('landing')} 
                    className="flex items-center space-x-2 focus:outline-none"
                    aria-label="Go to Home Page"
                >
                    <ChefHat className="text-primary-mahogany w-8 h-8 md:w-10 md:h-10" />
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl md:text-3xl font-extrabold text-accent-green">
                            Ingre<span className="text-primary-mahogany">Match</span>
                        </span>
                        <span className="text-xs md:text-sm font-medium text-text-black opacity-70 mt-0.5 hidden sm:block">
                            Your Smart Meal Suggestion Engine
                        </span>
                    </div>
                </button>

                {/* Navigation/CTA Buttons */}
                <div className="flex space-x-4">
                    {currentPage === 'landing' && (
                        <button
                            onClick={scrollToLeadCapture}
                            className="hidden sm:inline-flex bg-primary-mahogany hover:bg-accent-green text-secondary-white font-bold py-2.5 px-6 rounded-xl transition duration-300 shadow-lg hover:shadow-2xl ring-2 ring-primary-mahogany/50 focus:outline-none focus:ring-4 focus:ring-primary-mahogany/80 text-sm md:text-base"
                        >
                            Get Recipe Now
                        </button>
                    )}
                    
                    <button
                        onClick={() => setCurrentPage('login')}
                        className="inline-flex items-center bg-primary-white/10 hover:bg-primary-mahogany/10 text-accent-green hover:text-primary-mahogany font-bold py-2.5 px-4 rounded-xl transition duration-300 focus:outline-none focus:ring-4 focus:ring-accent-green/50 text-sm md:text-base"
                    >
                        <LogIn className="w-5 h-5 mr-2" />
                        Login
                    </button>
                </div>
            </div>
        </header>
    );

    // --- Proper Footer ---
    const Footer = () => (
        <footer className="bg-accent-green text-secondary-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
                {/* Column 1: Logo */}
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center mb-3">
                        <ChefHat className="text-primary-mahogany w-8 h-8 mr-2" />
                        <span className="text-2xl font-extrabold text-secondary-white">
                            Ingre<span className="text-primary-mahogany">Match</span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">Smart cooking, zero waste.</p>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold text-primary-mahogany mb-4">Explore</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#problem" className="hover:text-secondary-white transition">The Problem</a></li>
                        <li><a href="#solution" className="hover:text-secondary-white transition">Our Solution</a></li>
                        <li><a href="#how-to-use" className="hover:text-secondary-white transition">How It Works</a></li>
                    </ul>
                </div>

                {/* Column 3: Company */}
                <div>
                    <h4 className="text-lg font-semibold text-primary-mahogany mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#about" className="hover:text-secondary-white transition">About Us</a></li>
                        <li><a href="#" className="hover:text-secondary-white transition">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-secondary-white transition">Privacy Policy</a></li>
                        <li>
                           <button 
                                onClick={() => setCurrentPage('login')} 
                                className="text-secondary-white hover:text-secondary-white transition p-0 m-0 text-sm border-none bg-transparent"
                            >
                                Login
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Contact */}
                <div>
                    <h4 className="text-lg font-semibold text-primary-mahogany mb-4">Contact</h4>
                    <p className="text-sm text-gray-400">ingrematch@gmail.com</p>
                    <p className="text-sm text-gray-400 mt-2">Lahore, Pakistan</p>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} IngreMatch. All rights reserved.
            </div>
        </footer>
    );

    // Modal for successful lead capture confirmation (no alerts!)
    const LeadModal = () => {
        return (
            <div className="fixed inset-0 bg-text-black bg-opacity-70 z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                <div 
                    className="bg-secondary-white p-8 sm:p-10 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CheckCircle className="w-12 h-12 text-accent-green mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-accent-green mb-3">
                        Success! Your Recipe is On Its Way!
                    </h3>
                    <p className="text-gray-700 mb-6">
                        Thank you! Check your email for your custom recipe and details on how to get unlimited access to IngreMatch.
                    </p>
                    <button onClick={() => setShowModal(false)} className="bg-primary-mahogany hover:bg-accent-green text-secondary-white font-bold py-2.5 px-6 rounded-xl transition duration-300">
                        Close
                    </button>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-secondary-white text-text-black font-sans">
            <CustomStyles /> {/* Ensures custom colors are recognized */}
            <Header />
            <main>
                {currentPage === 'landing' ? (
                    <LandingContent 
                        scrollToLeadCapture={scrollToLeadCapture} 
                        leadCaptureRef={leadCaptureRef} 
                        handleLeadCapture={handleLeadCapture}
                        setShowModal={setShowModal}
                    />
                ) : (
                    <LoginPage setCurrentPage={setCurrentPage} />
                )}
            </main>
            <Footer />
            {showModal && <LeadModal />}
        </div>
    );
};

export default App;