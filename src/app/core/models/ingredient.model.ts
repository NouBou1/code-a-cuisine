/** Unit of an entered ingredient. */
export type IngredientUnit = 'gram' | 'ml' | 'piece';

export const INGREDIENT_UNITS: readonly IngredientUnit[] = ['gram', 'ml', 'piece'];

/** Ingredient entered by the user. */
export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: IngredientUnit;
}

/**
 * Formats an amount for display, e.g. `100g`, `30ml` or `1`.
 * @param amount - The amount.
 * @param unit - The unit.
 * @returns The formatted amount.
 */
export function formatAmount(amount: number, unit: IngredientUnit): string {
  if (unit === 'gram') return `${amount}g`;
  if (unit === 'ml') return `${amount}ml`;
  return `${amount}`;
}
