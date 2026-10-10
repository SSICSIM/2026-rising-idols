"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CharacterManagerDialog } from "@/components/crisis/CharacterManagerDialog";
import { useAddButtons } from "@/components/AddButtonsContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/transactions", label: "Transactions", activeClass: "bg-[#D99A0B] text-white" },
  { href: "/weverse", label: "Weverse", activeClass: "bg-[#E8714F] text-white" },
];

export function Navbar() {
  const [charOpen, setCharOpen] = useState(false);
  const pathname = usePathname();
  const { showAddButtons, setShowAddButtons } = useAddButtons();

  return (
    <>
      <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Crisis Tracker
            </Link>
            <nav className="flex items-center gap-1">
              {LINKS.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      active ? link.activeClass : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="show-add-buttons" checked={showAddButtons} onCheckedChange={setShowAddButtons} />
              <Label htmlFor="show-add-buttons" className="text-sm">
                Add buttons
              </Label>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCharOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              Characters
            </Button>
          </div>
        </div>
      </header>
      <CharacterManagerDialog open={charOpen} onOpenChange={setCharOpen} />
    </>
  );
}
