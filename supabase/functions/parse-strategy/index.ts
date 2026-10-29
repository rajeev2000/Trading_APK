// Strategy parser placeholder. Do not activate strategies from model output alone.
// Implement after the approved AI provider, schema and billing/consent path are selected.
Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405 });
  }
  return new Response(JSON.stringify({
    status: 'not_configured',
    message: 'Strategy parsing requires an approved AI provider and a validated StrategySpec.',
  }), { status: 501, headers: { 'Content-Type': 'application/json' } });
});
