import { describe, expect, it } from 'vitest';
import { syncFormValuesFromFormData } from './syncFormValuesFromDom';

describe('syncFormValuesFromFormData', () => {
  it('merges autofill values from FormData into current state', () => {
    const formData = new FormData();
    formData.set('name', 'Jane Doe');
    formData.set('company', 'Acme Inc');
    formData.set('email', 'jane@example.com');

    const current = {
      name: '',
      company: '',
      email: '',
      message: 'Already typed',
    };

    const result = syncFormValuesFromFormData(formData, current, [
      'name',
      'company',
      'email',
      'message',
    ]);

    expect(result).toEqual({
      name: 'Jane Doe',
      company: 'Acme Inc',
      email: 'jane@example.com',
      message: 'Already typed',
    });
  });

  it('does not overwrite state when FormData matches current values', () => {
    const formData = new FormData();
    formData.set('name', 'Jane Doe');

    const current = { name: 'Jane Doe', email: '' };

    const result = syncFormValuesFromFormData(formData, current, ['name', 'email']);

    expect(result).toBe(current);
  });

  it('ignores fields not listed in fieldNames', () => {
    const formData = new FormData();
    formData.set('name', 'Jane Doe');
    formData.set('extra', 'ignored');

    const current = { name: '', email: '' };

    const result = syncFormValuesFromFormData(formData, current, ['email']);

    expect(result).toEqual({ name: '', email: '' });
  });
});
