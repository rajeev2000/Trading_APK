import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const readText = async (path: string) => readFile(new URL(path, root), 'utf8');

test('repository has the core app, roadmap and security files', async () => {
  const pkg = JSON.parse(await readText('package.json')) as { main: string; scripts: Record<string, string> };
  assert.equal(pkg.main, 'expo-router/entry');
  assert.ok(pkg.scripts.typecheck);
  assert.ok(pkg.scripts.test);
  await readText('docs/AGILE_PLAN.md');
  await readText('docs/ARCHITECTURE.md');
  await readText('SECURITY.md');
  await readText('.env.example');
});

test('initial migration enables RLS for user-owned and backend-only tables', async () => {
  const sql = await readText('supabase/migrations/202610290001_initial_schema.sql');
  for (const table of ['profiles', 'paper_sessions', 'ledger_entries', 'strategies', 'monitor_runs', 'signals', 'device_tokens', 'notification_outbox']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
  }
  assert.match(sql, /create_paper_session/i);
  assert.match(sql, /grant execute on function public\.create_paper_session/i);
});

test('client configuration does not contain a server service-role key', async () => {
  const client = await readText('src/lib/supabase.ts');
  assert.doesNotMatch(client, /SUPABASE_SERVICE_ROLE_KEY|service_role/i);
  const envExample = await readText('.env.example');
  assert.doesNotMatch(envExample, /sk-[A-Za-z0-9]{10,}/);
});
