/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Isolated email renderer module
 * This file is kept separate to prevent Next.js/Turbopack from analyzing
 * @react-email/render during build time, which causes React 19 compatibility issues
 */

// React 19 compatibility shim
// @react-email/render tries to access React.version in a way that's incompatible with React 19
function setupReactCompatibility() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react');
    
    // Ensure React.version exists and is accessible
    if (React && !React.version) {
      // React 19 might not expose version the same way
      // Try to get it from the package or set a default
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const reactPackage = require('react/package.json');
        if (reactPackage && reactPackage.version) {
          Object.defineProperty(React, 'version', {
            value: reactPackage.version,
            writable: false,
            enumerable: true,
            configurable: false,
          });
        }
      } catch {
        // Fallback: set a version that @react-email/render might accept
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
    // If React isn't available, that's a bigger problem
    throw new Error(`React is not available: ${error}`);
  }
}

function getRenderFunction() {
  try {
    // Set up React compatibility before loading @react-email/render
    setupReactCompatibility();
    
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a9eb2e23-6629-45c9-a242-faa9256446d5', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: 'renderEmail.ts:24',
      message: 'Before loading render function',
      data: {
        hasComponent: !!component,
        componentType: typeof component,
        reactAvailable: typeof require !== 'undefined',
      },
      timestamp: Date.now(),
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'F',
    }),
  }).catch(() => {});
  // #endregion

  let render: any;
  try {
    render = getRenderFunction();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a9eb2e23-6629-45c9-a242-faa9256446d5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'renderEmail.ts:35',
        message: 'Render function loaded',
        data: {
          renderType: typeof render,
          renderName: render?.name,
          renderKeys: render ? Object.keys(render).slice(0, 10) : [],
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'F',
      }),
    }).catch(() => {});
    // #endregion
  } catch (loadError: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a9eb2e23-6629-45c9-a242-faa9256446d5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'renderEmail.ts:48',
        message: 'Error loading render function',
        data: {
          errorMessage: loadError?.message,
          errorName: loadError?.name,
          errorStack: loadError?.stack?.substring(0, 500),
          errorString: String(loadError),
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'F',
      }),
    }).catch(() => {});
    // #endregion
    throw loadError;
  }

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a9eb2e23-6629-45c9-a242-faa9256446d5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'renderEmail.ts:65',
        message: 'About to call render function',
        data: {
          renderType: typeof render,
          hasComponent: !!component,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'F',
      }),
    }).catch(() => {});
    // #endregion
    const result = await render(component);
    return result;
  } catch (renderError: any) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a9eb2e23-6629-45c9-a242-faa9256446d5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'renderEmail.ts:80',
        message: 'Error calling render function',
        data: {
          errorMessage: renderError?.message,
          errorName: renderError?.name,
          errorStack: renderError?.stack?.substring(0, 1000),
          errorString: String(renderError),
          errorKeys: renderError ? Object.keys(renderError) : [],
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'F',
      }),
    }).catch(() => {});
    // #endregion
    throw renderError;
  }
}
