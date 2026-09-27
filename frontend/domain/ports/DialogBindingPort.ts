export type DialogCloseReason = "close-button" | "cancel" | "native-close";

export type DialogCloseDisposition = "dismiss" | "navigation";
export type DialogScrollLock = "fixed-body" | "document-overflow";

/** Handles are specialized by the composition root, never by Domain. */
export interface DialogBindingOptions<TFocus> {
  closeDisposition?(): DialogCloseDisposition;
  scrollLock?: DialogScrollLock;
  onReleased?(disposition: DialogCloseDisposition): void;
  onCloseRequest(reason: DialogCloseReason): void;
  initialFocus(): TFocus | null;
  defaultFocus(): TFocus | null;
  returnFocus(): TFocus | null;
  fallbackFocus(): TFocus | null;
}

export interface DialogBinding {
  sync(open: boolean): void;
  requestClose(): void;
  destroy(disposition?: DialogCloseDisposition): void;
}

export type DialogBindingFactory<TDialog, TFocus> = (
  dialog: TDialog,
  options: DialogBindingOptions<TFocus>,
) => DialogBinding;
