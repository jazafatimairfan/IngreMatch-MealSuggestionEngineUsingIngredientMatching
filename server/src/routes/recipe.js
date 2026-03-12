// routes/recipe.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../config/db');

// ─── 1. SPOONACULAR: Search by ingredients (returns 6) ───────────────────────
router.get('/search', async (req, res) => {
    try {
        const { ingredients } = req.query;
        const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
            params: {
                ingredients: ingredients,
                number: 6,
                apiKey: process.env.SPOONACULAR_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Spoonacular search error:", error.message);
        res.status(500).json({ error: "Failed to fetch recipes from Spoonacular" });
    }
});

// ─── 2. SPOONACULAR: Get full instructions by recipe ID ──────────────────────
router.get('/:id/instructions', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
            params: { apiKey: process.env.SPOONACULAR_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Spoonacular instructions error:", error.message);
        res.status(500).json({ error: "Failed to fetch recipe instructions" });
    }
});

// ─── 3. GROQ AI: Generate 12 recipes with filters ────────────────────────────
router.post('/generate-ai', async (req, res) => {
    console.log("🔑 GROQ KEY LAST 6:", process.env.GROQ_API_KEY?.slice(-6));
    console.log("📦 BODY:", req.body);

    const { ingredients, cuisineType, cookingTime, foodPreference } = req.body;

    if (!ingredients) {
        return res.status(400).json({ error: "Ingredients are required" });
    }

    // ── Build cuisine instruction ─────────────────────────────────────────────
    const cuisineInstruction = (!cuisineType || cuisineType === 'Any Cuisine')
        ? `Every recipe MUST be a traditional Pakistani or Indian desi dish (e.g. biryani, karahi, nihari, haleem, daal, sabzi, qorma, pulao, seekh kebab, etc.)`
        : `Every recipe MUST be a traditional ${cuisineType} dish. Generate authentic ${cuisineType} cuisine ONLY — absolutely no other cuisine types allowed.`;

    // ── Build cooking time instruction ────────────────────────────────────────
    const timeInstruction = (!cookingTime || cookingTime === 'Any Time')
        ? `Cooking time can be anything.`
        : cookingTime === 'Under 15 mins'
        ? `Every recipe MUST be completable in UNDER 15 MINUTES total. Only quick recipes allowed.`
        : cookingTime === '15-30 mins'
        ? `Every recipe MUST take between 15 to 30 MINUTES total cooking time.`
        : cookingTime === '30-60 mins'
        ? `Every recipe MUST take between 30 to 60 MINUTES total cooking time.`
        : `Every recipe MUST take MORE THAN 1 HOUR total cooking time. Slow-cooked dishes preferred.`;

    // ── Build dietary instruction ─────────────────────────────────────────────
    const dietaryInstruction = (!foodPreference || foodPreference === 'No Preference')
        ? `No dietary restrictions.`
        : foodPreference === 'Vegetarian'
        ? `Every recipe MUST be strictly Vegetarian. No meat, chicken, beef, fish or seafood allowed.`
        : foodPreference === 'Vegan'
        ? `Every recipe MUST be strictly Vegan. No meat, dairy, eggs, honey or any animal products allowed.`
        : foodPreference === 'Gluten Free'
        ? `Every recipe MUST be strictly Gluten Free. No wheat, flour, bread, pasta or gluten-containing ingredients allowed.`
        : foodPreference === 'Keto'
        ? `Every recipe MUST be strictly Keto-friendly. High fat, low carb. No rice, bread, sugar, potatoes or high-carb ingredients allowed.`
        : `Every recipe MUST be strictly ${foodPreference}.`;

    const prompt = `You are an expert chef. Your task is to generate exactly 12 recipes.

STRICT RULES — you MUST follow ALL of these without exception:
1. CUISINE: ${cuisineInstruction}
2. INGREDIENTS: Every recipe MUST use these as the MAIN ingredients: ${ingredients}. Also list all other required ingredients with exact amounts.
3. COOKING TIME: ${timeInstruction} Set the cookingTime field accordingly.
4. DIETARY: ${dietaryInstruction} Set the dietary field accordingly.
5. Do NOT violate any of the above rules under any circumstances.

Respond ONLY with a valid JSON array of exactly 12 recipes. No text before or after the JSON array.

[
  {
    "title": "Recipe Name",
    "description": "A short 1-2 sentence description",
    "cuisine": "e.g. Pakistani, Italian, Chinese, Mexican, Japanese, Indian",
    "cookingTime": "e.g. 30 minutes",
    "dietary": "e.g. Vegetarian, Vegan, Gluten Free, Keto, or null",
    "ingredients": [
      "500g chicken",
      "2 cloves garlic"
    ],
    "steps": [
      "Heat oil in a pan.",
      "Add garlic and fry for 1 minute."
    ]
  }
]`;

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                max_tokens: 8000,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                }
            }
        );

        const rawText = response.data?.choices?.[0]?.message?.content;

        if (!rawText) {
            return res.status(500).json({ error: "Groq returned an empty response" });
        }

        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error("❌ Could not find JSON array in Groq response:", rawText.substring(0, 200));
            return res.status(500).json({ error: "Groq response was not valid JSON" });
        }
        const recipes = JSON.parse(jsonMatch[0]);

        res.json(recipes);

    } catch (error) {
        console.error("❌ Groq error STATUS:", error.response?.status);
        console.error("❌ Groq error FULL:", JSON.stringify(error.response?.data, null, 2));
        console.error("❌ Groq error MESSAGE:", error.message);

        res.status(500).json({
            error: "Failed to generate recipes with AI",
            details: error.response?.data || error.message
        });
    }
});

