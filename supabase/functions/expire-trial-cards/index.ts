// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Environment variables for service role key and URL
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

console.log("Hello from Functions!")

Deno.serve(async (_req) => {
  // Find users whose trial has expired
  const { data: expiredUsers, error: userError } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('status', 'trial')
    .lt('trial_end', new Date().toISOString())

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 500 })
  }

  if (!expiredUsers || expiredUsers.length === 0) {
    return new Response(JSON.stringify({ message: 'No expired trial users found.' }), { status: 200 })
  }

  const userIds = expiredUsers.map(u => u.user_id)

  // Take all their cards offline
  const { data: updated, error: updateError } = await supabase
    .from('digital_cards')
    .update({ is_public: false })
    .in('user_id', userIds)
    .eq('is_public', true)
    .select('id')

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ message: `Set ${updated?.length ?? 0} cards offline for expired trial users.` }), { status: 200 })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/expire-trial-cards' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
