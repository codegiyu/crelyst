import { describe, expect, it } from 'vitest';
import {
  FORM_ATTACHMENT_MAX_BYTES,
  validateFormAttachmentFile,
  assertAttachmentKeyMatchesSession,
} from './formAttachments';

describe('validateFormAttachmentFile', () => {
  it('accepts a valid PDF', () => {
    expect(validateFormAttachmentFile('brief.pdf', 1024, 'application/pdf')).toBeNull();
  });

  it('rejects oversize files', () => {
    expect(
      validateFormAttachmentFile('huge.pdf', FORM_ATTACHMENT_MAX_BYTES + 1, 'application/pdf')
    ).toMatch(/too large/i);
  });

  it('rejects disallowed extensions', () => {
    expect(validateFormAttachmentFile('virus.exe', 100, 'application/octet-stream')).toMatch(
      /not allowed/i
    );
  });
});

describe('assertAttachmentKeyMatchesSession', () => {
  it('matches keys under the session prefix', () => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000';
    expect(
      assertAttachmentKeyMatchesSession(
        `uploads/form-submission/${sessionId}/attachment/abc.pdf`,
        sessionId
      )
    ).toBe(true);
  });

  it('rejects keys for another session', () => {
    expect(
      assertAttachmentKeyMatchesSession(
        'uploads/form-submission/other-session/attachment/abc.pdf',
        '550e8400-e29b-41d4-a716-446655440000'
      )
    ).toBe(false);
  });
});
