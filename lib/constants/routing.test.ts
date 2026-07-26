import { describe, expect, it } from 'vitest';
import { safeAdminRedirectPath } from './admin-routing';
import { sidebarLinksData } from './routing';

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

describe('sidebarLinksData CMS groups', () => {
  const groupNames = () => sidebarLinksData.map(group => group.groupName);

  const hrefsIn = (groupName: string) => {
    const group = sidebarLinksData.find(g => g.groupName === groupName);
    return (group?.links ?? []).map(link =>
      link.path ? `${link.path.prefix}${link.path.suffix}` : link.page
    );
  };

  it('includes Portfolio CMS and Crelyst CMS groups', () => {
    expect(groupNames()).toEqual(['Main', 'Portfolio CMS', 'Crelyst CMS', 'System']);
  });

  it('moves BBS projects under Portfolio CMS and adds About/Contact routes', () => {
    expect(hrefsIn('Main')).not.toContain('/admin/dashboard/portfolio');
    expect(hrefsIn('Portfolio CMS')).toEqual([
      '/admin/dashboard/portfolio',
      '/admin/dashboard/portfolio-about',
      '/admin/dashboard/portfolio-contact',
    ]);
  });

  it('adds Crelyst About under Crelyst CMS only', () => {
    expect(hrefsIn('Crelyst CMS')).toEqual(['/admin/dashboard/about-content']);
  });
});
