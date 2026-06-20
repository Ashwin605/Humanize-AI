"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/sidebar";
import { api, Citation } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function CitationsPage() {
  const [citations, setCitations] = useState<Citation[]>([]);

  useEffect(() => {
    api.getCitations().then(setCitations).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <h1 className="font-display text-2xl font-bold">Citation Manager</h1>
        <div className="space-y-3">
          {citations.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{c.title}</h3>
                    <p className="text-sm font-mono text-muted-foreground mt-1">{c.citation}</p>
                    {c.notes && <p className="text-xs text-muted-foreground mt-2">{c.notes}</p>}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gold-500/10 text-gold-600">{c.format}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {!citations.length && (
            <p className="text-muted-foreground text-center py-8">No citations saved yet.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
