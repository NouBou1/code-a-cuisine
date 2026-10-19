import { formatQuantity } from './quantity.pipe';

describe('formatQuantity', () => {
  it('writes grams and milliliters without a space', () => {
    expect(formatQuantity('150 gram')).toBe('150g');
    expect(formatQuantity('200 grams')).toBe('200g');
    expect(formatQuantity('1.5 g')).toBe('1.5g');
    expect(formatQuantity('30 ml')).toBe('30ml');
  });

  it('uses singular and plural for pieces', () => {
    expect(formatQuantity('2 piece')).toBe('2 pieces');
    expect(formatQuantity('1 pieces')).toBe('1 piece');
  });

  it('keeps other quantities', () => {
    expect(formatQuantity('80g')).toBe('80g');
    expect(formatQuantity(' 1 tbsp ')).toBe('1 tbsp');
    expect(formatQuantity('to taste')).toBe('to taste');
  });
});
