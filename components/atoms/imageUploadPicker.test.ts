import { describe, expect, it } from 'vitest';
import { shouldOpenImageUploadPicker } from './imageUploadPicker';

describe('shouldOpenImageUploadPicker', () => {
  it('opens the picker for a normal dropzone click', () => {
    expect(
      shouldOpenImageUploadPicker({
        disabled: false,
        uploading: false,
        isControlClick: false,
      })
    ).toBe(true);
  });

  it('does not open when the clear/control button was clicked', () => {
    expect(
      shouldOpenImageUploadPicker({
        disabled: false,
        uploading: false,
        isControlClick: true,
      })
    ).toBe(false);
  });

  it('does not open while disabled', () => {
    expect(
      shouldOpenImageUploadPicker({
        disabled: true,
        uploading: false,
        isControlClick: false,
      })
    ).toBe(false);
  });

  it('does not open while uploading', () => {
    expect(
      shouldOpenImageUploadPicker({
        disabled: false,
        uploading: true,
        isControlClick: false,
      })
    ).toBe(false);
  });
});
