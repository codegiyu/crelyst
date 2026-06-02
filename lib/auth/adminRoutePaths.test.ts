import { describe, expect, it } from 'vitest';
import {
  ADMIN_LOGIN_PATH,
  buildAdminLoginUrl,
  isAdminDashboardPath,
  isAdminUnprotectedPath,
  sanitizeAdminRedirectPath,
} from './adminRoutePaths';

describe('adminRoutePaths', () => {
  it('detects unprotected admin auth routes', () => {
    expect(isAdminUnprotectedPath('/admin/auth/login')).toBe(true);
    expect(isAdminUnprotectedPath('/admin/dashboard/home')).toBe(false);
  });

  it('detects dashboard paths', () => {
    expect(isAdminDashboardPath('/admin/dashboard')).toBe(true);
    expect(isAdminDashboardPath('/admin/dashboard/settings')).toBe(true);
    expect(isAdminDashboardPath('/admin/auth/login')).toBe(false);
  });

  it('sanitizes redirect targets to /admin only', () => {
    expect(sanitizeAdminRedirectPath('/admin/dashboard/home')).toBe('/admin/dashboard/home');
    expect(sanitizeAdminRedirectPath('//evil.com')).toBeNull();
    expect(sanitizeAdminRedirectPath('/public')).toBeNull();
    expect(sanitizeAdminRedirectPath(null)).toBeNull();
  });

  it('builds login URLs with encoded redirectTo', () => {
    expect(buildAdminLoginUrl(null)).toBe(ADMIN_LOGIN_PATH);
    expect(buildAdminLoginUrl('/admin/dashboard/home')).toBe(
      `${ADMIN_LOGIN_PATH}?redirectTo=%2Fadmin%2Fdashboard%2Fhome`
    );
    expect(buildAdminLoginUrl('//evil')).toBe(ADMIN_LOGIN_PATH);
  });
});
