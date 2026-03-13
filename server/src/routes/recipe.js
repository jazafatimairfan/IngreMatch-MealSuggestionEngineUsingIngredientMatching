// routes/recipe.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../config/db');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Helper: call Groq safely with retry ─────────────────────────────────────
const callGroq = async (prompt, maxTokens = 8000, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            if (attempt > 0) await delay(2000 * attempt);
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    model: "llama-3.1-8b-instant",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                    max_tokens: maxTokens,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                    }
                }
            );
            const rawText = response.data?.choices?.[0]?.message?.content;
            const jsonMatch = rawText?.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error("No JSON array in response");
            return JSON.parse(jsonMatch[0]);
        } catch (err) {
            console.error(`❌ Groq attempt ${attempt + 1} failed:`, err.message);
            if (attempt === retries) return null;
        }
    }
    return null;
};

// ─── Helper: enrich a single batch of Spoonacular recipes ────────────────────
const enrichBatch = async (batch, startIndex, cuisineHint = null) => {
    const recipeList = batch.map((r, i) =>
        `${startIndex + i + 1}. "${r.title}"`
    ).join('\n');

    const cuisineNote = cuisineHint
        ? `These recipes are ${cuisineHint} cuisine — set cuisine field to "${cuisineHint}" for all.`
        : `Detect the most likely cuisine type for each recipe.`;

    const prompt = `You are a professional culinary expert. Enrich each numbered recipe below with complete detailed information.

Recipes:
${recipeList}

${cuisineNote}

For EACH recipe generate:

1. DESCRIPTION: 1-2 clear sentences about the dish.
2. CUISINE: Specific cuisine (Italian, Mexican, American, Pakistani, Indian, Chinese, French, Japanese, etc.)
3. COOKING TIME: Realistic time e.g. "25 minutes"
4. DIETARY: Vegetarian / Vegan / Gluten Free / Keto / or null
5. INGREDIENTS: 8-12 ingredients, each with EXACT quantity and unit.
   GOOD: "300g boneless chicken", "2 tablespoons olive oil", "1 teaspoon black pepper"
   BAD: "chicken", "oil", "pepper"
6. STEPS: 6-8 detailed step-by-step instructions. Each step must be a full sentence.
   GOOD: "Heat 2 tablespoons olive oil in a pan over medium heat for 1 minute."
   BAD: "Heat oil."

RECIPE NAME RULE: Keep titles short — 2 to 4 words only. No adjectives like Delicious, Homemade, Traditional.

CRITICAL: Respond ONLY with a valid JSON array of exactly ${batch.length} objects. No text before or after.

[
  {
    "index": ${startIndex + 1},
    "description": "Clear 1-2 sentence description.",
    "cuisine": "Cuisine name",
    "cookingTime": "25 minutes",
    "dietary": null,
    "ingredients": ["300g chicken breast", "2 tbsp olive oil", "1 tsp salt"],
    "steps": ["Heat oil in pan over medium heat for 1 minute.", "Add chicken and cook 5-7 minutes until golden."]
  }
]`;

    const result = await callGroq(prompt, 8000);
    return result || [];
};

