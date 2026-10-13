import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  INGREDIENT_UNITS,
  Ingredient,
  IngredientUnit,
  formatAmount,
} from '../../../../core/models/ingredient.model';
import { MAX_AMOUNT } from '../../../../core/state/generator.store';

/** Changed values emitted when an edit is confirmed. */
export interface IngredientChange {
  amount: number;
  unit: IngredientUnit;
}

/**
 * One entry of the ingredient list. In edit mode amount and unit can be changed.
 */
@Component({
  imports: [FormsModule],
  selector: 'app-ingredient-list-item',
  styleUrl: './ingredient-list-item.scss',
  templateUrl: './ingredient-list-item.html',
})
export class IngredientListItem {
  readonly ingredient = input.required<Ingredient>();
  /** Emits the new amount and unit when the user confirms an edit. */
  readonly changed = output<IngredientChange>();
  /** Emits when the user deletes the entry. */
  readonly removed = output<void>();

  protected readonly units = INGREDIENT_UNITS;
  protected readonly maxAmount = MAX_AMOUNT;
  protected readonly editing = signal(false);
  protected readonly amount = signal(0);
  protected readonly unit = signal<IngredientUnit>('gram');
  protected readonly amountValid = computed(
    () => Number.isFinite(this.amount()) && this.amount() > 0 && this.amount() <= MAX_AMOUNT,
  );
  protected readonly displayAmount = computed(() =>
    formatAmount(this.ingredient().amount, this.ingredient().unit),
  );

  private readonly amountInput = viewChild<ElementRef<HTMLInputElement>>('amountInput');

  /** Switches to edit mode with the current values. */
  protected startEdit(): void {
    this.amount.set(this.ingredient().amount);
    this.unit.set(this.ingredient().unit);
    this.editing.set(true);
    queueMicrotask(() => this.amountInput()?.nativeElement.select());
  }

  /** Emits the changes if they are valid and leaves edit mode. */
  protected confirm(): void {
    if (!this.amountValid()) return;
    this.changed.emit({ amount: this.amount(), unit: this.unit() });
    this.editing.set(false);
  }

  /** Leaves edit mode without saving. */
  protected cancel(): void {
    this.editing.set(false);
  }
}
