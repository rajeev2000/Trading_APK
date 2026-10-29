import { createClient } from 'npm:@supabase/supabase-js@2';

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  if (leftBytes.length !== rightBytes.length) return false;
  let mismatch = 0;
  for (let i = 0; i < leftBytes.length; i += 1) mismatch |= leftBytes[i] ^ rightBytes[i];
  return mismatch === 0;
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);

  const expectedSecret = Deno.env.get('MONITOR_SECRET');
  const suppliedSecret = request.headers.get('x-monitor-secret');
  if (!expectedSecret || !suppliedSecret || !constantTimeEqual(suppliedSecret, expectedSecret)) {
    return jsonResponse({ error: 'UNAUTHORIZED' }, 401);
  }

  const projectUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!projectUrl || !serviceRoleKey) return jsonResponse({ error: 'SERVER_CONFIGURATION_ERROR' }, 500);

  const admin = createClient(projectUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: activeStrategies, error } = await admin
    .from('strategies')
    .select('id, user_id, version')
    .eq('status', 'active')
    .limit(500);

  if (error) return jsonResponse({ error: 'STRATEGY_QUERY_FAILED' }, 500);
  if (!activeStrategies?.length) {
    return jsonResponse({ status: 'no_active_strategies', scanned: 0 });
  }

  // The scaffold records a clear insufficient-data state until a market-data provider,
  // evaluator, and approved AI integration are selected and implemented. It never invents matches.
  const now = new Date().toISOString();
  const runRows = activeStrategies.map((strategy) => ({
    user_id: strategy.user_id,
    strategy_id: strategy.id,
    strategy_version: strategy.version,
    status: 'insufficient_data',
    started_at: now,
    completed_at: now,
    details: {
      reason: 'MARKET_DATA_PROVIDER_NOT_CONFIGURED',
      message: 'No strategy evaluation was performed. Configure a data provider and evaluator first.',
    },
  }));

  const { error: insertError } = await admin.from('monitor_runs').insert(runRows);
  if (insertError) return jsonResponse({ error: 'MONITOR_RUN_WRITE_FAILED' }, 500);

  return jsonResponse({
    status: 'provider_not_configured',
    scanned: 0,
    runRecordsWritten: runRows.length,
    message: 'Recorded insufficient-data outcomes. No signals, trades, or notifications were created.',
  }, 202);
});