// ─── Helper: enrich all Spoonacular recipes in batches of 5 ──────────────────
const enrichSpoonacularWithGroq = async (spoonacularRecipes, cuisineType, cookingTime, foodPreference) => {
    if (!spoonacularRecipes || spoonacularRecipes.length === 0) return [];

    const cuisineHint = (cuisineType && cuisineType !== 'Any Cuisine') ? cuisineType : null;

    const BATCH_SIZE = 5;
    const allEnriched = [];

    for (let i = 0; i < spoonacularRecipes.length; i += BATCH_SIZE) {
        const batch = spoonacularRecipes.slice(i, i + BATCH_SIZE);
        if (i > 0) await delay(500);

        let enriched = await enrichBatch(batch, i, cuisineHint);

        if (!enriched || enriched.length === 0) {
            console.log(`🔄 Retrying batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
            await delay(2000);
            enriched = await enrichBatch(batch, i, cuisineHint);
        }

        if (enriched && enriched.length > 0) {
            allEnriched.push(...enriched);
            console.log(`✅ Enriched batch ${Math.floor(i / BATCH_SIZE) + 1} (recipes ${i + 1}-${i + batch.length})`);
        } else {
            console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed after retry — filling with empty`);
            batch.forEach((_, j) => allEnriched.push({ index: i + j + 1 }));
        }
    }

    return spoonacularRecipes.map((recipe, i) => {
        const extra = allEnriched.find(e => e.index === i + 1) || {};
        return {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            source: 'spoonacular',
            description: extra.description || '',
            cuisine: extra.cuisine || cuisineHint || '',
            cookingTime: extra.cookingTime || '',
            dietary: extra.dietary || null,
            ingredients: extra.ingredients || [],
            steps: extra.steps || [],
        };
    });
};

// ─── 1. SPOONACULAR: Search + Enrich with Groq ───────────────────────────────
router.get('/search', async (req, res) => {
    try {
        const { ingredients, cuisineType, cookingTime, foodPreference } = req.query;

        // Build Spoonacular optional filter params
        const spoonacularParams = {
            ingredients: ingredients,
            number: 50,
            apiKey: process.env.SPOONACULAR_API_KEY
        };

        // Map cuisine filter to Spoonacular cuisine param
        const cuisineMap = {
            'American': 'American',
            'Chinese': 'Chinese',
            'Filipino': 'Filipino',
            'French': 'French',
            'Indonesian': 'Indonesian',
            'Italian': 'Italian',
            'Japanese': 'Japanese',
            'Mexican': 'Mexican',
            'Pakistani / Indian': 'Indian',
            'Polish': 'Eastern European',
            'Taiwanese': 'Chinese',
        };
        if (cuisineType && cuisineType !== 'Any Cuisine' && cuisineMap[cuisineType]) {
            spoonacularParams.cuisine = cuisineMap[cuisineType];
        }

        // Map dietary filter to Spoonacular diet param
        const dietMap = {
            'Vegetarian': 'vegetarian',
            'Vegan': 'vegan',
            'Gluten-Free': 'gluten free',
            'Keto': 'ketogenic',
        };
        if (foodPreference && foodPreference !== 'No Preference' && dietMap[foodPreference]) {
            spoonacularParams.diet = dietMap[foodPreference];
        }

        // Use complexSearch endpoint when filters are needed, otherwise findByIngredients
        let raw = [];
        if (spoonacularParams.cuisine || spoonacularParams.diet) {
            const filterResponse = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
                params: {
                    includeIngredients: ingredients,
                    cuisine: spoonacularParams.cuisine || undefined,
                    diet: spoonacularParams.diet || undefined,
                    number: 50,
                    addRecipeInformation: false,
                    apiKey: process.env.SPOONACULAR_API_KEY
                }
            });
            // complexSearch returns { results: [...] }
            raw = (filterResponse.data?.results || []).map(r => ({
                id: r.id,
                title: r.title,
                image: r.image || `https://spoonacular.com/recipeImages/${r.id}-312x231.jpg`
            }));
        } else {
            const basicResponse = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
                params: spoonacularParams
            });
            raw = basicResponse.data || [];
        }

        console.log(`🍴 Spoonacular returned ${raw.length} recipes — enriching with Groq...`);
        const enriched = await enrichSpoonacularWithGroq(raw, cuisineType, cookingTime, foodPreference);
        console.log(`✅ Enrichment done — ${enriched.length} Spoonacular recipes ready`);

        res.json(enriched);
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

