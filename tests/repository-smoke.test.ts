import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('starter documentation and security files exist', () => {
  for (const file of ['README.md', 'docs/ARCHITECTURE.md', 'docs/AGILE_PLAN.md', 'SECURITY.md', 'CONTRIBUTING.md']) {
    assert.equal(existsSync(file), true, file + ' should exist');
  }
});
test('repository documents paper-only boundary', () => {
  const readme = readFileSync('README.md', 'utf8');
  assert.match(readme, /paper trading only/i);
  assert.match(readme, /30 minutes/i);
});
