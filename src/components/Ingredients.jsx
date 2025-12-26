import React from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

const Ingredients = ({
  ingredients,
  currentIngredient,
  setCurrentIngredient,
  addIngredient,
  removeIngredient,
  popularIngredients
}) => {
  const addPopularIngredient = (item) => {
    if (!ingredients.includes(item)) {
      addIngredient(item);
    }
  };

  return (
    <div className="mb-8 bg-[#EFEFEF] rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-[#062b18] hover:border-[#BB4500] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#BB4500] to-[#d15000] text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg">
          1
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#000000]">Add Your Ingredients</h3>
      </div>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
          placeholder="Type an ingredient..."
          className="flex-1 px-5 py-4 border-2 border-[#062b18] rounded-2xl focus:border-[#BB4500] focus:ring-4 focus:ring-[#BB4500] focus:ring-opacity-20 outline-none transition-all text-[#000000] font-medium placeholder-gray-500 bg-white"
        />
        <button
          onClick={() => addIngredient()}
          className="bg-gradient-to-r from-[#BB4500] to-[#d15000] text-white px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg font-bold cursor-pointer"
        >
          <Plus className="w-6 h-6" />
          Add
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="mb-5 p-5 bg-white rounded-2xl border-2 border-[#062b18] shadow-sm">
          <p className="text-sm font-bold text-[#000000] mb-3">Selected Ingredients ({ingredients.length}):</p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="bg-[#062b18] text-[#EFEFEF] px-5 py-2.5 rounded-full flex items-center gap-2 hover:shadow-md hover:scale-105 transition-all">
                <span className="font-bold text-sm">{ingredient}</span>
                <button onClick={() => removeIngredient(index)} className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-5 border-t-2 border-[#062b18]">
        <p className="text-sm text-[#000000] mb-3 font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#BB4500]" />
          Quick add popular ingredients:
        </p>
        <div className="flex flex-wrap gap-2">
          {popularIngredients.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => addPopularIngredient(item)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-[#000000] border-2 border-[#062b18] hover:bg-[#062b18] hover:text-[#EFEFEF] shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ingredients;