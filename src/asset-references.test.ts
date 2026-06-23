import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe('asset references', () => {
  it('every /assets/* path referenced in src and index.html exists in public/assets', () => {
    const files = [...walk('src').filter((f) => /\.(tsx?|css)$/.test(f)), 'index.html'];
    const re = /\/assets\/([\w.-]+\.[a-z0-9]+)/gi;
    const missing: string[] = [];

    for (const f of files) {
      const content = readFileSync(f, 'utf8');
      for (const m of content.matchAll(re)) {
        const asset = m[1];
        if (!existsSync(join('public/assets', asset))) {
          missing.push(`${asset} (referenced in ${f})`);
        }
      }
    }

    expect(missing).toEqual([]);
  });
});
