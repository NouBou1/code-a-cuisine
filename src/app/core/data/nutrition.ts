import { Nutrition } from '../models/recipe.model';

/** Share of protein, fat and carbs in percent. */
export type MacroShares = Pick<Nutrition, 'protein' | 'fat' | 'carbs'>;

const KCAL_PER_GRAM: MacroShares = { protein: 4, fat: 9, carbs: 4 };

/**
 * Scales nutrition values, e.g. from one portion to the whole recipe.
 * @param nutrition - Values per portion.
 * @param factor - Number of portions.
 * @returns The rounded, scaled values.
 */
export function scaleNutrition(nutrition: Nutrition, factor: number): Nutrition {
  return {
    kcal: Math.round(nutrition.kcal * factor),
    protein: Math.round(nutrition.protein * factor),
    fat: Math.round(nutrition.fat * factor),
    carbs: Math.round(nutrition.carbs * factor),
  };
}

/**
 * Calculates the share of each macronutrient in the energy of the macronutrients.
 * @param nutrition - Nutrition values.
 * @returns Rounded percentages; all `0` if there is no energy.
 */
export function macroEnergyShares(nutrition: Nutrition): MacroShares {
  const protein = nutrition.protein * KCAL_PER_GRAM.protein;
  const fat = nutrition.fat * KCAL_PER_GRAM.fat;
  const carbs = nutrition.carbs * KCAL_PER_GRAM.carbs;
  const total = protein + fat + carbs;
  if (total <= 0) return { protein: 0, fat: 0, carbs: 0 };
  const percent = (kcal: number) => Math.round((kcal / total) * 100);
  return { protein: percent(protein), fat: percent(fat), carbs: percent(carbs) };
}
