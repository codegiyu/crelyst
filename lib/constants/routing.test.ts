import { describe, expect, it } from 'vitest';
import { safeAdminRedirectPath } from './admin-routing';

describe('safeAdminRedirectPath', () => {
  it('returns fallback for invalid targets', () => {
    expect(safeAdminRedirectPath(null)).toBe('/admin/dashboard/home');
    expect(safeAdminRedirectPath('//evil')).toBe('/admin/dashboard/home');
    expect(safeAdminRedirectPath('/about')).toBe('/admin/dashboard/home');
  });

  it('allows valid admin paths', () => {
    expect(safeAdminRedirectPath('/admin/dashboard/settings')).toBe('/admin/dashboard/settings');
  });
});
