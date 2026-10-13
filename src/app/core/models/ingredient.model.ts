/** Units a user can choose for an ingredient amount. */
export type IngredientUnit = 'gram' | 'ml' | 'piece';

/** All selectable units in display order. */
export const INGREDIENT_UNITS: readonly IngredientUnit[] = ['gram', 'ml', 'piece'];

/**
 * An ingredient the user has entered in step 1 of the generator.
 */
export interface Ingredient {
  /** Client-side id, used for editing and deleting list entries. */
  id: string;
  /** Free-text name, e.g. `Pasta`. */
  name: string;
  /** Positive amount in the given unit. */
  amount: number;
  unit: IngredientUnit;
}

/**
 * Formats an amount with its unit for display, e.g. `100g`, `30ml` or `1`.
 *
 * @param amount - The amount.
 * @param unit - The unit of the amount.
 * @returns The formatted amount.
 */
export function formatAmount(amount: number, unit: IngredientUnit): string {
  if (unit === 'gram') return `${amount}g`;
  if (unit === 'ml') return `${amount}ml`;
  return `${amount}`;
}
