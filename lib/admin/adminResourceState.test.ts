import { describe, expect, it } from 'vitest';
import {
  adminResourceReducer,
  createAdminResourceState,
  resolveAdminResourceErrorMessage,
} from './adminResourceState';

describe('adminResourceReducer', () => {
  it('starts loading and clears a previous error', () => {
    const prev = createAdminResourceState<string>({
      status: 'error',
      errorMessage: 'old',
      data: null,
    });

    const next = adminResourceReducer(prev, { type: 'load_start' });

    expect(next).toEqual({
      status: 'loading',
      data: null,
      errorMessage: null,
    });
  });

  it('stores data on success', () => {
    const prev = createAdminResourceState<number>({ status: 'loading' });

    const next = adminResourceReducer(prev, { type: 'load_success', data: 42 });

    expect(next).toEqual({
      status: 'success',
      data: 42,
      errorMessage: null,
    });
  });

  it('keeps prior data on error so retries can show stale context', () => {
    const prev = createAdminResourceState<string>({
      status: 'success',
      data: 'cached',
    });

    const next = adminResourceReducer(prev, {
      type: 'load_error',
      message: 'Could not load services.',
    });

    expect(next).toEqual({
      status: 'error',
      data: 'cached',
      errorMessage: 'Could not load services.',
    });
  });

  it('resets to idle', () => {
    const prev = createAdminResourceState<string>({
      status: 'success',
      data: 'x',
    });

    expect(adminResourceReducer(prev, { type: 'reset' })).toEqual({
      status: 'idle',
      data: null,
      errorMessage: null,
    });
  });
});

describe('resolveAdminResourceErrorMessage', () => {
  it('prefers the API message when present', () => {
    expect(resolveAdminResourceErrorMessage('  Index missing  ', 'services')).toBe('Index missing');
  });

  it('falls back to a section label message', () => {
    expect(resolveAdminResourceErrorMessage(undefined, 'services')).toBe(
      'Could not load services.'
    );
    expect(resolveAdminResourceErrorMessage('   ', 'portfolio')).toBe('Could not load portfolio.');
  });
});
