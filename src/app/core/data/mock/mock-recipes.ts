import { Recipe } from '../../models/recipe.model';

/** Day in milliseconds, used to spread the seed recipes over time. */
const DAY = 86_400_000;

/** Fixed reference date so the seed data is deterministic. */
const BASE = Date.UTC(2026, 9, 1);

/**
 * Seed recipes for the mock repository, covering all cuisines.
 */
export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'mock-pasta-spinach',
    title: 'Pasta with spinach and cherry tomatoes',
    cuisine: 'italian',
    cookingTime: 'quick',
    durationMinutes: 20,
    diet: 'vegetarian',
    portions: 2,
    cooks: 2,
    nutrition: { kcal: 630, protein: 18, fat: 24, carbs: 58 },
    ingredients: [
      { quantity: '80g', name: 'Pasta noodles' },
      { quantity: '100g', name: 'Baby spinach' },
      { quantity: '150g', name: 'Cherry tomatoes' },
      { quantity: '1 piece', name: 'Egg' },
    ],
    extraIngredients: [
      { quantity: '40g', name: 'Parmesan cheese' },
      { quantity: '30ml', name: 'Olive oil' },
      { quantity: 'Herbs', name: '(dry basil, oregano, garlic)' },
    ],
    steps: [
      {
        title: 'Cook the pasta',
        description:
          'Cook your noodles in boiling, salted water until the pasta is al dente. Drain the pasta and reserve some of the pasta water.',
        chef: 1,
      },
      {
        title: 'Make the sauce',
        description:
          'While the pasta is cooking, heat olive oil in a pan over medium heat. Add the garlic and sauté until it starts to turn golden. Add the tomatoes, oregano, salt and pepper, and cook for 3-4 minutes.',
        chef: 2,
      },
      {
        title: 'Finish the pasta',
        description:
          'Add the noodles to the sauce, then add pasta water until the sauce has the right consistency. Simmer for 1 minute, then add the spinach, basil, chili flakes and parmesan.',
        chef: 1,
      },
      {
        title: 'Serve',
        description:
          'Lower the heat, stir until mixed and remove from the heat. Season to taste, top with parmesan cheese and enjoy.',
        chef: 2,
      },
    ],
    likes: 66,
    createdAt: BASE - 2 * DAY,
  },
  {
    id: 'mock-garlic-shrimp',
    title: 'Creamy garlic shrimp pasta',
    cuisine: 'italian',
    cookingTime: 'medium',
    durationMinutes: 30,
    diet: 'none',
    portions: 2,
    cooks: 1,
    nutrition: { kcal: 720, protein: 34, fat: 28, carbs: 70 },
    ingredients: [
      { quantity: '200g', name: 'Spaghetti' },
      { quantity: '250g', name: 'Shrimp' },
    ],
    extraIngredients: [
      { quantity: '150ml', name: 'Cream' },
      { quantity: '3 cloves', name: 'Garlic' },
      { quantity: '20g', name: 'Butter' },
    ],
    steps: [
      {
        title: 'Cook the spaghetti',
        description: 'Cook the spaghetti in salted water until al dente.',
        chef: 1,
      },
      {
        title: 'Sear the shrimp',
        description:
          'Melt the butter in a pan, add the garlic and the shrimp and sear for 2 minutes per side.',
        chef: 1,
      },
      {
        title: 'Combine',
        description:
          'Pour in the cream, let it thicken for 3 minutes, then toss with the spaghetti.',
        chef: 1,
      },
    ],
    likes: 32,
    createdAt: BASE - 4 * DAY,
  },
  {
    id: 'mock-funghi-pizza',
    title: 'Funghi salami pizza',
    cuisine: 'italian',
    cookingTime: 'complex',
    durationMinutes: 60,
    diet: 'none',
    portions: 2,
    cooks: 2,
    nutrition: { kcal: 850, protein: 32, fat: 34, carbs: 98 },
    ingredients: [
      { quantity: '300g', name: 'Flour' },
      { quantity: '150g', name: 'Mushrooms' },
      { quantity: '80g', name: 'Salami' },
    ],
    extraIngredients: [
      { quantity: '7g', name: 'Dry yeast' },
      { quantity: '200g', name: 'Tomato sauce' },
      { quantity: '125g', name: 'Mozzarella' },
    ],
    steps: [
      {
        title: 'Prepare the dough',
        description: 'Mix flour, yeast, salt and warm water and let the dough rise for 40 minutes.',
        chef: 1,
      },
      {
        title: 'Prepare the toppings',
        description: 'Slice the mushrooms and the salami, tear the mozzarella.',
        chef: 2,
      },
      {
        title: 'Bake',
        description:
          'Roll out the dough, spread the sauce, add the toppings and bake at 250 °C for 10 minutes.',
        chef: 1,
      },
    ],
    likes: 42,
    createdAt: BASE - 6 * DAY,
  },
  {
    id: 'mock-schnitzel',
    title: 'Schnitzel with fries',
    cuisine: 'german',
    cookingTime: 'medium',
    durationMinutes: 40,
    diet: 'none',
    portions: 2,
    cooks: 2,
    nutrition: { kcal: 910, protein: 42, fat: 46, carbs: 80 },
    ingredients: [
      { quantity: '2 pieces', name: 'Pork cutlets' },
      { quantity: '500g', name: 'Potatoes' },
    ],
    extraIngredients: [
      { quantity: '2 pieces', name: 'Eggs' },
      { quantity: '80g', name: 'Breadcrumbs' },
      { quantity: '1 piece', name: 'Lemon' },
    ],
    steps: [
      {
        title: 'Make the fries',
        description:
          'Cut the potatoes into sticks, toss with oil and bake at 220 °C for 30 minutes.',
        chef: 1,
      },
      {
        title: 'Bread the cutlets',
        description: 'Pound the cutlets thin, dip into flour, egg and breadcrumbs.',
        chef: 2,
      },
      {
        title: 'Fry',
        description: 'Fry the schnitzel in plenty of fat for 3 minutes per side. Serve with lemon.',
        chef: 2,
      },
    ],
    likes: 93,
    createdAt: BASE - 1 * DAY,
  },
  {
    id: 'mock-kaesespaetzle',
    title: 'Käsespätzle with crispy onions',
    cuisine: 'german',
    cookingTime: 'medium',
    durationMinutes: 35,
    diet: 'vegetarian',
    portions: 2,
    cooks: 1,
    nutrition: { kcal: 780, protein: 30, fat: 38, carbs: 76 },
    ingredients: [
      { quantity: '400g', name: 'Spätzle' },
      { quantity: '150g', name: 'Mountain cheese' },
    ],
    extraIngredients: [
      { quantity: '2 pieces', name: 'Onions' },
      { quantity: '20g', name: 'Butter' },
    ],
    steps: [
      {
        title: 'Fry the onions',
        description: 'Slice the onions into rings and fry them in butter until crispy.',
        chef: 1,
      },
      {
        title: 'Layer and melt',
        description: 'Layer spätzle and grated cheese in a pan and let the cheese melt.',
        chef: 1,
      },
    ],
    likes: 51,
    createdAt: BASE - 3 * DAY,
  },
  {
    id: 'mock-teriyaki-salmon',
    title: 'Teriyaki salmon bowl',
    cuisine: 'japanese',
    cookingTime: 'quick',
    durationMinutes: 20,
    diet: 'none',
    portions: 2,
    cooks: 1,
    nutrition: { kcal: 640, protein: 38, fat: 22, carbs: 64 },
    ingredients: [
      { quantity: '250g', name: 'Salmon' },
      { quantity: '150g', name: 'Rice' },
    ],
    extraIngredients: [
      { quantity: '40ml', name: 'Teriyaki sauce' },
      { quantity: '1 piece', name: 'Avocado' },
      { quantity: '10g', name: 'Sesame' },
    ],
    steps: [
      { title: 'Cook the rice', description: 'Rinse and cook the rice.', chef: 1 },
      {
        title: 'Glaze the salmon',
        description: 'Sear the salmon, add the teriyaki sauce and let it caramelize.',
        chef: 1,
      },
      {
        title: 'Assemble',
        description: 'Serve salmon on rice with sliced avocado and sesame.',
        chef: 1,
      },
    ],
    likes: 47,
    createdAt: BASE - 5 * DAY,
  },
  {
    id: 'mock-paleo-bars',
    title: 'Low Carb Vegan No-Bake Paleo Bars',
    cuisine: 'gourmet',
    cookingTime: 'medium',
    durationMinutes: 35,
    diet: 'vegan',
    portions: 4,
    cooks: 1,
    nutrition: { kcal: 280, protein: 7, fat: 22, carbs: 9 },
    ingredients: [
      { quantity: '150g', name: 'Almonds' },
      { quantity: '100g', name: 'Dates' },
    ],
    extraIngredients: [
      { quantity: '30g', name: 'Coconut oil' },
      { quantity: '20g', name: 'Cocoa' },
    ],
    steps: [
      { title: 'Blend', description: 'Blend almonds and dates into a sticky dough.', chef: 1 },
      {
        title: 'Chill',
        description:
          'Press into a tray, top with melted cocoa coconut oil and chill for 25 minutes.',
        chef: 1,
      },
    ],
    likes: 57,
    createdAt: BASE - 7 * DAY,
  },
  {
    id: 'mock-chana-masala',
    title: 'Chana masala',
    cuisine: 'indian',
    cookingTime: 'medium',
    durationMinutes: 35,
    diet: 'vegan',
    portions: 2,
    cooks: 1,
    nutrition: { kcal: 520, protein: 19, fat: 14, carbs: 72 },
    ingredients: [
      { quantity: '400g', name: 'Chickpeas' },
      { quantity: '400g', name: 'Tomatoes' },
    ],
    extraIngredients: [
      { quantity: '1 piece', name: 'Onion' },
      { quantity: '2 tbsp', name: 'Garam masala' },
      { quantity: '10g', name: 'Ginger' },
    ],
    steps: [
      {
        title: 'Build the base',
        description: 'Fry onion, ginger and spices until fragrant.',
        chef: 1,
      },
      {
        title: 'Simmer',
        description: 'Add tomatoes and chickpeas and simmer for 20 minutes.',
        chef: 1,
      },
    ],
    likes: 38,
    createdAt: BASE - 8 * DAY,
  },
  {
    id: 'mock-sushi-tacos',
    title: 'Sushi tacos with spicy mayo',
    cuisine: 'fusion',
    cookingTime: 'medium',
    durationMinutes: 30,
    diet: 'none',
    portions: 2,
    cooks: 2,
    nutrition: { kcal: 560, protein: 26, fat: 20, carbs: 66 },
    ingredients: [
      { quantity: '200g', name: 'Sushi rice' },
      { quantity: '150g', name: 'Tuna' },
    ],
    extraIngredients: [
      { quantity: '4 pieces', name: 'Nori sheets' },
      { quantity: '30ml', name: 'Sriracha mayo' },
    ],
    steps: [
      { title: 'Cook the rice', description: 'Cook and season the sushi rice.', chef: 1 },
      { title: 'Prepare the fish', description: 'Dice the tuna and mix with spicy mayo.', chef: 2 },
      {
        title: 'Fill the tacos',
        description: 'Fold nori sheets, fill with rice and tuna.',
        chef: 1,
      },
    ],
    likes: 29,
    createdAt: BASE - 9 * DAY,
  },
];
