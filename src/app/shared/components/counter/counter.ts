import { Component, computed, input, model } from '@angular/core';

/** Number stepper like `− 2 Portions +`. */
@Component({
  selector: 'app-counter',
  styleUrl: './counter.scss',
  templateUrl: './counter.html',
})
export class Counter {
  readonly value = model.required<number>();
  readonly min = input(1);
  readonly max = input(10);
  readonly singular = input.required<string>();
  readonly plural = input.required<string>();

  protected readonly unit = computed(() => (this.value() === 1 ? this.singular() : this.plural()));

  /** Decreases the value down to `min`. */
  protected decrement(): void {
    this.value.set(Math.max(this.min(), this.value() - 1));
  }

  /** Increases the value up to `max`. */
  protected increment(): void {
    this.value.set(Math.min(this.max(), this.value() + 1));
  }
}
