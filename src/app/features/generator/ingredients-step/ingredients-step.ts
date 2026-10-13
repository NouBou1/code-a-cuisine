import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { INGREDIENT_UNITS, IngredientUnit } from '../../../core/models/ingredient.model';
import {
  GeneratorStore,
  MAX_AMOUNT,
  MAX_INGREDIENTS,
  MAX_INGREDIENT_NAME_LENGTH,
} from '../../../core/state/generator.store';
import { MenuBar } from '../../../shared/components/menu-bar/menu-bar';
import { IngredientChange, IngredientListItem } from './ingredient-list-item/ingredient-list-item';

const NAME_PATTERN = /^[\p{L}][\p{L}\s'’-]*$/u;

/** Generator step 1: enter ingredients. */
@Component({
  imports: [MenuBar, ReactiveFormsModule, IngredientListItem],
  selector: 'app-ingredients-step',
  styleUrl: './ingredients-step.scss',
  templateUrl: './ingredients-step.html',
})
export class IngredientsStep {
  protected readonly store = inject(GeneratorStore);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly units = INGREDIENT_UNITS;
  protected readonly maxIngredients = MAX_INGREDIENTS;
  protected readonly maxNameLength = MAX_INGREDIENT_NAME_LENGTH;
  protected readonly maxAmount = MAX_AMOUNT;
  protected readonly submitted = signal(false);

  protected readonly form = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(MAX_INGREDIENT_NAME_LENGTH),
        Validators.pattern(NAME_PATTERN),
      ],
    ],
    amount: [100, [Validators.required, Validators.min(0.1), Validators.max(MAX_AMOUNT)]],
    unit: ['gram' as IngredientUnit, Validators.required],
  });

  private readonly nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');

  /** Adds the entered ingredient and resets the name field. */
  protected add(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    if (this.store.addIngredient(this.form.getRawValue())) {
      this.form.controls.name.reset();
      this.submitted.set(false);
      this.nameInput().nativeElement.focus();
    }
  }

  /**
   * Applies an edit from the list.
   * @param id - Ingredient id.
   * @param name - Ingredient name.
   * @param change - New amount and unit.
   */
  protected update(id: string, name: string, change: IngredientChange): void {
    this.store.updateIngredient(id, { name, ...change });
  }

  /** Continues to step 2. */
  protected next(): void {
    if (this.store.hasIngredients()) this.router.navigate(['/generate/preferences']);
  }

  /**
   * Checks whether to show an error for a field.
   * @param control - Field name.
   * @returns `true` if invalid and touched or submitted.
   */
  protected showError(control: 'name' | 'amount'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (this.submitted() || c.dirty);
  }
}
