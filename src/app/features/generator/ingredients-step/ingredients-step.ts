import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { suggestIngredients } from '../../../core/constants/ingredients';
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
    amount: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0.1),
      Validators.max(MAX_AMOUNT),
    ]),
    unit: ['gram' as IngredientUnit, Validators.required],
  });

  private readonly nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');
  private readonly amountInput = viewChild.required<ElementRef<HTMLInputElement>>('amountInput');

  private readonly name = toSignal(this.form.controls.name.valueChanges, {
    initialValue: this.form.controls.name.value,
  });
  protected readonly suggestionsOpen = signal(false);
  protected readonly activeSuggestion = signal(-1);

  /** Keyboard actions in the name field; each returns `true` if it handled the key. */
  private readonly keyActions: Partial<Record<string, () => boolean>> = {
    ArrowDown: () => this.highlightNext(),
    ArrowUp: () => this.highlightPrevious(),
    Enter: () => this.selectHighlighted(),
    ArrowRight: () => this.acceptCompletion(),
    Escape: () => this.closeOpenSuggestions(),
  };

  protected readonly suggestions = computed(() => {
    const name = this.name();
    const matches = suggestIngredients(
      name,
      this.store.ingredients().map((i) => i.name),
    );
    const typedExactly =
      matches.length === 1 && matches[0].toLowerCase() === name.trim().toLowerCase();
    return typedExactly ? [] : matches;
  });

  protected readonly showSuggestions = computed(
    () => this.suggestionsOpen() && this.suggestions().length > 0,
  );

  /** Rest of the first suggestion, shown faded after the typed text. */
  protected readonly completion = computed(() => {
    const name = this.name();
    const first = this.suggestions()[0];
    if (!this.showSuggestions() || !first?.toLowerCase().startsWith(name.toLowerCase())) return '';
    return first.slice(name.length);
  });

  /** Adds the entered ingredient and resets the name field. */
  protected add(): void {
    this.submitted.set(true);
    this.closeSuggestions();
    const { name, amount, unit } = this.form.getRawValue();
    if (this.form.invalid || amount === null) return;
    if (this.store.addIngredient({ name, amount, unit })) {
      this.form.controls.name.reset();
      this.form.controls.amount.reset();
      this.submitted.set(false);
      this.nameInput().nativeElement.focus();
    }
  }

  /** Opens the suggestions while typing. */
  protected openSuggestions(): void {
    this.suggestionsOpen.set(true);
    this.activeSuggestion.set(-1);
  }

  /** Closes the suggestions. */
  protected closeSuggestions(): void {
    this.suggestionsOpen.set(false);
    this.activeSuggestion.set(-1);
  }

  /**
   * Takes over a suggestion and moves on to the amount.
   * @param name - Chosen ingredient name.
   */
  protected selectSuggestion(name: string): void {
    this.form.controls.name.setValue(name);
    this.form.controls.name.markAsDirty();
    this.closeSuggestions();
    this.amountInput().nativeElement.focus();
  }

  /**
   * Handles keyboard navigation in the suggestions.
   * @param event - Keydown on the name field.
   */
  protected onNameKeydown(event: KeyboardEvent): void {
    const action = this.keyActions[event.key];
    if (action?.()) event.preventDefault();
  }

  /**
   * Highlights the next suggestion and opens the list.
   * @returns `true` if there was a suggestion.
   */
  private highlightNext(): boolean {
    const count = this.suggestions().length;
    if (!count) return false;
    this.suggestionsOpen.set(true);
    this.activeSuggestion.set((this.activeSuggestion() + 1) % count);
    return true;
  }

  /**
   * Highlights the previous suggestion, wrapping to the last one.
   * @returns `true` if the list was open.
   */
  private highlightPrevious(): boolean {
    if (!this.showSuggestions()) return false;
    const active = this.activeSuggestion();
    this.activeSuggestion.set(active <= 0 ? this.suggestions().length - 1 : active - 1);
    return true;
  }

  /**
   * Takes over the highlighted suggestion.
   * @returns `true` if one was highlighted.
   */
  private selectHighlighted(): boolean {
    const active = this.activeSuggestion();
    if (!this.showSuggestions() || active < 0) return false;
    this.selectSuggestion(this.suggestions()[active]);
    return true;
  }

  /**
   * Takes over the inline completion when the caret is at the end.
   * @returns `true` if a completion was shown.
   */
  private acceptCompletion(): boolean {
    if (!this.completion() || !this.caretAtEnd()) return false;
    this.selectSuggestion(this.suggestions()[0]);
    return true;
  }

  /**
   * Closes the open suggestion list.
   * @returns `true` if the list was open.
   */
  private closeOpenSuggestions(): boolean {
    if (!this.showSuggestions()) return false;
    this.closeSuggestions();
    return true;
  }

  /**
   * Checks whether the caret sits at the end of the name field.
   * @returns `true` if nothing follows the caret.
   */
  private caretAtEnd(): boolean {
    const input = this.nameInput().nativeElement;
    return input.selectionStart === input.value.length && input.selectionEnd === input.value.length;
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
