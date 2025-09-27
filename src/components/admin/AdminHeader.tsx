import { AdminUser } from "@/lib/types";
import { LogoutButton } from "./LogoutButton";

interface AdminHeaderProps {
  adminUser: AdminUser;
}

export function AdminHeader({ adminUser }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-sm border-b border-dark-800">
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Spacer for mobile menu button */}
        <div className="lg:hidden w-12" />

        {/* User info */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-dark-200">
              {adminUser.email}
            </p>
            <p className="text-xs text-dark-500 capitalize">
              {adminUser.role.replace("_", " ")}
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
