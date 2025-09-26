// This is just to verify env vars are loaded - we'll delete this later
export function testEnvVars() {
  console.log("Testing environment variables...");
  console.log("URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Anon key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log("Service role exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
}
