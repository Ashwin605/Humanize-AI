"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText, Plus, TrendingUp, Clock, Sparkles, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { api, DashboardStats, Document } from "@/lib/api";
import { formatDate, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";

export function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch {
      setStats({
        totalDocuments: 0,
        totalWords: 0,
        enhancedDocuments: 0,
        recentDocuments: [],
        usageByDay: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const statCards = [
    { label: "Total Documents", value: stats?.totalDocuments ?? 0, icon: FileText },
    { label: "Words Processed", value: formatNumber(stats?.totalWords ?? 0), icon: TrendingUp },
    { label: "Enhanced", value: stats?.enhancedDocuments ?? 0, icon: Sparkles },
    { label: "Recent Activity", value: stats?.usageByDay?.length ?? 0, icon: Clock },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Your legal writing workspace overview</p>
        </div>
        <Link href="/dashboard/documents/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-gold-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Documents</CardTitle>
            <Link href="/dashboard/documents">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-secondary animate-pulse" />
                ))}
              </div>
            ) : stats?.recentDocuments?.length ? (
              <div className="space-y-2">
                {stats.recentDocuments.map((doc: Document) => (
                  <Link
                    key={doc.id}
                    href={`/dashboard/documents/${doc.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-4 w-4 text-gold-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium truncate group-hover:text-gold-500 transition-colors">
                          {doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doc.wordCount} words · {formatDate(doc.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      doc.status === "ENHANCED"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {doc.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No documents yet</p>
                <Link href="/dashboard/documents/new">
                  <Button variant="outline" size="sm" className="mt-3">Create your first document</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Documents</span>
                <span>{stats?.totalDocuments ?? 0} / 10</span>
              </div>
              <ProgressBar value={Math.min(100, ((stats?.totalDocuments ?? 0) / 10) * 100)} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Words</span>
                <span>{formatNumber(stats?.totalWords ?? 0)} / 50K</span>
              </div>
              <ProgressBar value={Math.min(100, ((stats?.totalWords ?? 0) / 50000) * 100)} />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Free plan limits. Upgrade to Pro for unlimited access.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
