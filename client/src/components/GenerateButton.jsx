import React from "react";
import { ChefHat, Sparkles } from "lucide-react";

const GenerateButton = ({ handleGenerate, isGenerating }) => {
  return (
    <div className="animate-fade-in mb-12">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="cursor-pointer relative w-full bg-gradient-to-r from-[#BB4500] via-[#d15000] to-[#BB4500] text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
      >
        <div className="flex items-center justify-center gap-3">
          {isGenerating ? (
            <>
              <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Your Perfect Meal...
            </>
          ) : (
            <>
              <ChefHat className="w-7 h-7" />
              Get Recipe Now
              <Sparkles className="w-7 h-7" />
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default GenerateButton;