import React, { useState } from 'react';
import { UtensilsCrossed, Clock, Heart } from 'lucide-react';

const Preferences = () => {
  const [cuisineType, setCuisineType] = useState('Any Cuisine');
  const [cookingTime, setCookingTime] = useState('Any Time');
  const [foodPreference, setFoodPreference] = useState('No Preference');

  return (
    <div className="mb-8 bg-[#EFEFEF] rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-[#062b18] hover:border-[#BB4500] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#BB4500] to-[#d15000] text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg">3</div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#000000]">Set Your Preferences</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-[#062b18] mb-2">
            <UtensilsCrossed className="w-4 h-4 text-[#062b18]" />
            Cuisine Type
          </label>
          <select
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#062b18] rounded-2xl focus:border-[#BB4500] focus:ring-4 focus:ring-[#BB4500] focus:ring-opacity-20 outline-none transition-all text-[#000000] font-medium bg-white"
          >
            <option>Any Cuisine</option>
            <option>Italian</option>
            <option>Chinese</option>
            <option>Indian</option>
            <option>Mexican</option>
            <option>Japanese</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-[#BB4500] mb-2">
            <Clock className="w-4 h-4 text-[#BB4500]" />
            Cooking Time
          </label>
          <select
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#062b18] rounded-2xl focus:border-[#BB4500] focus:ring-4 focus:ring-[#BB4500] focus:ring-opacity-20 outline-none transition-all text-[#000000] font-medium bg-white"
          >
            <option>Any Time</option>
            <option>Under 15 mins</option>
            <option>15-30 mins</option>
            <option>30-60 mins</option>
            <option>Over 1 hour</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-[#062b18] mb-2">
            <Heart className="w-4 h-4 text-[#062b18]" />
            Food Preference
          </label>
          <select
            value={foodPreference}
            onChange={(e) => setFoodPreference(e.target.value)}
            className="w-full px-4 py-3 border-2 border-[#062b18] rounded-2xl focus:border-[#BB4500] focus:ring-4 focus:ring-[#BB4500] focus:ring-opacity-20 outline-none transition-all text-[#000000] font-medium bg-white"
          >
            <option>No Preference</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>Gluten-Free</option>
            <option>Keto</option>
          </select>
        </div>
      </div>
    </div>
  );4
};

export default Preferences;