"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { useAuthState } from "@/lib/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function TestAuthPage() {
  const { user, adminUser, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-dark">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display text-display-md text-primary-500">
              Auth Test Page
            </h1>
            <p className="text-dark-400">Testing authentication flow</p>
          </div>
          {user && <LogoutButton />}
        </div>

        <Card className="bg-dark-900 border-dark-800">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current user and admin status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-dark-300">
                Supabase User:
              </p>
              {user ? (
                <div className="p-3 bg-dark-800 rounded-md space-y-1">
                  <p className="text-sm font-mono text-secondary-400">
                    ID: {user.id}
                  </p>
                  <p className="text-sm font-mono text-secondary-400">
                    Email: {user.email}
                  </p>
                  <Badge className="bg-green-600">Authenticated</Badge>
                </div>
              ) : (
                <Badge className="bg-red-600">Not Authenticated</Badge>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-dark-300">Admin User:</p>
              {adminUser ? (
                <div className="p-3 bg-dark-800 rounded-md space-y-1">
                  <p className="text-sm font-mono text-secondary-400">
                    Email: {adminUser.email}
                  </p>
                  <p className="text-sm font-mono text-secondary-400">
                    Role: {adminUser.role}
                  </p>
                  <Badge className="bg-secondary-600 text-dark-950">
                    Admin Access
                  </Badge>
                </div>
              ) : (
                <Badge className="bg-red-600">No Admin Access</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
