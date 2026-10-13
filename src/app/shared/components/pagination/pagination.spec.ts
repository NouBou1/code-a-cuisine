import { GAP, pageItems } from './pagination';

describe('pageItems', () => {
  it('returns nothing without pages', () => {
    expect(pageItems(1, 0)).toEqual([]);
  });

  it('lists all pages when there are few', () => {
    expect(pageItems(1, 3)).toEqual([1, 2, 3]);
  });

  it('shows the first pages and the last page at the start', () => {
    expect(pageItems(1, 8)).toEqual([1, 2, 3, GAP, 8]);
  });

  it('shows the neighbours of the current page in the middle', () => {
    expect(pageItems(5, 8)).toEqual([1, GAP, 4, 5, 6, GAP, 8]);
  });

  it('shows the last pages at the end', () => {
    expect(pageItems(8, 8)).toEqual([1, GAP, 6, 7, 8]);
  });
});
