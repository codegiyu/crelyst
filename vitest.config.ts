import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['**/*.test.ts'],
          exclude: ['**/*.integration.test.ts', 'node_modules/**', '.next/**'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          environment: 'node',
          include: ['**/*.integration.test.ts'],
          exclude: ['node_modules/**', '.next/**'],
        },
      },
    ],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
