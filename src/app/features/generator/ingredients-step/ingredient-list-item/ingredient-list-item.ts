import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  INGREDIENT_UNITS,
  Ingredient,
  IngredientUnit,
  formatAmount,
} from '../../../../core/models/ingredient.model';
import { MAX_AMOUNT } from '../../../../core/state/generator.store';

/** New amount and unit of an edited ingredient. */
export interface IngredientChange {
  amount: number;
  unit: IngredientUnit;
}

/** Ingredient list entry with edit mode for amount and unit. */
@Component({
  imports: [FormsModule],
  selector: 'app-ingredient-list-item',
  styleUrl: './ingredient-list-item.scss',
  templateUrl: './ingredient-list-item.html',
})
export class IngredientListItem {
  readonly ingredient = input.required<Ingredient>();
  readonly changed = output<IngredientChange>();
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

  /** Opens edit mode with the current values. */
  protected startEdit(): void {
    this.amount.set(this.ingredient().amount);
    this.unit.set(this.ingredient().unit);
    this.editing.set(true);
    queueMicrotask(() => this.amountInput()?.nativeElement.select());
  }

  /** Saves valid changes and closes edit mode. */
  protected confirm(): void {
    if (!this.amountValid()) return;
    this.changed.emit({ amount: this.amount(), unit: this.unit() });
    this.editing.set(false);
  }

  /** Closes edit mode without saving. */
  protected cancel(): void {
    this.editing.set(false);
  }
}
