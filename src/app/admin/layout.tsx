// app/admin/layout.tsx - With client-side protection backup
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AdminUser } from "@/lib/types";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoginPage = pathname === "/admin/login";

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Show message from URL params (from middleware redirects)
  useEffect(() => {
    const message = searchParams.get("message");
    if (message && isLoginPage) {
      toast.error("Access Denied", {
        description: message,
      });
    }
  }, [searchParams, isLoginPage]);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      setAuthChecked(true);
      return;
    }

    // Client-side protection for dashboard routes
    const checkAuth = async () => {
      const supabase = createClient();

      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        console.log("🔍 Client-side auth check:", {
          hasUser: !!user,
          error: userError?.message,
        });

        // No user - redirect to login immediately
        if (!user || userError) {
          console.log("❌ Client-side: No user, redirecting to login");
          router.push(
            "/admin/login?message=Please login to access admin dashboard"
          );
          return;
        }

        // Check admin status
        const { data: adminData, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log("👑 Client-side admin check:", {
          isAdmin: !!adminData,
          error: adminError?.message,
        });

        // Not an admin - redirect to login
        if (!adminData || adminError) {
          console.log("❌ Client-side: Not an admin, redirecting to login");
          router.push("/admin/login?message=Admin access required");
          return;
        }

        // Success - set admin user data
        setAdminUser(adminData);
      } catch (error) {
        console.error("Client-side auth error:", error);
        router.push("/admin/login?message=Authentication error occurred");
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [isLoginPage, router]);

  // For login page, render without sidebar and header
  if (isLoginPage) {
    return <div className="min-h-screen bg-gradient-dark">{children}</div>;
  }

  // For dashboard pages, show loading state while checking auth
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="animate-pulse">
          <div className="text-primary-500 text-lg">Verifying access...</div>
        </div>
      </div>
    );
  }

  // If we don't have admin user data, something went wrong - don't render
  if (!adminUser) {
    return null; // Will redirect via useEffect
  }

  // For all other admin pages, render with full layout
  return (
    <div className="min-h-screen bg-gradient-dark">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader adminUser={adminUser} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
