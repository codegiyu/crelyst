export type ImageUploadPickerClickContext = {
  disabled: boolean;
  uploading: boolean;
  /** True when the click originated on the clear control (or another button). */
  isControlClick: boolean;
};

/**
 * Whether a dropzone click should open the hidden file input.
 * Clear/control clicks and disabled/uploading states never open the picker.
 */
export function shouldOpenImageUploadPicker(ctx: ImageUploadPickerClickContext): boolean {
  if (ctx.isControlClick) {
    return false;
  }

  if (ctx.disabled || ctx.uploading) {
    return false;
  }

  return true;
}
