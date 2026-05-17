import { describe, expect, it } from 'vitest';
import { plainTextToSafeHtml, sanitizeHtml } from './sanitizeHtml';

describe('sanitizeHtml', () => {
  it('strips script tags', () => {
    const out = sanitizeHtml('<p>Hello</p><script>alert(1)</script>');
    expect(out).not.toContain('script');
    expect(out).toContain('Hello');
  });

  it('allows safe formatting tags', () => {
    const out = sanitizeHtml('<p><strong>Bold</strong></p>');
    expect(out).toContain('<strong>');
  });
});

describe('plainTextToSafeHtml', () => {
  it('escapes angle brackets and preserves line breaks', () => {
    const out = plainTextToSafeHtml('line1\n<script>x</script>');
    expect(out).not.toContain('<script>');
    expect(out).toContain('<br');
    expect(out).toContain('line1');
  });
});
