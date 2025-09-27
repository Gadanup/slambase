import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./src/lib/supabase/middleware";
import { createClient } from "./src/lib/supabase/server";

export async function middleware(request: NextRequest) {
  // Update session (refresh token if needed)
  const response = await updateSession(request);

  // Get the pathname
  const path = request.nextUrl.pathname;

  // Check if trying to access admin routes
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // No user or error - redirect to login
    if (error || !user) {
      const redirectUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user is an admin
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single();

    // Not an admin - redirect to login
    if (!adminUser) {
      const redirectUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (path === "/admin/login") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (adminUser) {
        const redirectUrl = new URL("/admin/dashboard", request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
