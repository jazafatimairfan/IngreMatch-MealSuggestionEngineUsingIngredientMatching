import React from 'react'; // Removed useState since we are using App.jsx state
import { ChefHat, Utensils, Zap, Heart, Search, ListChecks, Users, BookOpen, Send, Instagram, Twitter, Facebook, LogIn } from 'lucide-react';

// --- Reusable Card Components ---
const ServiceCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-start hover:shadow-xl transition duration-300">
        <div className="p-3 mb-4 rounded-full bg-primary-mahogany/10">{icon}</div>
        <h3 className="text-xl font-bold text-accent-green mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

const HowToCard = ({ step, title, description, isLeft }) => (
    <div className={`relative w-full lg:w-1/2 my-10 flex ${isLeft ? 'lg:pr-12' : 'lg:pl-12 lg:self-end'}`}>
        <div className="flex-shrink-0 flex flex-col items-center mr-6 lg:hidden">
            <div className="w-10 h-10 rounded-full primary-mahogany flex items-center justify-center text-secondary-white font-bold text-xl ring-4 ring-primary-mahogany/30 shadow-md">{step}</div>
            {step !== '3' && <div className="h-full w-0.5 bg-primary-mahogany/30 mt-2"></div>}
        </div>
        <div className={`bg-white p-6 rounded-2xl shadow-xl border border-primary-mahogany/20 w-full ${isLeft ? 'lg:text-right' : 'lg:text-left'}`}>
            <h3 className="text-2xl font-extrabold text-primary-mahogany mb-2"><span className="lg:hidden mr-2">Step {step}:</span>{title}</h3>
            <p className="text-gray-700 text-base">{description}</p>
        </div>
        <div className={`hidden lg:flex absolute top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full primary-mahogany items-center justify-center text-secondary-white font-bold text-xl ring-8 ring-secondary-white shadow-xl ${isLeft ? 'right-0 -mr-5' : 'left-0 -ml-5'}`}>{step}</div>
    </div>
);

const TestimonialCard = ({ quote, author }) => (
    <div className="bg-secondary-white p-6 rounded-xl shadow-2xl flex flex-col h-full text-text-black hover:bg-gray-100 transition duration-300">
        <p className="text-lg italic mb-4">"{quote}"</p>
        <p className="text-primary-mahogany font-semibold mt-auto">{author}</p>
    </div>
);

