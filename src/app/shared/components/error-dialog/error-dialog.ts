import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

/**
 * Modal pop-up for errors, e.g. when the ingredients don't suffice.
 *
 * Built on the native `<dialog>` element, so focus trapping and closing via
 * Escape work out of the box. A click on the backdrop closes it, too.
 */
@Component({
  selector: 'app-error-dialog',
  styleUrl: './error-dialog.scss',
  templateUrl: './error-dialog.html',
})
export class ErrorDialog {
  /** Whether the dialog is shown. */
  readonly open = input(false);
  readonly title = input('Ups! Not quite enough...');
  readonly message = input.required<string>();
  /** Text of the action link, e.g. `Go back to ingredients`. */
  readonly actionLabel = input('Go back to ingredients');

  /** Emits when the action link is clicked. */
  readonly action = output<void>();
  /** Emits whenever the dialog closes (action, close button, Escape, backdrop). */
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) dialog.showModal();
      if (!this.open() && dialog.open) dialog.close();
    });
  }

  /** Closes the dialog if the click hit the backdrop, not the content. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.dialog().nativeElement.close();
  }

  protected onAction(): void {
    this.action.emit();
    this.dialog().nativeElement.close();
  }
}
