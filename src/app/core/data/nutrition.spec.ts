import { macroEnergyShares, scaleNutrition } from './nutrition';

describe('scaleNutrition', () => {
  it('multiplies and rounds every value', () => {
    expect(scaleNutrition({ kcal: 512, protein: 21.4, fat: 18, carbs: 60.5 }, 3)).toEqual({
      kcal: 1536,
      protein: 64,
      fat: 54,
      carbs: 182,
    });
  });
});

describe('macroEnergyShares', () => {
  it('weights fat with 9 kcal and protein and carbs with 4 kcal per gram', () => {
    // 25g protein = 100 kcal, 20g fat = 180 kcal, 30g carbs = 120 kcal -> 400 kcal
    expect(macroEnergyShares({ kcal: 400, protein: 25, fat: 20, carbs: 30 })).toEqual({
      protein: 25,
      fat: 45,
      carbs: 30,
    });
  });

  it('returns 0 for every share without energy', () => {
    expect(macroEnergyShares({ kcal: 0, protein: 0, fat: 0, carbs: 0 })).toEqual({
      protein: 0,
      fat: 0,
      carbs: 0,
    });
  });
});
