import React from "react";
import { Globe2 } from "lucide-react";

const AlternativeIngredients = ({ 
  ingredients, 
  alternativeIngredients, 
  setAlternativeIngredients 
}) => {
  return (
    <div className="mb-8 bg-[#EFEFEF] rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-[#062b18] hover:border-[#BB4500] transition-all">
      <h3 className="text-xl sm:text-2xl font-black text-[#000000] mb-4 flex items-center gap-2">
        <Globe2 className="w-6 h-6 text-[#BB4500]" /> 
        Alternative Ingredients (Optional)
      </h3>

      {ingredients.length === 0 && (
        <p className="text-sm text-red-600 font-semibold mb-3 bg-red-50 p-3 rounded-xl border border-red-300">
          You have not added any main ingredients. Please provide alternative ingredients so we can suggest recipes.
        </p>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          value={alternativeIngredients}
          onChange={(e) => setAlternativeIngredients(e.target.value)}
          placeholder="e.g., quinoa instead of rice..."
          className="flex-1 px-5 py-4 border-2 border-[#062b18] rounded-2xl focus:border-[#BB4500] focus:ring-4 focus:ring-[#BB4500] focus:ring-opacity-20 outline-none text-[#000000] font-medium placeholder-gray-500 bg-white"
        />
        <button
          type="button"
          onClick={() => setAlternativeIngredients('')}
          className="bg-gradient-to-r from-[#BB4500] to-[#d15000] text-white px-6 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all font-bold cursor-pointer shadow-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AlternativeIngredients;