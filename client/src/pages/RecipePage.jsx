import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Ingredients from "../components/Ingredients";
import ImageUpload from "../components/ImageUpload";
import AlternativeIngredients from "../components/AlternativeIngredients";
import Preferences from "../components/Preferences";
import GenerateButton from "../components/GenerateButton";
import { Sparkles, ChefHat, Star } from "lucide-react";

// ─── Async: fetch image from TheMealDB trying ALL words in title ─────────────
const fetchMealImage = async (title) => {
  const genericWords = ['chicken', 'beef', 'lamb', 'mutton', 'fish', 'prawn',
    'with', 'and', 'the', 'spicy', 'crispy', 'dum', 'special', 'homemade'];
  const words = title.toLowerCase().split(' ').filter(w => w.length > 2);
  const orderedWords = [
    ...words.filter(w => !genericWords.includes(w)),
    ...words.filter(w => genericWords.includes(w)),
  ];
  for (const keyword of orderedWords) {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      if (data?.meals?.[0]?.strMealThumb) return data.meals[0].strMealThumb;
    } catch { continue; }
  }
  return `https://placehold.co/400x300/BB4500/white?text=${encodeURIComponent(title)}`;
};

export default function RecipePage() {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [alternativeIngredients, setAlternativeIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState("");

  const [cuisineType, setCuisineType] = useState("Any Cuisine");
  const [cookingTime, setCookingTime] = useState("Any Time");
  const [foodPreference, setFoodPreference] = useState("No Preference");

  const [spoonacularRecipes, setSpoonacularRecipes] = useState([]);
  const [aiRecipes, setAiRecipes] = useState([]);
  const [aiImages, setAiImages] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // ─── Saved recipe titles (for star state) ────────────────────────────────
  const [savedTitles, setSavedTitles] = useState(new Set());
  const [savingTitles, setSavingTitles] = useState(new Set()); // loading state per card

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.user_id;

  const popularIngredients = [
    "Chicken", "Rice", "Tomatoes", "Onions", "Garlic",
    "Pasta", "Beef", "Potatoes", "Cheese", "Eggs"
  ];

  // ─── Fetch TheMealDB images after AI recipes load ─────────────────────────
  useEffect(() => {
    if (aiRecipes.length === 0) return;
    setAiImages({});
    aiRecipes.forEach(async (recipe, index) => {
      const imageUrl = await fetchMealImage(recipe.title);
      setAiImages(prev => ({ ...prev, [index]: imageUrl }));
    });
  }, [aiRecipes]);

  const addIngredient = (item) => {
    const value = item || currentIngredient.trim();
    if (!value || ingredients.includes(value)) return;
    setIngredients([...ingredients, value]);
    setCurrentIngredient("");
  };

  const removeIngredient = (i) =>
    setIngredients(ingredients.filter((_, index) => index !== i));

  // ─── MAIN GENERATE ──────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (ingredients.length === 0) return alert("Please add at least one ingredient!");

    setIsGenerating(true);
    setSpoonacularRecipes([]);
    setAiRecipes([]);
    setAiImages({});
    setSavedTitles(new Set());

    const ingredientList = ingredients.join(",");
    const allIngredients = alternativeIngredients
      ? `${ingredientList}, ${alternativeIngredients}`
      : ingredientList;

    try {
      setLoadingPhase("spoonacular");

      const [spoonacularResult, aiResult] = await Promise.allSettled([
        fetch(`http://localhost:5000/api/recipes/search?ingredients=${ingredientList}`)
          .then((r) => r.json()),
        (async () => {
          setLoadingPhase("ai");
          const response = await fetch("http://localhost:5000/api/recipes/generate-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredients: allIngredients, cuisineType, cookingTime, foodPreference }),
          });
          return response.json();
        })(),
      ]);

      if (spoonacularResult.status === "fulfilled") {
        setSpoonacularRecipes(spoonacularResult.value || []);
      }
      if (aiResult.status === "fulfilled" && Array.isArray(aiResult.value)) {
        setAiRecipes(aiResult.value);
      } else {
        console.error("AI generation failed:", aiResult.reason || aiResult.value);
      }

    } catch (error) {
      console.error("Generate error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
      setLoadingPhase("");
    }
  };

  // ─── FETCH SPOONACULAR INSTRUCTIONS ─────────────────────────────────────────
  const fetchInstructions = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}/instructions`);
      const data = await response.json();
      setSelectedRecipe({ ...data, source: "spoonacular" });
    } catch (error) {
      console.error("Instructions error:", error);
    }
  };

  // ─── SAVE / UNSAVE recipe ────────────────────────────────────────────────────
  const handleSave = async (recipe, source, imageUrl = null) => {
    if (!userId) return alert("Please log in to save recipes!");

    const title = recipe.title;
    const isAlreadySaved = savedTitles.has(title);

    // Optimistic UI update
    setSavingTitles(prev => new Set(prev).add(title));

    try {
      if (isAlreadySaved) {
        // UNSAVE
        await fetch("http://localhost:5000/api/recipes/save", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, title, source }),
        });
        setSavedTitles(prev => {
          const next = new Set(prev);
          next.delete(title);
          return next;
        });
      } else {
        // SAVE
        // Build ingredients and steps depending on source
        let ingredientsList = [];
        let stepsList = [];
        let externalId = null;
        let cuisine = recipe.cuisine || null;
        let cookingTimeVal = recipe.cookingTime || null;
        let dietaryVal = recipe.dietary || null;

        if (source === "ai") {
          ingredientsList = recipe.ingredients || [];
          stepsList = recipe.steps || [];
        } else {
          // Spoonacular — fetch full instructions first
          try {
            const res = await fetch(`http://localhost:5000/api/recipes/${recipe.id}/instructions`);
            const data = await res.json();
            externalId = String(recipe.id);
            cuisine = data.cuisines?.[0] || null;
            cookingTimeVal = data.readyInMinutes ? `${data.readyInMinutes} minutes` : null;
            dietaryVal = [
              data.vegetarian && "Vegetarian",
              data.vegan && "Vegan",
              data.glutenFree && "Gluten Free",
            ].filter(Boolean).join(", ") || null;
            ingredientsList = data.extendedIngredients?.map(i => i.original) || [];
            stepsList = data.analyzedInstructions?.[0]?.steps?.map(s => s.step) || [];
          } catch (e) {
            console.error("Could not fetch Spoonacular details:", e);
          }
        }

        await fetch("http://localhost:5000/api/recipes/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            source,
            external_id: externalId,
            title,
            cuisine,
            cooking_time: cookingTimeVal,
            dietary: dietaryVal,
            ingredients: ingredientsList,
            steps: stepsList,
            image_url: imageUrl || recipe.image || null,
          }),
        });

        setSavedTitles(prev => new Set(prev).add(title));
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Could not save recipe. Try again.");
    } finally {
      setSavingTitles(prev => {
        const next = new Set(prev);
        next.delete(title);
        return next;
      });
    }
  };

  // ─── Star button component ────────────────────────────────────────────────
  const StarButton = ({ recipe, source, imageUrl }) => {
    const isSaved = savedTitles.has(recipe.title);
    const isSaving = savingTitles.has(recipe.title);
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSave(recipe, source, imageUrl);
        }}
        disabled={isSaving}
        title={isSaved ? "Remove from saved" : "Save this recipe"}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-full shadow-md transition-all
          ${isSaved
            ? "bg-yellow-400 text-white"
            : "bg-white/90 text-gray-400 hover:text-yellow-400"
          } ${isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <Star className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} />
      </button>
    );
  };

  const hasResults = spoonacularRecipes.length > 0 || aiRecipes.length > 0;

  return (
    <div className="w-screen min-h-screen bg-[#EFEFEF] grid place-items-center overflow-x-hidden">
      <div className="w-full max-w-5xl px-4 sm:px-10 pb-12 flex flex-col">
        <Hero />

        <div className="w-full">
          <Ingredients
            ingredients={ingredients}
            currentIngredient={currentIngredient}
            setCurrentIngredient={setCurrentIngredient}
            addIngredient={addIngredient}
            removeIngredient={removeIngredient}
            popularIngredients={popularIngredients}
          />
        </div>

        <div className="w-full mt-4"><ImageUpload /></div>

        <div className="w-full mt-4">
          <AlternativeIngredients
            ingredients={ingredients}
            alternativeIngredients={alternativeIngredients}
            setAlternativeIngredients={setAlternativeIngredients}
          />
        </div>

        <div className="w-full mt-4">
          <Preferences
            cuisineType={cuisineType} setCuisineType={setCuisineType}
            cookingTime={cookingTime} setCookingTime={setCookingTime}
            foodPreference={foodPreference} setFoodPreference={setFoodPreference}
          />
        </div>

        <div className="w-full flex justify-center mt-8">
          <GenerateButton
            handleGenerate={handleGenerate}
            isGenerating={isGenerating}
            loadingPhase={loadingPhase}
          />
        </div>

        {/* ── RESULTS ───────────────────────────────────────────────────────── */}
        {hasResults && (
          <div className="mt-12 w-full space-y-12">

            {/* ── AI RECIPES ── */}
            {aiRecipes.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-[#BB4500]" />
                  <h2 className="text-2xl font-black text-[#062b18]">AI Generated Desi Recipes</h2>
                  <span className="bg-[#BB4500] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Groq AI • {aiRecipes.length} recipes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiRecipes.map((recipe, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-md border-2 border-[#BB4500]/20 hover:border-[#BB4500] transition-all flex flex-col overflow-hidden"
                    >
                      <div className="w-full h-44 bg-gray-200 overflow-hidden relative">
                        {/* ⭐ Star button */}
                        <StarButton
                          recipe={recipe}
                          source="ai"
                          imageUrl={aiImages[index]}
                        />
                        {!aiImages[index] ? (
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                        ) : (
                          <img
                            src={aiImages[index]}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/400x300/BB4500/white?text=${encodeURIComponent(recipe.title)}`;
                            }}
                          />
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-black text-[#062b18] text-base mb-2">{recipe.title}</h3>
                        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{recipe.description}</p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {recipe.cookingTime && (
                            <span className="bg-[#062b18]/10 text-[#062b18] text-xs font-bold px-2 py-0.5 rounded-full">
                              ⏱ {recipe.cookingTime}
                            </span>
                          )}
                          {recipe.cuisine && (
                            <span className="bg-[#BB4500]/10 text-[#BB4500] text-xs font-bold px-2 py-0.5 rounded-full">
                              🍽 {recipe.cuisine}
                            </span>
                          )}
                          {recipe.dietary && recipe.dietary !== "null" && (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                              ✅ {recipe.dietary}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedRecipe({ ...recipe, source: "ai", image: aiImages[index] })}
                          className="mt-auto bg-[#BB4500] text-white py-2 rounded-xl font-bold hover:bg-[#062b18] transition text-sm"
                        >
                          View Recipe
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SPOONACULAR RECIPES ── */}
            {spoonacularRecipes.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <ChefHat className="w-6 h-6 text-[#062b18]" />
                  <h2 className="text-2xl font-black text-[#062b18]">Matching Recipes</h2>
                  <span className="bg-[#062b18] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Spoonacular • {spoonacularRecipes.length} recipes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spoonacularRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 flex flex-col"
                    >
                      <div className="relative rounded-xl overflow-hidden mb-4">
                        {/* ⭐ Star button */}
                        <StarButton
                          recipe={recipe}
                          source="spoonacular"
                          imageUrl={recipe.image}
                        />
                        <img
                          src={recipe.image}
                          className="w-full h-40 object-cover"
                          alt={recipe.title}
                        />
                      </div>
                      <h3 className="font-bold text-[#062b18] mb-4 flex-grow">{recipe.title}</h3>
                      <button
                        onClick={() => fetchInstructions(recipe.id)}
                        className="bg-[#BB4500] text-white py-2 rounded-lg font-bold hover:bg-[#062b18] transition"
                      >
                        View Recipe
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MODAL ─────────────────────────────────────────────────────────── */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-black transition"
              >✕</button>

              <div className="mb-3">
                {selectedRecipe.source === "ai" ? (
                  <span className="bg-[#BB4500] text-white text-xs font-bold px-3 py-1 rounded-full">✨ Groq AI Recipe</span>
                ) : (
                  <span className="bg-[#062b18] text-white text-xs font-bold px-3 py-1 rounded-full">🍴 Spoonacular Recipe</span>
                )}
              </div>

              <h2 className="text-2xl font-bold text-[#BB4500] mb-4">{selectedRecipe.title}</h2>

              <img
                src={selectedRecipe.image || `https://placehold.co/600x300/BB4500/white?text=${encodeURIComponent(selectedRecipe.title)}`}
                className="w-full rounded-2xl mb-6 h-64 object-cover"
                alt={selectedRecipe.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x300/BB4500/white?text=${encodeURIComponent(selectedRecipe.title)}`;
                }}
              />

              {/* AI Recipe */}
              {selectedRecipe.source === "ai" && (
                <div className="space-y-5 text-left">
                  {selectedRecipe.description && (
                    <p className="text-gray-600 italic">{selectedRecipe.description}</p>
                  )}
                  {selectedRecipe.ingredients?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-lg border-b pb-2 mb-3">Ingredients:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedRecipe.ingredients.map((ing, i) => (
                          <li key={i} className="text-gray-700">{ing}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedRecipe.steps?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-lg border-b pb-2 mb-3">Preparation Steps:</h4>
                      {selectedRecipe.steps.map((step, i) => (
                        <p key={i} className="text-gray-700 mb-2">
                          <span className="font-bold text-[#BB4500] mr-2">{i + 1}.</span>{step}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Spoonacular Recipe */}
              {selectedRecipe.source === "spoonacular" && (
                <div className="space-y-4 text-left">
                  <h4 className="font-bold text-lg border-b pb-2">Preparation Steps:</h4>
                  {selectedRecipe.analyzedInstructions?.[0]?.steps.map((step) => (
                    <p key={step.number} className="text-gray-700">
                      <span className="font-bold text-[#BB4500] mr-2">{step.number}.</span>{step.step}
                    </p>
                  )) || <p className="text-gray-500">Instructions coming soon!</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}