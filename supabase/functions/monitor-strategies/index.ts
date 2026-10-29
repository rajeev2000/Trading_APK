// Scheduled monitor scaffold. It deliberately does not create signals until a market-data
// provider and deterministic evaluator are configured and tested.
Deno.serve(async (req) => {
  const expected = Deno.env.get('MONITOR_SECRET');
  const supplied = req.headers.get('x-monitor-secret');
  if (!expected || supplied !== expected) {
    return new Response(JSON.stringify({ status: 'unauthorized' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({
    status: 'insufficient_data',
    message: 'Market-data provider and evaluator are not configured yet.',
    triggered_at: new Date().toISOString(),
  }), { headers: { 'Content-Type': 'application/json' } });
});
