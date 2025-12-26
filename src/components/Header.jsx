import React from 'react';
import { ChefHat } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] shadow-2xl overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center">
        <div className="bg-[#EFEFEF] p-3 rounded-xl shadow-lg flex flex-col gap-2 w-auto">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-[#BB4500]" />
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-[#000000]">Ingre</span>
              <span className="text-[#BB4500]">Match</span>
            </h1>
          </div>
          <p className="text-xs text-[#000000] font-medium">
            Your Smart Meal Suggestion Engine
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;