// ─── 4. SAVE a recipe (user marking "I'm making this") ───────────────────────
router.post('/save', async (req, res) => {
    const {
        user_id,
        source,
        external_id,
        title,
        cuisine,
        cooking_time,
        dietary,
        ingredients,
        steps,
        image_url
    } = req.body;

    if (!user_id || !title || !source) {
        return res.status(400).json({ error: "user_id, title and source are required" });
    }

    try {
        // Check if already saved to avoid duplicates
        const existing = await pool.query(
            `SELECT id FROM saved_recipes 
             WHERE user_id = $1 AND title = $2 AND source = $3`,
            [user_id, title, source]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ 
                error: "Already saved",
                id: existing.rows[0].id 
            });
        }

        const result = await pool.query(
            `INSERT INTO saved_recipes 
             (user_id, source, external_id, title, cuisine, cooking_time, dietary, ingredients, steps, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                user_id,
                source,
                external_id || null,
                title,
                cuisine || null,
                cooking_time || null,
                dietary || null,
                ingredients || [],
                steps || [],
                image_url || null
            ]
        );

        console.log(`✅ Recipe saved: "${title}" for user ${user_id}`);
        res.status(201).json({ message: "Recipe saved!", recipe: result.rows[0] });

    } catch (error) {
        console.error("❌ Save recipe error:", error.message);
        res.status(500).json({ error: "Failed to save recipe" });
    }
});

// ─── 5. UNSAVE a recipe ───────────────────────────────────────────────────────
router.delete('/save', async (req, res) => {
    const { user_id, title, source } = req.body;

    if (!user_id || !title || !source) {
        return res.status(400).json({ error: "user_id, title and source are required" });
    }

    try {
        await pool.query(
            `DELETE FROM saved_recipes WHERE user_id = $1 AND title = $2 AND source = $3`,
            [user_id, title, source]
        );
        res.json({ message: "Recipe unsaved!" });
    } catch (error) {
        console.error("❌ Unsave recipe error:", error.message);
        res.status(500).json({ error: "Failed to unsave recipe" });
    }
});

// ─── 6. GET all saved recipes for a user ─────────────────────────────────────
router.get('/saved/:user_id', async (req, res) => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM saved_recipes WHERE user_id = $1 ORDER BY saved_at DESC`,
            [user_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("❌ Get saved recipes error:", error.message);
        res.status(500).json({ error: "Failed to fetch saved recipes" });
    }
});

module.exports = router;