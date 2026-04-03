"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { candidates, countDocumentAlerts } from "@/lib/demo-data";

export default function DocumentsPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const alerts = countDocumentAlerts();

  function runScan() {
    setOpen(true);
    setLoading(true);
    toast.info("OCR 処理中…（デモ）");
    setTimeout(() => {
      setLoading(false);
      toast.success("抽出完了（デモ）");
    }, 1000);
  }

  const blocked = candidates.filter((c) => c.pipelineStatus === "document_blocked");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">書類管理</h1>
        <p className="mt-1 text-sm text-muted">
          ステータスサマリーと OCR デモ（API なし）
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={runScan} className="gap-2">
          <ScanLine className="size-4" />
          パスポート OCR（デモ）
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/candidates?view=pipeline">書類トラブル候補を見る</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">生成完了</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <Badge variant="success" className="mt-2">
              デモ値
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">要確認</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <Badge variant="warning" className="mt-2">
              翻訳・校正
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">要フォロー</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-danger">{alerts}</p>
            <Badge variant="danger" className="mt-2">
              書類系ステータス
            </Badge>
          </CardContent>
        </Card>
      </div>

      {blocked.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-5" />
              書類不備の候補
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {blocked.map((c) => (
              <Link
                key={c.id}
                href={`/candidates/${c.id}`}
                className="block rounded-lg border border-border p-3 text-sm hover:bg-surface"
              >
                <span className="font-medium">{c.displayName}</span>
                {c.documentAlertJa && (
                  <p className="text-xs text-danger">{c.documentAlertJa}</p>
                )}
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Sheet open={open} onOpenChange={(o) => {
        setOpen(o);
        if (!o) setLoading(false);
      }}>
        <SheetContent title="OCR 結果">
          {loading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p className="font-semibold">サンプル: Nuwan Kumara</p>
              <ul className="list-inside list-disc text-muted">
                <li>氏名: Pathirana Gamage Nuwan Kumara</li>
                <li>生年月日: 1998-04-15</li>
                <li>パスポート: N1234567 / 2030-05-10</li>
              </ul>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
