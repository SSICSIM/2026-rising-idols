"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddButtons } from "@/components/AddButtonsContext";
import { useMisc } from "@/hooks/useMisc";
import { cn } from "@/lib/utils";
import { GroupSettingsDialog } from "./GroupSettingsDialog";

const TABS = [
  { href: "/weverse", label: "Posts" },
  { href: "/weverse/notice", label: "Notice" },
  { href: "/weverse/shop", label: "Shop" },
];

export function WeverseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { showAddButtons } = useAddButtons();
  const { data: misc } = useMisc();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="page-shell space-y-6">
      <section
        className="bg-muted relative flex h-40 items-end justify-between overflow-hidden rounded-md bg-cover bg-center p-6 sm:h-52"
        style={misc?.header_image ? { backgroundImage: `url("${misc.header_image}")` } : undefined}
      >
        <h1 className="text-4xl font-black tracking-tight uppercase sm:text-6xl">
          {misc?.group_name || "Group Name"}
        </h1>
        <div className="flex items-center gap-2">
          {showAddButtons && (
            <Button
              variant="outline"
              size="sm"
              className="bg-background/90"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="mr-2 h-3.5 w-3.5" />
              Group settings
            </Button>
          )}
          <nav className="bg-background/90 flex overflow-hidden rounded-md border text-xs">
            {TABS.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "px-3 py-1.5 transition-colors",
                    active ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
      {children}
      <GroupSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} misc={misc} />
    </main>
  );
}
