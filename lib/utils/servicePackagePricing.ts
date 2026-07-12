import type { IServicePackage, IServicePackagePricing } from '@/app/_server/lib/types/constants';

export function formatPackageIdLabel(id: string): string {
  return id
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function getPackageDisplayTitle(pkg: Pick<IServicePackage, 'id' | 'title'>): string {
  const title = pkg.title?.trim();
  return title || formatPackageIdLabel(pkg.id);
}

export function getPricingCategoryTitle(
  category: Pick<IServicePackagePricing, 'id' | 'title'>
): string {
  const title = category.title?.trim();
  return title || formatPackageIdLabel(category.id);
}

export type PackagePriceLabel =
  | { kind: 'contact' }
  | { kind: 'from'; amountLabel: string }
  | { kind: 'range'; amountLabel: string };

export function getPackagePriceLabel(priceRange: number[] | undefined): PackagePriceLabel {
  const minPrice = priceRange?.[0];
  const maxPrice = priceRange?.[1];

  if (minPrice == null || Number.isNaN(minPrice)) {
    return { kind: 'contact' };
  }

  const formatAmount = (amount: number) => amount.toLocaleString('en-NG');

  if (maxPrice == null || maxPrice === minPrice) {
    return { kind: 'from', amountLabel: formatAmount(minPrice) };
  }

  return {
    kind: 'range',
    amountLabel: `${formatAmount(minPrice)} – ${formatAmount(maxPrice)}`,
  };
}

export function getPricingGridClassName(packageCount: number): string {
  if (packageCount <= 1) return 'grid gap-6 grid-cols-1';
  if (packageCount === 2) return 'grid gap-6 grid-cols-1 sm:grid-cols-2';
  if (packageCount === 3) return 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
}

export function isPackageFeatured(
  pkg: Pick<IServicePackage, 'isFeatured'>,
  packageIndex: number
): boolean {
  if (pkg.isFeatured === true) return true;
  if (pkg.isFeatured === false) return false;

  return packageIndex === 1;
}
