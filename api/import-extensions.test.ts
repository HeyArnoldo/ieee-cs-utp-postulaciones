import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const API_DIR = join(__dirname, '.');

function getApiFiles(): string[] {
  return readdirSync(API_DIR)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'))
    .map(f => join(API_DIR, f));
}

function getRelativeImports(content: string): string[] {
  const importRegex = /(?:import|export)\s+(?:[\w\s{},*]+\s+from\s+)?['"](\.[^'"]+)['"]/g;
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = importRegex.exec(content)) !== null) {
    matches.push(m[1]);
  }
  return matches;
}

describe('api relative imports must have .js extension', () => {
  const files = getApiFiles();

  it('should find at least one api file to check', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('all relative imports end with .js', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const relativeImports = getRelativeImports(content);
      for (const imp of relativeImports) {
        if (!imp.endsWith('.js')) {
          offenders.push(`${file}: "${imp}" — missing .js extension`);
        }
      }
    }
    expect(offenders, `Relative imports missing .js extension:\n${offenders.join('\n')}`).toHaveLength(0);
  });
});
