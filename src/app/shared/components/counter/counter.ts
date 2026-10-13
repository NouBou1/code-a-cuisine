import { Component, computed, input, model } from '@angular/core';

/**
 * Number stepper with minus and plus buttons, e.g. `− 2 Portions +`.
 */
@Component({
  selector: 'app-counter',
  styleUrl: './counter.scss',
  templateUrl: './counter.html',
})
export class Counter {
  /** Current value (two-way bindable). */
  readonly value = model.required<number>();
  readonly min = input(1);
  readonly max = input(10);
  /** Unit shown after the number for the value 1, e.g. `Person`. */
  readonly singular = input.required<string>();
  /** Unit shown after the number for other values, e.g. `Persons`. */
  readonly plural = input.required<string>();

  protected readonly unit = computed(() => (this.value() === 1 ? this.singular() : this.plural()));

  /** Decreases the value, but not below `min`. */
  protected decrement(): void {
    this.value.set(Math.max(this.min(), this.value() - 1));
  }

  /** Increases the value, but not above `max`. */
  protected increment(): void {
    this.value.set(Math.min(this.max(), this.value() + 1));
  }
}
