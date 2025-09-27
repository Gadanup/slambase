"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Calendar,
  Swords,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview & stats",
  },
  {
    name: "Wrestlers",
    href: "/admin/wrestlers",
    icon: Users,
    description: "Manage roster",
  },
  {
    name: "Championships",
    href: "/admin/championships",
    icon: Trophy,
    description: "Manage titles",
  },
  {
    name: "Events",
    href: "/admin/events",
    icon: Calendar,
    description: "Manage shows",
  },
  {
    name: "Feuds",
    href: "/admin/feuds",
    icon: Swords,
    description: "Manage storylines",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 transition-transform bg-dark-900 border-r border-dark-800",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-dark-800">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="font-display text-2xl text-primary-500 group-hover:text-primary-400 transition-colors">
              SlamBase
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "group flex items-center justify-between px-3 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-primary-600 text-white shadow-glow"
                    : "text-dark-300 hover:bg-dark-800 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p
                      className={cn(
                        "text-xs transition-colors",
                        isActive
                          ? "text-primary-100"
                          : "text-dark-500 group-hover:text-dark-400"
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-800">
          <div className="px-3 py-2 bg-dark-800 rounded-lg">
            <p className="text-xs font-medium text-dark-400">Admin Portal</p>
            <p className="text-xs text-dark-500 mt-0.5">Version 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
