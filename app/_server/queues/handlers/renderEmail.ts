/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Isolated email renderer module
 * This file is kept separate to prevent Next.js/Turbopack from analyzing
 * @react-email/render during build time, which causes React 19 compatibility issues
 */

// Use require at runtime to prevent build-time analysis

function getRenderFunction() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const renderModule = require('@react-email/render');
    return renderModule.render || renderModule.default || renderModule;
  } catch (error) {
    throw new Error(`Failed to load @react-email/render: ${error}`);
  }
}

/**
 * Render a React email component to HTML string
 * This function loads @react-email/render only when called, not at module load time
 */
export async function renderEmailComponent(component: any): Promise<string> {
  const render = getRenderFunction();
  return await render(component);
}
