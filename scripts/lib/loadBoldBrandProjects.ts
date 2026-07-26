import { readFileSync, writeFileSync, mkdtempSync } from 'fs';
import { join, resolve, dirname, basename } from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BBS_ROOT = resolve(__dirname, '../../../bold-brand-studio');
const PROJECTS_FILE = join(BBS_ROOT, 'src/data/projects.ts');

export type LoadedBoldBrandProject = Record<string, unknown> & {
  slug: string;
  title: string;
};

/**
 * Loads bold-brand-studio/src/data/projects.ts without Vite — resolves @/assets imports to
 * absolute local file paths so the migration can upload them to R2.
 */
export async function loadBoldBrandProjects(): Promise<LoadedBoldBrandProject[]> {
  const source = readFileSync(PROJECTS_FILE, 'utf8');
  const importMap = new Map<string, string>();

  const importRegex = /import\s+(\w+)\s+from\s+["']@\/([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(source)) !== null) {
    const [, varName, relPath] = match;
    importMap.set(varName, join(BBS_ROOT, 'src', relPath));
  }

  const constDecls = [...importMap.entries()]
    .map(([name, filePath]) => `const ${name} = ${JSON.stringify(filePath)};`)
    .join('\n');

  const projectsStart = source.indexOf('export const projects');
  if (projectsStart === -1) {
    throw new Error('Could not find export const projects in bold-brand-studio projects.ts');
  }

  let body = source.slice(projectsStart);
  body = body.replace(/export const projects[^=]*=\s*/, 'const projects = ');

  const fnStart = body.search(/export function getProject/);
  if (fnStart !== -1) {
    body = body.slice(0, fnStart);
  }

  const script = `${constDecls}\n${body}\nmodule.exports = { projects };`;
  const tmpDir = mkdtempSync(join(tmpdir(), 'bbs-migrate-'));
  const tmpFile = join(tmpDir, 'projects.cjs');
  writeFileSync(tmpFile, script, 'utf8');

  const mod = await import(pathToFileURL(tmpFile).href);
  return mod.projects as LoadedBoldBrandProject[];
}

export function collectLocalImagePaths(value: unknown, paths = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    if (value.includes('assets') && (value.endsWith('.png') || value.endsWith('.jpg'))) {
      paths.add(value.replace(/\\/g, '/'));
    }
    return paths;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectLocalImagePaths(item, paths);
    return paths;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectLocalImagePaths(v, paths);
  }
  return paths;
}

export function migrationStorageKey(slug: string, localPath: string): string {
  const folderPrefix = process.env.R2_FOLDER_PREFIX || 'staging-files';
  const fileName = basename(localPath);
  return `${folderPrefix}/portfolio-migration/${slug}/${fileName}`;
}

export { BBS_ROOT, PROJECTS_FILE };
