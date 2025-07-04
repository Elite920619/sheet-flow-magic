
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const oddsApiKey = Deno.env.get("ODDS_API_KEY")
    
    console.log('Environment check:', {
      hasOddsApiKey: !!oddsApiKey,
      keyLength: oddsApiKey?.length || 0,
      keyPreview: oddsApiKey ? `${oddsApiKey.substring(0, 8)}...` : 'none'
    })
    
    if (!oddsApiKey || oddsApiKey.trim() === '') {
      console.error('ODDS_API_KEY not found or empty in environment variables')
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        apiKey: 'demo',
        message: 'Configure ODDS_API_KEY in Supabase secrets for live data' 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Validate API key format (basic check)
    if (oddsApiKey.length < 20) {
      console.error('ODDS_API_KEY appears to be invalid (too short)')
      return new Response(JSON.stringify({ 
        error: 'Invalid API key format',
        apiKey: 'demo',
        message: 'API key appears to be invalid' 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    console.log('Successfully retrieved valid ODDS_API_KEY:', `${oddsApiKey.substring(0, 8)}...`)
    
    return new Response(JSON.stringify({ 
      apiKey: oddsApiKey,
      status: 'success',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error('Unexpected error in odds-api-key function:', {
      error: error.message,
      stack: error.stack
    })
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message,
      apiKey: 'demo'
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