// ─── Helper: generate one batch of 25 AI recipes ─────────────────────────────
const generateAIBatch = async (ingredients, cuisineInstruction, timeInstruction, dietaryInstruction, batchNum) => {

    const isDefaultCuisine = cuisineInstruction.includes('Pakistani or Indian desi dish');

    const cuisineRule = isDefaultCuisine
        ? `CUISINE: No cuisine filter selected. Generate recipes from ANY cuisine that naturally fits the ingredients. After deciding the recipe, assign its correct cuisine label (Pakistani, Italian, Mexican, Japanese, Indian, American, Chinese, French, etc.). Do NOT force desi cuisine — only use it if the ingredients genuinely suit it.`
        : `CUISINE: ${cuisineInstruction} Every recipe must strictly belong to this cuisine only. No mixing.`;

    const prompt = `You are a professional ingredient-based recipe generator. Generate exactly 25 recipes. Batch ${batchNum} of 2 — make this batch DIFFERENT dishes from batch 1.

════════════════════════════════════
STEP 1 — CHECK PREFERENCES FIRST
════════════════════════════════════
Before generating anything, apply these filters to EVERY recipe:
- ${cuisineRule}
- TIME: ${timeInstruction}
- DIETARY: ${dietaryInstruction}

════════════════════════════════════
STEP 2 — USE THE INGREDIENTS
════════════════════════════════════
User ingredients: ${ingredients}

Every recipe MUST use ALL of these ingredients: ${ingredients}
These are MANDATORY and must appear in every ingredient list.
You must add all the supporting ingredients in as much detail as you can. the detailed the better but must be in points (oil, salt, spices, water, etc.)

CORRECT: User enters "chicken, bread, egg" → Chicken Sandwich ✅, Egg Chicken Toast ✅, Chicken Bread Roll ✅
WRONG: User enters "chicken, bread, egg" → Mango Lassi ❌, Vegetable Biryani ❌, Plain Pasta ❌

Do NOT mix cuisines within one recipe. Each recipe = one real complete dish from one cuisine.

════════════════════════════════════
STEP 3 — OUTPUT QUALITY RULES
════════════════════════════════════
RECIPE NAMES: Short and simple — 2 to 5 words maximum.
  GOOD: "Chicken Bread Roll", "Spicy Chicken Pasta"
  BAD: "Delicious Homemade Traditional Chicken Pasta with Creamy Sauce"

INGREDIENTS: 8-12 ingredients per recipe. Every ingredient MUST include exact quantity and unit.
  GOOD: "300g boneless chicken", "2 tablespoons olive oil", "1 teaspoon cumin"
  BAD: "chicken", "oil", "cumin"

STEPS: 6-8 detailed step-by-step instructions. Each step must be a complete sentence explaining exactly what to do.
  GOOD: "Heat 2 tablespoons of oil in a pan over medium heat for 1 minute, then add chopped onions."
  BAD: "Heat oil and add onions."

VARIETY: 25 completely different dishes — no two the same.
COUNT: Exactly 25. Count before responding.

Respond ONLY with a valid JSON array of EXACTLY 25 objects. No text before or after.

[
  {
    "title": "Short Recipe Name",
    "description": "1-2 sentence description of this dish.",
    "cuisine": "Pakistani / Italian / Mexican / Japanese / etc.",
    "cookingTime": "30 minutes",
    "dietary": null,
    "ingredients": ["300g chicken", "2 bread slices", "1 egg", "1 tbsp butter", "1 tsp salt", "..."],
    "steps": [
      "Heat 1 tablespoon of butter in a pan over medium heat.",
      "Add the chicken pieces and cook for 5-6 minutes until golden brown.",
      "..."
    ]
  }
]`;

    return await callGroq(prompt, 32000);
};

