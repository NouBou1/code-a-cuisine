import { Component, computed, input, output } from '@angular/core';

/** Placeholder for skipped pages in the page list. */
export const GAP = 'gap';

/** An entry of the page list: a page number or a gap (`…`). */
export type PageItem = number | typeof GAP;

/**
 * Page navigation like `< 1 2 3 … 8 >`.
 */
@Component({
  selector: 'app-pagination',
  styleUrl: './pagination.scss',
  templateUrl: './pagination.html',
})
export class Pagination {
  /** Current 1-based page. */
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  /** Emits the 1-based page the user selected. */
  readonly pageChange = output<number>();

  protected readonly items = computed(() => pageItems(this.page(), this.totalPages()));
  protected readonly gap = GAP;

  protected select(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.page()) this.pageChange.emit(page);
  }
}

/**
 * Computes the visible page list: always the first and last page, the
 * current page with its neighbours, and gaps for everything in between.
 *
 * @example pageItems(1, 8) // [1, 2, 3, 'gap', 8]
 * @example pageItems(5, 8) // [1, 'gap', 4, 5, 6, 'gap', 8]
 *
 * @param current - Current 1-based page.
 * @param total - Total number of pages.
 * @returns Page numbers and gaps in display order.
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