// --- Main Page Component ---
// ADDED setCurrentPage and currentPage to the props list below
const LandingPage = ({ scrollToLeadCapture, leadCaptureRef, handleLeadCapture, setCurrentPage, currentPage }) => {

    return (
        <>
            {/* --- Updated Header Section --- */}
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
                        <div className="flex flex-col leading-none text-left">
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
                        {/* Get Recipe Now button shows on landing */}
                        <button
                            onClick={scrollToLeadCapture}
                            className="hidden sm:inline-flex bg-primary-mahogany hover:bg-accent-green text-secondary-white font-bold py-2.5 px-6 rounded-xl transition duration-300 shadow-lg hover:shadow-2xl ring-2 ring-primary-mahogany/50 focus:outline-none focus:ring-4 focus:ring-primary-mahogany/80 text-sm md:text-base"
                        >
                            Get Recipe Now
                        </button>
                        
                        <button
                            onClick={() => setCurrentPage('login')}
                            className="inline-flex items-center bg-white/10 hover:bg-primary-mahogany/10 text-accent-green hover:text-primary-mahogany font-bold py-2.5 px-4 rounded-xl transition duration-300 focus:outline-none focus:ring-4 focus:ring-accent-green/50 text-sm md:text-base"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            Login
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-secondary-white py-16 sm:py-24 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-accent-green mb-6 leading-tight">
                        Don't Waste Ingredients. <span className="text-primary-mahogany">Dine Smart.</span>
                    </h1>
                    <p className="text-xl text-text-black mb-10 max-w-2xl mx-auto opacity-80">
                        Turn your current refrigerator contents into delicious, personalized recipes instantly.
                    </p>
                    <button
                        onClick={scrollToLeadCapture}
                        className="inline-flex items-center justify-center bg-primary-mahogany hover:bg-primary-mahogany/80 text-secondary-white font-bold py-4 px-10 text-lg rounded-2xl transition duration-300 shadow-[0_10px_20px_rgba(187,69,0,0.5)] transform hover:scale-105"
                    >
                        <Zap className="w-6 h-6 mr-3" /> Unlock Your Free Recipe Match!
                    </button>
                </div>
            </section>

            {/* Lead Capture Section */}
            <section ref={leadCaptureRef} id="lead-capture" className="bg-gray-100 py-20 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-accent-green mb-4">Find Your Perfect Recipe Match</h2>
                    <div className="bg-secondary-white p-8 rounded-2xl shadow-2xl border border-primary-mahogany/30">
                        <form onSubmit={handleLeadCapture}>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-left text-sm font-medium mb-1">1. List Your Key Ingredients</label>
                                    <input type="text" placeholder="Chicken, potatoes, spinach" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-green outline-none" />
                                </div>
                                <div>
                                    <label className="block text-left text-sm font-medium mb-1">2. Your Email Address</label>
                                    <input type="email" placeholder="you@example.com" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-green outline-none" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-accent-green text-secondary-white font-bold py-4 rounded-xl hover:bg-primary-mahogany transition duration-300">
                                <Send className="w-6 h-6 mr-3 inline" /> Generate & Get My Recipe!
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="bg-accent-green text-secondary-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-16 text-primary-mahogany">The Problem We Solve</h2>
                    <p className="text-xl opacity-80 max-w-3xl mx-auto mb-16">
                        Food waste and decision fatigue in the kitchen are costly, both for your wallet and the planet.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8 text-text-black">
                        <div className="bg-secondary-white p-8 rounded-2xl shadow-xl transition hover:-translate-y-1">
                            <Utensils className="w-10 h-10 text-primary-mahogany mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-3">Ingredient Graveyard</h3>
                            <p className="text-gray-700">Up to 25% of purchased groceries go bad because you didn't have a matching recipe plan for them.</p>
                        </div>
                        <div className="bg-secondary-white p-8 rounded-2xl shadow-xl transition hover:-translate-y-1">
                            <BookOpen className="w-10 h-10 text-primary-mahogany mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-3">Endless Searching</h3>
                            <p className="text-gray-700">Stop scrolling and start cooking! Tired of endlessly scrolling recipe sites trying to find a dish that fits your random ingredients?</p>
                        </div>
                        <div className="bg-secondary-white p-8 rounded-2xl shadow-xl transition hover:-translate-y-1">
                            <Heart className="w-10 h-10 text-primary-mahogany mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-3">Unhealthy Choices</h3>
                            <p className="text-gray-700">When meal planning is hard, fast food becomes easy. We make healthy, home-cooked meals simple.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section id="solution" className="bg-secondary-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-accent-green">Your Smart Kitchen Solution</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ServiceCard icon={<Search className="w-10 h-10 text-primary-mahogany" />} title="AI Ingredient Match" description="Our engine uses smart logic to instantly match your exact ingredients to thousands of recipes." />
                        <ServiceCard icon={<ListChecks className="w-10 h-10 text-primary-mahogany" />} title="Custom Dietary Filters" description="Filter results by Keto, Vegan, Gluten-Free, or any allergy. Health goals, met." />
                        <ServiceCard icon={<Users className="w-10 h-10 text-primary-mahogany" />} title="Portion Optimization" description="Scale recipes perfectly for a family of four or a quick meal for one, minimizing leftovers." />
                        <ServiceCard icon={<ChefHat className="w-10 h-10 text-primary-mahogany" />} title="Recipe Rating & Scoring" description="Community-driven ratings and complexity scores ensure you pick a dish you'll actually enjoy making." />
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="bg-accent-green text-secondary-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-4 text-primary-mahogany">Our Mission</h2>
                    <p className="text-lg text-white text-opacity-75 mb-6">
                        IngreMatch was founded on a simple principle: to eliminate food waste and kitchen stress. We are a team of passionate food-tech enthusiasts who believe that technology should serve your kitchen, not complicate it.
                    </p>
                    <p className="text-xl font-semibold text-primary-mahogany">Eat smart, live sustainably.</p>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-secondary-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative">
                    <h2 className="text-4xl font-extrabold text-center text-accent-green mb-16">How IngreMatch Works in 3 Simple Steps</h2>
                    <div className="hidden lg:block absolute left-1/2 top-32 bottom-20 w-1 bg-gradient-to-b from-primary-mahogany to-accent-green transform -translate-x-1/2 opacity-20"></div>
                    <div className="flex flex-col relative">
                        <HowToCard step="1" title="Input Ingredients" description="Enter the items you already have in your pantry or fridge." isLeft={true} />
                        <HowToCard step="2" title="AI Magic Happens" description="Our smart engine analyzes thousands of recipes to find your best matches." isLeft={false} />
                        <HowToCard step="3" title="Cook & Enjoy" description="Follow simple, step-by-step instructions and enjoy your zero-waste meal!" isLeft={true} />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-accent-green mb-4">What Our Cooks Say</h2>
                    <p className="text-gray-600 mb-16 text-lg">Real feedback from people turning waste into wonderful meals.</p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard quote="IngreMatch saved my Friday night! I had random veggies and no plan." author="- Sarah J." />
                        <TestimonialCard quote="As a student, I hate wasting food. This app helps me use every last bit of my groceries." author="- Mark T." />
                        <TestimonialCard quote="The dietary filters are a lifesaver. Finding vegan recipes with exactly what's in my fridge has never been easier." author="- Elena R." />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-accent-green text-secondary-white py-12 px-4 border-t-4 border-primary-mahogany">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-8 md:mb-0 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                            <ChefHat className="text-primary-mahogany w-8 h-8" />
                            <span className="text-2xl font-extrabold">IngreMatch</span>
                        </div>
                        <p className="text-sm opacity-70 max-w-xs">Connecting your kitchen to creativity. Zero waste, infinite flavor.</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-primary-mahogany transition duration-300"><Instagram /></a>
                        <a href="#" className="hover:text-primary-mahogany transition duration-300"><Twitter /></a>
                        <a href="#" className="hover:text-primary-mahogany transition duration-300"><Facebook /></a>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-secondary-white/10 text-center text-sm opacity-50">
                    © 2024 IngreMatch. All rights reserved.
                </div>
            </footer>
        </>
    );
};

export default LandingPage;