/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Lazy @react-email/render with a React 19 compatibility shim for Turbopack.
 */

function setupReactCompatibility() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react');

    if (React && !React.version) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const reactPackage = require('react/package.json');
        if (reactPackage?.version) {
          Object.defineProperty(React, 'version', {
            value: reactPackage.version,
            writable: false,
            enumerable: true,
            configurable: false,
          });
        }
      } catch {
        Object.defineProperty(React, 'version', {
          value: '19.0.0',
          writable: false,
          enumerable: true,
          configurable: false,
        });
      }
    }

    return React;
  } catch (error) {
    throw new Error(`React is not available: ${error}`);
  }
}

function getRenderFunction() {
  try {
    setupReactCompatibility();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const renderModule = require('@react-email/render');
    return renderModule.render || renderModule.default || renderModule;
  } catch (error) {
    throw new Error(`Failed to load @react-email/render: ${error}`);
  }
}

export async function renderEmailComponent(component: any): Promise<string> {
  const render = getRenderFunction();
  return await render(component);
}
