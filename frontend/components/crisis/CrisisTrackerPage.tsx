"use client";

import { useShowPreviousPeriods } from "@/components/ShowPreviousPeriodsContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActivePeriod } from "@/hooks/useCrisisPeriods";
import { ActiveNotesTab } from "./ActiveNotesTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { ArchiveTab } from "./ArchiveTab";
import { PeriodBanner } from "./PeriodBanner";

export function CrisisTrackerPage() {
  const { data: activePeriod } = useActivePeriod();
  const { showPreviousPeriods, setShowPreviousPeriods } = useShowPreviousPeriods();

  return (
    <main className="page-shell space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Crisis Tracker</h1>
        <p className="text-muted-foreground text-sm">
          Track directives and crisis notes for this committee session.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="show-previous-periods"
          checked={showPreviousPeriods}
          onCheckedChange={setShowPreviousPeriods}
        />
        <Label htmlFor="show-previous-periods">Show posts, notices and shop items from previous periods</Label>
      </div>

      <PeriodBanner />

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Notes</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          <ActiveNotesTab activePeriodId={activePeriod?.id ?? null} />
        </TabsContent>

        <TabsContent value="archive" className="mt-0">
          <ArchiveTab />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <AnalyticsTab defaultPeriodId={activePeriod?.id ?? null} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
