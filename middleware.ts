// Root middleware.ts - More aggressive protection
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./src/lib/supabase/middleware";
import { createClient } from "./src/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  console.log("🔥 MIDDLEWARE START:", path);

  // Skip non-admin routes entirely
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  try {
    // Update session first
    const response = await updateSession(request);

    const isLoginPage = path === "/admin/login";

    // Create Supabase client
    const supabase = await createClient();

    // Get current user - this is the critical check
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("👤 Auth Status:", {
      hasUser: !!user,
      userEmail: user?.email || "none",
      error: userError?.message || "none",
      path: path,
    });

    // LOGIN PAGE LOGIC
    if (isLoginPage) {
      // If user is authenticated, check if they're admin
      if (user && !userError) {
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .single();

        // Admin user trying to access login - redirect to dashboard
        if (adminUser) {
          console.log("✅ Admin at login page, redirecting to dashboard");
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        }
      }

      // Not admin or not authenticated - allow login page
      console.log("✅ Allowing login page access");
      return response;
    }

    // PROTECTED ADMIN ROUTES LOGIC
    // If no user or auth error - BLOCK ACCESS
    if (!user || userError) {
      console.log("❌ BLOCKING - No authenticated user for:", path);
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set(
        "message",
        "Please login to access admin dashboard"
      );
      return NextResponse.redirect(loginUrl);
    }

    // Check admin privileges
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("id, role")
      .eq("id", user.id)
      .single();

    console.log("👑 Admin Check:", {
      isAdmin: !!adminUser,
      error: adminError?.message || "none",
    });

    // If not admin - BLOCK ACCESS
    if (!adminUser || adminError) {
      console.log("❌ BLOCKING - Not an admin for:", path);
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("message", "Admin access required");
      return NextResponse.redirect(loginUrl);
    }

    // All checks passed - allow access
    console.log("✅ ALLOWING admin access to:", path);
    return response;
  } catch (error) {
    console.error("💥 Middleware Error:", error);
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("message", "Authentication error occurred");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match admin routes specifically
     */
    "/admin/:path*",
  ],
};
