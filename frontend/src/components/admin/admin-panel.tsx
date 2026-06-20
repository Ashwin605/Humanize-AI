"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, FileText, TrendingUp, Activity, Shield } from "lucide-react";
import { api, AdminDashboard } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminPanel() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Users", value: data?.totalUsers ?? 0, icon: Users },
    { label: "Documents", value: data?.totalDocuments ?? 0, icon: FileText },
    { label: "Active Subscriptions", value: data?.activeSubscriptions ?? 0, icon: TrendingUp },
    { label: "Usage Today", value: data?.usageToday ?? 0, icon: Activity },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <Shield className="h-7 w-7 text-gold-500" />
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">System management and analytics</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{loading ? "—" : formatNumber(stat.value as number)}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-gold-500/50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium">{data?.systemHealth || "Checking..."}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Total words processed: {formatNumber(data?.totalWords ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Users</CardTitle></CardHeader>
          <CardContent>
            {data?.recentUsers?.length ? (
              <div className="space-y-2">
                {data.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                      {user.subscription?.plan || "FREE"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No users yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
