import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ingredients from "./components/Ingredients";
import ImageUpload from "./components/ImageUpload";
import AlternativeIngredients from "./components/AlternativeIngredients";
import Preferences from "./components/Preferences";
import GenerateButton from "./components/GenerateButton";
import Footer from "./components/Footer";

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [alternativeIngredients, setAlternativeIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const popularIngredients = [
    "Chicken", "Rice", "Tomatoes", "Onions", "Garlic", 
    "Pasta", "Beef", "Potatoes", "Cheese", "Eggs"
  ];

  const addIngredient = (item) => {
    const value = item || currentIngredient.trim();
    if (!value || ingredients.includes(value)) return;
    setIngredients([...ingredients, value]);
    setCurrentIngredient("");
  };

  const removeIngredient = (i) =>
    setIngredients(ingredients.filter((_, index) => index !== i));

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF]">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <Ingredients
          ingredients={ingredients}
          currentIngredient={currentIngredient}
          setCurrentIngredient={setCurrentIngredient}
          addIngredient={addIngredient}
          removeIngredient={removeIngredient}
          popularIngredients={popularIngredients}
        />
        <ImageUpload />
        <AlternativeIngredients
          ingredients={ingredients}
          alternativeIngredients={alternativeIngredients}
          setAlternativeIngredients={setAlternativeIngredients}
        />
        <Preferences />
        <GenerateButton
          handleGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>
      <Footer />
    </div>
  );
}