// ─── 3. GROQ AI: Generate 50 recipes (2 parallel batches of 25) ──────────────
router.post('/generate-ai', async (req, res) => {
    console.log("🔑 GROQ KEY LAST 6:", process.env.GROQ_API_KEY?.slice(-6));

    const { ingredients, cuisineType, cookingTime, foodPreference } = req.body;

    if (!ingredients) {
        return res.status(400).json({ error: "Ingredients are required" });
    }

    const cuisineInstruction = (!cuisineType || cuisineType === 'Any Cuisine')
        ? `Generate recipes from ANY cuisine — Pakistani, Indian, Italian, Mexican, Chinese, Japanese, American, or other world cuisines.
           Each recipe must belong to ONE consistent cuisine only. Do not mix cuisines within a single recipe.
           Assign the correct cuisine label to each recipe after determining what dish it is.`
        : cuisineType === 'Pakistani / Indian'
        ? `Every recipe MUST be a traditional Pakistani or Indian dish.
           Each recipe must be a single coherent Pakistani or Indian dish. Do not mix with other cuisines.`
        : `Every recipe MUST be a traditional ${cuisineType} dish.
           Each recipe must be a single coherent ${cuisineType} dish. No other cuisine allowed. No mixing.`;

    const timeInstruction = (!cookingTime || cookingTime === 'Any Time')
        ? `Mix of quick (under 15 mins), medium (15-45 mins), and slow-cooked (45+ mins).`
        : cookingTime === 'Under 15 mins' ? `UNDER 15 MINUTES only. Quick snacks, toast, egg dishes.`
        : cookingTime === '15-30 mins' ? `15 to 30 MINUTES only. Quick meals, snacks, sandwiches.`
        : cookingTime === '30-60 mins' ? `30 to 60 MINUTES only.`
        : `MORE THAN 1 HOUR only. Slow-cooked dishes.`;

    const dietaryInstruction = (!foodPreference || foodPreference === 'No Preference')
        ? `No dietary restrictions.`
        : foodPreference === 'Vegetarian' ? `Strictly Vegetarian. No meat, chicken, beef, fish.`
        : foodPreference === 'Vegan' ? `Strictly Vegan. No meat, dairy, eggs, honey.`
        : foodPreference === 'Gluten Free' ? `Strictly Gluten Free. No wheat, flour, bread, pasta.`
        : foodPreference === 'Keto' ? `Strictly Keto. High fat, low carb. No rice, bread, sugar, potatoes.`
        : `Strictly ${foodPreference}.`;

    try {
        console.log("🤖 Generating 50 AI recipes in 2 parallel batches of 25...");

        // Both batches fire at the same time
        const [batch1Result, batch2Result] = await Promise.allSettled([
            generateAIBatch(ingredients, cuisineInstruction, timeInstruction, dietaryInstruction, 1),
            generateAIBatch(ingredients, cuisineInstruction, timeInstruction, dietaryInstruction, 2),
        ]);

        const recipes1 = (batch1Result.status === 'fulfilled' && Array.isArray(batch1Result.value))
            ? batch1Result.value : [];
        const recipes2 = (batch2Result.status === 'fulfilled' && Array.isArray(batch2Result.value))
            ? batch2Result.value : [];

        const allRecipes = [...recipes1, ...recipes2];
        console.log(`✅ AI generated ${allRecipes.length} recipes total (${recipes1.length} + ${recipes2.length})`);

        res.json(allRecipes);

    } catch (error) {
        console.error("❌ Groq error:", error.message);
        res.status(500).json({ error: "Failed to generate recipes with AI" });
    }
});

// ─── 4. SAVE a recipe ─────────────────────────────────────────────────────────
router.post('/save', async (req, res) => {
    const { user_id, source, external_id, title, cuisine, cooking_time, dietary, ingredients, steps, image_url } = req.body;

    if (!user_id || !title || !source) {
        return res.status(400).json({ error: "user_id, title and source are required" });
    }

    try {
        const existing = await pool.query(
            `SELECT id FROM saved_recipes WHERE user_id = $1 AND title = $2 AND source = $3`,
            [user_id, title, source]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Already saved", id: existing.rows[0].id });
        }

        const result = await pool.query(
            `INSERT INTO saved_recipes (user_id, source, external_id, title, cuisine, cooking_time, dietary, ingredients, steps, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [user_id, source, external_id || null, title, cuisine || null, cooking_time || null,
             dietary || null, ingredients || [], steps || [], image_url || null]
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
    if (!user_id || !title || !source) return res.status(400).json({ error: "user_id, title and source are required" });

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