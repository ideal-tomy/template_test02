"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { appTemplateConfig } from "@/lib/app-template-config";
import { unreadDemoMessageCount } from "@/lib/demo-messages";
import { DemoFab } from "@/components/demo-fab";
import { templateNavIcons } from "@/components/template-nav-icons";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const unread = unreadDemoMessageCount();
  const { branding, shell } = appTemplateConfig;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold text-primary-alt">
              {branding.productName}
            </span>
            {branding.badgeLabel ? (
              <Badge variant="ai" className="hidden sm:inline-flex">
                {branding.badgeLabel}
              </Badge>
            ) : null}
          </Link>
          <nav className="hidden md:flex flex-1 items-center justify-center gap-1 overflow-x-auto">
            {shell.topNav.map(({ href, label, icon }) => {
              const Icon = templateNavIcons[icon];
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                    active
                      ? "bg-surface text-primary"
                      : "text-muted hover:text-foreground hover:bg-surface/80"
                  )}
                >
                  <Icon className="size-4 shrink-0 opacity-80" />
                  {label}
                </Link>
              );
            })}
          </nav>
          {shell.showMessagesLink ? (
            <Link
              href="/messages"
              className="relative flex items-center gap-1 rounded-lg p-2 text-muted hover:bg-surface hover:text-foreground"
              aria-label="メッセージ"
            >
              <MessageSquare className="size-5" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          ) : (
            <div className="w-10 shrink-0" aria-hidden />
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 md:pb-8">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-safe backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {shell.bottomNav.map(({ href, label, icon }) => {
            const Icon = templateNavIcons[icon];
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted"
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {shell.showDemoFab ? <DemoFab /> : null}
    </div>
  );
}
