import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

/** Modal error pop-up based on the native `<dialog>`. */
@Component({
  selector: 'app-error-dialog',
  styleUrl: './error-dialog.scss',
  templateUrl: './error-dialog.html',
})
export class ErrorDialog {
  readonly open = input(false);
  readonly title = input('Ups! Not quite enough...');
  readonly message = input.required<string>();
  readonly actionLabel = input('Go back to ingredients');

  readonly action = output<void>();
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) dialog.showModal();
      if (!this.open() && dialog.open) dialog.close();
    });
  }

  /**
   * Closes the dialog on a backdrop click.
   * @param event - Click event.
   */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.dialog().nativeElement.close();
  }

  /** Emits the action and closes the dialog. */
  protected onAction(): void {
    this.action.emit();
    this.dialog().nativeElement.close();
  }
}
