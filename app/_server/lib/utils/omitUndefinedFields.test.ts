import { describe, expect, it } from 'vitest';
import { omitUndefinedFields } from './omitUndefinedFields';

describe('omitUndefinedFields', () => {
  it('removes keys whose values are undefined', () => {
    const result = omitUndefinedFields({
      name: 'Jane',
      uploadSessionId: undefined,
      attachments: undefined,
      sourceIp: null,
    });

    expect(result).toEqual({
      name: 'Jane',
      sourceIp: null,
    });
  });

  it('preserves empty strings and zero', () => {
    const result = omitUndefinedFields({
      message: '',
      count: 0,
      flag: false,
    });

    expect(result).toEqual({
      message: '',
      count: 0,
      flag: false,
    });
  });
});
