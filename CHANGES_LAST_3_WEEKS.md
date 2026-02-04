# Changes Documentation - Last 3 Weeks

This document summarizes all significant changes made in the last three weeks, with special focus on Redis, React-Email, and package.json modifications. These changes can be applied to similar projects.

## Table of Contents
1. [Package.json Changes](#packagejson-changes)
2. [Redis Configuration Updates](#redis-configuration-updates)
3. [React-Email Compatibility Fixes](#react-email-compatibility-fixes)
4. [Dockerfile Updates](#dockerfile-updates)
5. [Next.js Configuration](#nextjs-configuration)
6. [Implementation Guide](#implementation-guide)

---

## Package.json Changes

### Dependencies Updated

#### React-Email Packages
- **`@react-email/components`**: Updated from `^0.5.6` to `^1.0.2`
- **`react-email`**: Updated from `^4.3.0` to `^5.1.0`

**Reason**: React-Email v5.x includes better React 19 compatibility, though some workarounds are still needed.

#### TypeScript
- **`typescript`**: Moved from `devDependencies` to `dependencies` (version `^5`)

**Reason**: TypeScript is required at runtime for certain build processes and should be available in production.

#### New Dependencies Added
- `@dnd-kit/core`: `^6.3.1`
- `@dnd-kit/sortable`: `^10.0.0`
- `@dnd-kit/utilities`: `^3.2.2`

**Reason**: Added for drag-and-drop functionality in admin interfaces.

### Installation Commands

```bash
npm install @react-email/components@^1.0.2 react-email@^5.1.0
npm install typescript@^5 --save  # Move from devDeps to deps
npm install @dnd-kit/core@^6.3.1 @dnd-kit/sortable@^10.0.0 @dnd-kit/utilities@^3.2.2
```

---

## Redis Configuration Updates

### Key Changes in `app/_server/lib/utils/redis.ts`

#### 1. Global Variable Declaration
**Before**: Module-level variable
```typescript
let _redisCache: IORedis | null = null;
```

**After**: Global variable with TypeScript declaration
```typescript
declare global {
  var _redisCache: IORedis | undefined;
}
```

**Reason**: Prevents Next.js hot reload from creating multiple Redis instances during development.

#### 2. Redis Connection Configuration
**Before**:
```typescript
const redisInstance = new IORedis(ENVIRONMENT.REDIS.URL, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  offlineQueue: false,
  retryStrategy: times => { /* ... */ }
});
```

**After**:
```typescript
const redisInstance = new IORedis(ENVIRONMENT.REDIS.URL, {
  enableOfflineQueue: true, // REQUIRED for BullMQ
  maxRetriesPerRequest: null, // BullMQ requirement
  retryStrategy(times) {
    if (times >= MAX_RETRIES) {
      logger.error('Unable to connect to Redis after maximum retries');
      return null;
    }
    return RETRY_DELAY_MS;
  },
});
```

**Key Changes**:
- `enableOfflineQueue: true` - **REQUIRED** for BullMQ to work properly
- Changed from arrow function to regular function for `retryStrategy`

#### 3. Global Cache Storage
**Before**: Only stored in development
```typescript
if (process.env.NODE_ENV !== 'production') {
  global._redisCache = redisInstance;
}
```

**After**: Always stored globally
```typescript
// Always set global cache to reuse the same instance across all environments
// This prevents multiple Redis connections during builds and runtime
global._redisCache = redisInstance;
```

**Reason**: Prevents multiple Redis connections during Next.js builds and runtime across all environments.

#### 4. Graceful Shutdown Handler
**Added**: SIGTERM handler for graceful Redis disconnection
```typescript
// Gracefully close Redis connection on SIGTERM
process.on('SIGTERM', async () => {
  const redisInstance = global._redisCache;
  if (redisInstance) {
    await redisInstance.quit();
    logger.info('Redis disconnected on SIGTERM');
  }
});
```

### Implementation Checklist for Redis Changes

- [ ] Update global variable declaration
- [ ] Change `enableOfflineQueue` to `true`
- [ ] Update `retryStrategy` to regular function syntax
- [ ] Store Redis instance in global for all environments
- [ ] Add SIGTERM handler for graceful shutdown
- [ ] Update `disconnectRedis()` function to use global variable

---

## React-Email Compatibility Fixes

### Problem
React-Email v5.x has compatibility issues with React 19, particularly:
1. `@react-email/render` tries to access `React.version` in a way incompatible with React 19
2. Next.js/Turbopack analyzes `@react-email/render` during build time, causing build failures
3. Email rendering fails at runtime due to React version detection issues

### Solution Overview
1. **Isolated Render Module**: Created separate `renderEmail.ts` file
2. **Lazy Loading**: Use `require()` instead of `import` to prevent build-time analysis
3. **React Compatibility Shim**: Added workaround for React.version access
4. **Next.js Configuration**: Externalized `@react-email/render` in webpack config
5. **Worker Lazy Loading**: Defer worker initialization to avoid build-time imports

### Detailed Changes

#### 1. Created `app/_server/queues/handlers/renderEmail.ts`

This isolated module handles email rendering with React 19 compatibility:

```typescript
// React 19 compatibility shim
function setupReactCompatibility() {
  try {
    const React = require('react');
    
    // Ensure React.version exists and is accessible
    if (React && !React.version) {
      try {
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
    throw new Error(`React is not available: ${error}`);
  }
}

function getRenderFunction() {
  try {
    // Set up React compatibility before loading @react-email/render
    setupReactCompatibility();
    
    // Use require() to prevent build-time analysis
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
```

#### 2. Updated `app/_server/queues/handlers/sendEmail.ts`

**Key Changes**:
- Lazy-load email templates using dynamic imports
- Use isolated `renderEmailComponent` function
- All email sending logic is currently **commented out** due to React 19 compatibility issues

**Current Status**: Email sending is temporarily disabled. The code structure is preserved with comments indicating what needs to be restored when React-Email fully supports React 19.

#### 3. Updated `app/_server/queues/workers/index.ts`

**Before**: Direct import and worker creation
```typescript
import { sendEmail } from '../handlers/sendEmail';

export const mainWorker = new Worker<JobData>('mainQueue', async (job: Job) => {
  // ...
  return await sendEmail(job);
}, mainWorkerOptions);
```

**After**: Lazy worker creation with dynamic imports
```typescript
// Lazy-load sendEmail to avoid importing @react-email/render at module load time
let _mainWorker: Worker<JobData> | null = null;

function createWorker(): Worker<JobData> {
  if (_mainWorker) {
    return _mainWorker;
  }

  _mainWorker = new Worker<JobData>('mainQueue', async (job: Job) => {
    switch (type as JOB_TYPE) {
      case 'verificationCode':
      case 'resetPassword':
      case 'notificationEmail':
      case 'inviteAdmin': {
        // Lazy-load sendEmail to avoid React 19 compatibility issues during build
        const { sendEmail } = await import('../handlers/sendEmail');
        return await sendEmail(job);
      }
      // ...
    }
  }, mainWorkerOptions);

  return _mainWorker;
}

export function getMainWorker(): Worker<JobData> {
  return createWorker();
}
```

#### 4. Updated `app/_server/queues/index.ts`

**Before**: Direct import
```typescript
import { mainWorker } from './workers';
```

**After**: Lazy loading
```typescript
// Lazy-load worker to avoid importing @react-email/render at module load time
async function getMainWorker() {
  const workerModule = await import('./workers');
  return workerModule.getMainWorker();
}

export const startQueues = async () => {
  await mainQueue.waitUntilReady();
  const mainWorker = await getMainWorker();
  await mainWorker.waitUntilReady();
  // ...
};
```

### Implementation Checklist for React-Email Changes

- [ ] Create `renderEmail.ts` with React 19 compatibility shim
- [ ] Update `sendEmail.ts` to use lazy template loading
- [ ] Update worker to lazy-load `sendEmail` handler
- [ ] Update queue initialization to lazy-load worker
- [ ] Update Next.js config (see below)
- [ ] Test email rendering in development
- [ ] Test email rendering in production build

---

## Next.js Configuration

### Changes in `next.config.ts`

Added configuration to externalize `@react-email/render` and prevent build-time analysis:

```typescript
const nextConfig: NextConfig = {
  // ... existing config ...
  
  // Mark @react-email/render as external to prevent build-time analysis
  // This avoids React 19 compatibility issues during build
  serverExternalPackages: ['@react-email/render'],
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize @react-email/render for server bundle to avoid React 19 compatibility issues
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('@react-email/render');
      } else {
        config.externals = [config.externals, '@react-email/render'];
      }
    }
    return config;
  },
  
  experimental: {
    // Ensure server components can use external packages
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};
```

**Key Points**:
- `serverExternalPackages`: Tells Next.js not to bundle this package
- `webpack.externals`: Externalizes the package in server-side webpack bundle
- `experimental.serverActions`: Ensures server components can use external packages

---

## Dockerfile Updates

### Changes

**Before**:
```dockerfile
FROM node:20-alpine AS base
# ...
FROM node:20-alpine AS runner
```

**After**:
```dockerfile
FROM node:20-slim AS base
# ...
FROM node:20-slim AS runner
```

**Reason**: 
- `node:20-slim` is smaller and sufficient for the application
- Alpine can sometimes cause compatibility issues with native dependencies
- Slim images are more compatible with various npm packages

### Full Dockerfile Structure

```dockerfile
# ---- Base Stage ----
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./

# Install dependencies (only production deps for speed)
RUN npm ci --include=dev

# ---- Build Stage ----
FROM base AS builder
COPY . .
# Build Next.js app
RUN npm run build

# ---- Production Stage ----
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy only required output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./

# Next.js needs its standalone server
RUN npm install next

EXPOSE 3009
ENV PORT=3009

CMD ["npm", "run", "start"]
```

---

## Implementation Guide

### Step-by-Step Application to Similar Projects

#### Phase 1: Package Updates
1. Update `package.json` dependencies:
   ```bash
   npm install @react-email/components@^1.0.2 react-email@^5.1.0
   npm install typescript@^5 --save
   ```

2. Verify all dependencies install correctly:
   ```bash
   npm install
   ```

#### Phase 2: Redis Configuration
1. Update `app/_server/lib/utils/redis.ts`:
   - Add global variable declaration
   - Change `enableOfflineQueue` to `true`
   - Update `retryStrategy` syntax
   - Store instance in global for all environments
   - Add SIGTERM handler

2. Test Redis connection:
   ```bash
   npm run dev
   # Check logs for "Connected to Main Redis cluster"
   ```

#### Phase 3: React-Email Compatibility
1. Create `app/_server/queues/handlers/renderEmail.ts` with the React 19 compatibility shim

2. Update `app/_server/queues/handlers/sendEmail.ts`:
   - Convert template imports to lazy dynamic imports
   - Use `renderEmailComponent` from isolated module
   - Note: Email sending may be temporarily disabled

3. Update `app/_server/queues/workers/index.ts`:
   - Implement lazy worker creation
   - Use dynamic imports for `sendEmail`
   - Export `getMainWorker()` function

4. Update `app/_server/queues/index.ts`:
   - Use lazy loading for worker initialization

#### Phase 4: Next.js Configuration
1. Update `next.config.ts`:
   - Add `serverExternalPackages`
   - Add webpack externals configuration
   - Add experimental serverActions config

2. Test build:
   ```bash
   npm run build
   # Should complete without React-Email build errors
   ```

#### Phase 5: Dockerfile
1. Update Dockerfile:
   - Change from `node:20-alpine` to `node:20-slim`

2. Test Docker build:
   ```bash
   docker build -t test-image .
   ```

### Testing Checklist

- [ ] Redis connects successfully in development
- [ ] Redis connects successfully in production
- [ ] No multiple Redis connections during hot reload
- [ ] Next.js build completes without errors
- [ ] Email templates can be imported (even if sending is disabled)
- [ ] Worker initializes correctly
- [ ] Docker build succeeds
- [ ] Application starts in Docker container

### Known Issues and Workarounds

#### Issue 1: Email Sending Currently Disabled
**Status**: Email sending is temporarily disabled due to React 19 compatibility issues with `@react-email/render`.

**Workaround**: The code structure is preserved with comments. When React-Email fully supports React 19, uncomment the email sending logic in `sendEmail.ts`.

**Monitoring**: Watch the React-Email repository for React 19 support updates.

#### Issue 2: React Version Detection
**Status**: `@react-email/render` may not correctly detect React 19 version.

**Workaround**: The `setupReactCompatibility()` function in `renderEmail.ts` manually sets `React.version` if it's missing.

### Future Migration Path

When React-Email fully supports React 19:

1. Remove the React compatibility shim from `renderEmail.ts`
2. Uncomment email sending logic in `sendEmail.ts`
3. Test email rendering and sending
4. Consider removing Next.js webpack externals configuration if no longer needed
5. Update this documentation

---

## Summary of Key Takeaways

1. **Redis**: Always use `enableOfflineQueue: true` with BullMQ and store instances globally to prevent multiple connections
2. **React-Email**: Requires lazy loading and React 19 compatibility shims until official support is available
3. **TypeScript**: Should be in `dependencies` if needed at runtime
4. **Docker**: Use `node:20-slim` instead of `alpine` for better compatibility
5. **Next.js**: Externalize problematic packages in webpack config to prevent build-time analysis

---

## Commit History Reference

- `5b2f223` - fix: bunch of fixes relating to redis and react-email
- `6cf8970` - fix: connections to react-email in the code commented out
- `ded5a84` - fix: more react-email vs react19 compatibility issues wahala being debugged
- `ac0667d` - fix: typescript moved to main deps and slim used instead of alpine in Dockerfile
- `a000f60` - fix: react-email build issue handled
- `8b26fbe` - feat: bunch of updates? (includes Redis improvements)

---

## Additional Notes

- All changes maintain backward compatibility where possible
- Code is structured to make future migrations easier
- Comments in code indicate what needs to be restored when dependencies are updated
- The project uses Next.js 16 with Turbopack
- React 19.2.0 is being used

---

*Last Updated: Based on commits from the last 3 weeks (as of December 2025)*
