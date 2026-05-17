/** When true, motion blocks render in their revealed state (e.g. route loading UI). */
export function shouldRevealMotion(siteLoading: boolean, immediate?: boolean) {
  return Boolean(immediate || !siteLoading);
}
