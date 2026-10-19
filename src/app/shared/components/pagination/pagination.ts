import { Component, computed, input, output } from '@angular/core';

export const GAP = 'gap';
/** Entry of the pagination: a page number or a gap. */
export type PageItem = number | typeof GAP;

/** Page navigation like `< 1 2 3 … 8 >`. */
@Component({
  selector: 'app-pagination',
  styleUrl: './pagination.scss',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly items = computed(() => pageItems(this.page(), this.totalPages()));
  protected readonly gap = GAP;

  /**
   * Emits a page change if the page is valid and new.
   * @param page - Selected page.
   */
  protected select(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.page()) this.pageChange.emit(page);
  }
}

/**
 * Computes the visible pages: first, last, current with neighbours, gaps in between.
 * @param current - Current page.
 * @param total - Number of pages.
 * @returns Page numbers and gaps.
 */
export function pageItems(current: number, total: number): PageItem[] {
  if (total <= 1) return total === 1 ? [1] : [];
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 2) pages.add(3);
  if (current >= total - 1) pages.add(total - 2);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, index) =>
    index > 0 && page - sorted[index - 1] > 1 ? [GAP, page] : [page],
  );
}
