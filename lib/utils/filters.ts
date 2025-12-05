/**
 * Filters items by category with support for "all" category
 * @param items - Array of items with category property
 * @param category - Category to filter by (use "all" to return all items)
 * @returns Filtered array of items
 */
export function filterByCategory<T extends { category: string }>(
  items: T[],
  category: string
): T[] {
  if (category === 'all') {
    return items;
  }

  return items.filter(item => item.category === category);
}

/**
 * Filters items by multiple criteria
 * @param items - Array of items
 * @param filters - Object with filter functions for each property
 * @returns Filtered array of items
 */
export function filterByMultiple<T>(
  items: T[],
  filters: {
    [K in keyof T]?: (value: T[K], item: T) => boolean;
  }
): T[] {
  return items.filter(item => {
    return (Object.keys(filters) as Array<keyof T>).every(key => {
      const filterFn = filters[key];
      if (!filterFn) return true;

      const value = item[key];
      return filterFn(value, item);
    });
  });
}

/**
 * Generic filter function with custom predicate
 * @param items - Array of items
 * @param predicate - Filter function
 * @returns Filtered array
 */
export function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
  return items.filter(predicate);
}
