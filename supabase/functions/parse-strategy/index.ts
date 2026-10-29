import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'METHOD_NOT_ALLOWED' }, 405);

  const authorization = request.headers.get('Authorization');
  const projectUrl = Deno.env.get('SUPABASE_URL');
  const publishableKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization || !projectUrl || !publishableKey) {
    return jsonResponse({ error: 'AUTH_REQUIRED' }, 401);
  }

  const userClient = createClient(projectUrl, publishableKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return jsonResponse({ error: 'AUTH_REQUIRED' }, 401);

  // Fail closed until the product has an approved AI authorization and billing path.
  // Do not replace this with ChatGPT cookie scraping or expose provider tokens to the app.
  return jsonResponse({
    error: 'AI_PROVIDER_NOT_CONFIGURED',
    message: 'Strategy parsing is not enabled yet. Configure an approved AI provider and server-side credentials before activation.',
  }, 503);
});
