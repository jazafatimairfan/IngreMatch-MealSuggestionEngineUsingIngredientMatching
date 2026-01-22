// src/pages/Dashboard.jsx
import React from 'react';

// Mock data (replace with actual database calls later)
const mockUserStats = {
  totalRecipesGenerated: 145,
  ingredientsSaved: 489,
  favoriteCuisine: 'Italian',
  recipesMadeMost: [
    { name: 'Spicy Tomato Pasta', count: 12 },
    { name: 'Quick Chicken Stir-fry', count: 8 },
    { name: 'Lentil Soup', count: 6 },
  ],
  mostUsedIngredients: [
    { ingredient: 'Tomato', usage: 35 },
    { ingredient: 'Onion', usage: 28 },
    { ingredient: 'Garlic', usage: 22 },
    { ingredient: 'Chicken Breast', usage: 15 },
  ],
  weeklyActivity: [
    { day: 'Mon', recipes: 3, names: ['Breakfast Smoothie', 'Quick Dinner', 'Snack'] }, // <-- Changed name to names (array)
    { day: 'Tue', recipes: 5, names: ['Taco Tuesday Idea', 'Dessert', 'Quick Lunch', 'Bake'] }, // <-- Changed name to names (array)
    { day: 'Wed', recipes: 1, names: ['Dessert'] },
    { day: 'Thu', recipes: 2, names: ['Breakfast Smoothie', 'Protein Shake'] },
    { day: 'Fri', recipes: 4, names: ['Weekend Bake', 'Pizza Night', 'Cocktail'] },
    { day: 'Sat', recipes: 6, names: ['Family Meal', 'Leftovers Lunch', 'Big Breakfast', 'Dessert'] },
    { day: 'Sun', recipes: 2, names: ['Meal Prep', 'Soup'] },
  ],
};

// Custom Colors based on your scheme
const COLORS = {
  Mahogany: '#BB4500', // Primary Accent (Bright Green)
  DarkSlate: '#062b18', // Dark Background/Text (Dark Green/Near Black)
  Silver: '#EFEFEF', // Light Background (Brown/Earth Tone)
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="p-6 bg-[#7aa13e] rounded-xl shadow-lg flex items-center justify-between transition duration-300 hover:shadow-2xl">
    <div>
      <p className="text-sm font-semibold uppercase text-[#121b03]">{title}</p>
      <p className={`text-4xl font-extrabold mt-1`} style={{ color }}>
        {value}
      </p>
    </div>
    <div className={`text-4xl p-3 rounded-full opacity-80`} style={{ backgroundColor: COLORS.Silver, color: color }}>
      {icon}
    </div>
  </div>
);

// Ingredient Usage Chart (Simulated Bar Chart for now)
const IngredientChart = ({ data }) => {
  const totalUsage = data.reduce((sum, item) => sum + item.usage, 0);

  return (
    <div className="p-6 bg-[#182405] rounded-xl shadow-lg h-full">
      <h3 className="text-xl font-bold mb-6 text-[#33752a]">Most Used Ingredients</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = Math.round((item.usage / totalUsage) * 100);
          return (
            <div key={index}>
              <div className="flex justify-between mb-1 text-sm font-medium text-[#000000]">
                <span>{item.ingredient}</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-[#9ccc55] rounded-full h-3">
                {/* Bar using the Mahogany color */}
                <div 
                  className="h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${percentage}%`, backgroundColor: COLORS.Mahogany }}
                  title={`${item.usage} uses`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const Dashboard = () => {
  const { 
    totalRecipesGenerated, 
    ingredientsSaved, 
    favoriteCuisine, 
    recipesMadeMost, 
    mostUsedIngredients, 
    weeklyActivity 
  } = mockUserStats;

  return (
    <div className="min-h-screen pt-16 pb-20" style={{ backgroundColor: COLORS.Silver }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold font-title" style={{ color: COLORS.DarkSlate }}>
             Your Culinary Dashboard
          </h1>
          <p className="mt-2 text-lg text-[#000000]">
            A snapshot of your activity and most loved recipes.
          </p>
        </header>

        {/* 1. KPI Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Recipes Generated" 
            value={totalRecipesGenerated} 
            icon="" 
            color={COLORS.DarkSlate} 
          />
          <StatCard 
            title="Ingredients Used" 
            value={ingredientsSaved} 
            icon="" 
            color={COLORS.DarkSlate} 
          />
          <StatCard 
            title="Favorite Cuisine" 
            value={favoriteCuisine} 
            icon="" 
            color={COLORS.DarkSlate} 
          />
        </section>

        {/* 2. Main Content: Best Recipes and Ingredient Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Recipes Made Most (List Panel) */}
          <div className="lg:col-span-1 p-6 bg-[#7aa13e] rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-[#000000]">
              Top Recipes
            </h3>
            <ul className="space-y-4">
              {recipesMadeMost.map((recipe, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <span className="font-semibold text-[#000000]">{index + 1}. {recipe.name}</span>
                  <span 
                        // FIX 1: Set text color to DarkSlate for visibility
                        className="px-3 py-1 text-sm font-bold rounded-full" 
                        style={{ backgroundColor: COLORS.Mahogany, color: COLORS.DarkSlate }}>
                    {recipe.count} times
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ingredient Usage Chart (Bar Chart Panel) */}
          <div className="lg:col-span-2">
            <IngredientChart data={mostUsedIngredients} />
          </div>
        </div>

        {/* 3. Weekly Activity Timeline - FIX 2: Flow-based design */}
        <section className="p-8 rounded-xl shadow-2xl" style={{ backgroundColor: COLORS.DarkSlate }}>
          <h3 className="text-3xl font-bold mb-8 text-[#D1D3CE] font-title">
            Past Week's Activity
          </h3>
          <div className="flex justify-between items-start space-x-4 overflow-x-auto pb-4 pt-4"> 
            {weeklyActivity.map((dayData, index) => (
              <div key={index} className="flex-shrink-0 w-32 text-center relative">
                
                {/* NEW: Recipe Count Bar - Now a part of the card, eliminates clipping */}
                <div 
                  className="w-full text-center py-1 rounded-t-xl" 
                  style={{ backgroundColor: COLORS.Mahogany, color: COLORS.DarkSlate }} // Use accent color for bar
                >
                  <span className="text-sm font-extrabold uppercase">
                    {dayData.recipes} Recipes
                  </span>
                </div>
                
                {/* Day Card - Starts right after the count bar */}
                <div className="bg-white p-4 shadow-md h-full min-h-[120px] flex flex-col justify-end rounded-b-xl">
                  <p className="text-lg font-bold mt-2" style={{ color: COLORS.DarkSlate }}>{dayData.day}</p>
                  {/* The max number of names to display */}
                    {dayData.names.slice(0, 3).map((name, nameIndex) => (
                        <p key={nameIndex} className="text-xs text-[#000000] italic mt-1 leading-tight">
                            {name}
                        </p>
                    ))}
                    {/* Add an ellipsis if there are more than 3 items */}
                    {dayData.names.length > 3 && (
                        <p className="text-xs text-[#000000] mt-1 italic leading-tight">
                            + {dayData.names.length - 3} more...
                        </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        </section>
        
      </div>
    </div>
  );
};
 
export default Dashboard;