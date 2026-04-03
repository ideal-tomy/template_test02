"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GitBranch, Search } from "lucide-react";
import type { Candidate, JlptLevel } from "@data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { candidates, getPipelineCounts } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const jlptOptions: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const fn = () => setMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [breakpoint]);
  return mobile;
}

function statusBadgeVariant(
  s: Candidate["pipelineStatus"]
): "default" | "success" | "warning" | "danger" {
  if (s === "document_blocked") return "danger";
  if (s === "document_prep" || s === "training") return "warning";
  if (s === "offer_accepted" || s === "awaiting_entry") return "success";
  return "default";
}

export function CandidatesSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const defaultTab = view === "pipeline" ? "pipeline" : "list";
  const [tab, setTab] = useState(defaultTab);
  const [q, setQ] = useState("");
  const [jlpt, setJlpt] = useState<JlptLevel | "all">("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [preview, setPreview] = useState<Candidate | null>(null);
  const isMobile = useMobile();

  useEffect(() => {
    setTab(view === "pipeline" ? "pipeline" : "list");
  }, [view]);

  const pipeline = getPipelineCounts();

  const pipelineLabelJa: Record<Candidate["pipelineStatus"], string> = {
    awaiting_entry: "入国待ち",
    interview_coordination: "面接調整",
    training: "講習中",
    offer_accepted: "内定済",
    visa_applying: "ビザ申請中",
    document_blocked: "書類不備",
    document_prep: "書類準備中",
  };

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return candidates.filter((c) => {
      const jlptOk = jlpt === "all" || c.jlpt === jlpt;
      if (!jlptOk) return false;
      if (!t) return true;
      const hay = [
        c.displayName,
        c.legalNameFull,
        c.backgroundSummary,
        ...c.skillTags,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(t);
    });
  }, [q, jlpt]);

  function openCandidate(c: Candidate) {
    if (isMobile) {
      setPreview(c);
      setSheetOpen(true);
    } else {
      router.push(`/candidates/${c.id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">候補者</h1>
        <p className="mt-1 text-sm text-muted">
          {candidates.length} 名のデモデータ — スマホはタップでクイック表示
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="list" className="flex-1">
            一覧
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex-1">
            <GitBranch className="mr-1 size-4" />
            パイプライン
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(
              Object.entries(pipeline) as [
                Candidate["pipelineStatus"],
                number,
              ][]
            ).map(([key, n]) => (
              <Card key={key}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted">{pipelineLabelJa[key]}</p>
                  <p className="text-2xl font-bold tabular-nums">{n}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <Input
                placeholder="氏名・スキル・軍経験 などで検索"
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
              value={jlpt}
              onChange={(e) =>
                setJlpt(e.target.value as JlptLevel | "all")
              }
            >
              <option value="all">JLPT すべて</option>
              {jlptOptions.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openCandidate(c)}
                className={cn(
                  "text-left transition-all hover:shadow-md rounded-xl border border-border bg-card p-4",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                )}
              >
                <div className="flex gap-3">
                  <Image
                    src={c.photoUrl}
                    alt=""
                    width={56}
                    height={56}
                    className="rounded-full bg-surface shrink-0"
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{c.displayName}</p>
                    <p className="text-xs text-muted">
                      {c.nationality} · {c.jlpt}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="ai">AI {c.aiScore}</Badge>
                      <Badge variant={statusBadgeVariant(c.pipelineStatus)}>
                        {c.pipelineStatusLabelJa}
                      </Badge>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent title="候補者サマリー">
          {preview && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Image
                  src={preview.photoUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="rounded-full bg-surface"
                  unoptimized
                />
                <div>
                  <p className="text-lg font-semibold">{preview.displayName}</p>
                  <p className="text-sm text-muted">{preview.jlpt}</p>
                </div>
              </div>
              <p className="text-sm">{preview.backgroundSummary}</p>
              <Separator />
              <Button asChild className="w-full">
                <Link href={`/candidates/${preview.id}`}>詳しく見る</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
