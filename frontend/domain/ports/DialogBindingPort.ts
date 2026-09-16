export type DialogCloseReason = "close-button" | "cancel" | "native-close";

/** Handles are specialized by the composition root, never by Domain. */
export interface DialogBindingOptions<TFocus> {
  onCloseRequest(reason: DialogCloseReason): void;
  initialFocus(): TFocus | null;
  defaultFocus(): TFocus | null;
  returnFocus(): TFocus | null;
  fallbackFocus(): TFocus | null;
}

export interface DialogBinding {
  sync(open: boolean): void;
  requestClose(): void;
  destroy(): void;
}

export type DialogBindingFactory<TDialog, TFocus> = (
  dialog: TDialog,
  options: DialogBindingOptions<TFocus>,
) => DialogBinding;
