import React from "react";
import { ChefHat, Sparkles, Loader2 } from "lucide-react";

const GenerateButton = ({ handleGenerate, isGenerating, loadingPhase }) => {
  const getLoadingText = () => {
    if (loadingPhase === "spoonacular") return "Searching recipes...";
    if (loadingPhase === "ai") return "AI is cooking up a recipe...";
    return "Generating Your Perfect Meal...";
  };

  return (
    <div className="animate-fade-in mb-12 w-full">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="cursor-pointer relative w-full bg-gradient-to-r from-[#BB4500] via-[#d15000] to-[#BB4500] text-white py-6 rounded-3xl font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="flex items-center justify-center gap-3">
          {isGenerating ? (
            <>
              <Loader2 className="w-7 h-7 animate-spin" />
              {getLoadingText()}
            </>
          ) : (
            <>
              <ChefHat className="w-7 h-7" />
              Get Recipe Now
              <Sparkles className="w-7 h-7" />
            </>
          )}
        </div>
        {isGenerating && (
          <p className="text-sm font-normal opacity-80 mt-1">
            Fetching from Spoonacular + generating with Gemini AI...
          </p>
        )}
      </button>
    </div>
  );
};

export default GenerateButton;
