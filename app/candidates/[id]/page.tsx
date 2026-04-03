import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCandidateById, getClientById, scoreCandidateForClient } from "@/lib/demo-data";

type Props = { params: Promise<{ id: string }> };

export default async function CandidateDetailPage({ params }: Props) {
  const { id } = await params;
  const c = getCandidateById(id);
  if (!c) notFound();

  const assigned = c.plannedAssignment
    ? getClientById(c.plannedAssignment.clientId)
    : undefined;
  const match = assigned
    ? scoreCandidateForClient(c, assigned)
    : null;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link href="/candidates">
          <ArrowLeft className="size-4" />
          候補者一覧
        </Link>
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Image
          src={c.photoUrl}
          alt=""
          width={120}
          height={120}
          className="rounded-2xl border border-border bg-surface"
          unoptimized
        />
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-semibold text-primary-alt">
            {c.displayName}
          </h1>
          <p className="text-sm text-muted">
            {c.legalNameFull} / {c.nameKatakana}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="ai">
              <Sparkles className="mr-1 size-3" />
              AI {c.aiScore}
            </Badge>
            <Badge>{c.pipelineStatusLabelJa}</Badge>
            <Badge variant="secondary">{c.jlpt}</Badge>
          </div>
          {c.aiScoreRationale && (
            <p className="text-sm text-muted">{c.aiScoreRationale}</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="flex w-full flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="basic">基本情報</TabsTrigger>
          <TabsTrigger value="docs">書類</TabsTrigger>
          <TabsTrigger value="history">派遣履歴・評価</TabsTrigger>
          <TabsTrigger value="ai">AI 分析</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">プロフィール</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <dl className="grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-muted">年齢 / 性別</dt>
                  <dd>
                    {c.age} / {c.gender === "male" ? "男性" : "女性"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">国籍</dt>
                  <dd>{c.nationality}</dd>
                </div>
                <div>
                  <dt className="text-muted">居住地</dt>
                  <dd>
                    {c.residence.country} {c.residence.city}{" "}
                    {c.residence.note ? `（${c.residence.note}）` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">連絡先</dt>
                  <dd className="break-all">{c.contact.email}</dd>
                </div>
              </dl>
              <div>
                <p className="text-muted">背景</p>
                <p>{c.backgroundSummary}</p>
              </div>
              <div>
                <p className="text-muted">学歴・職歴</p>
                <p>{c.educationWorkHistory}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {c.skillTags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">書類・在留</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted">パスポート</span>{" "}
                {c.passportNumber} / 有効期限 {c.passportExpiry}
              </p>
              <p>
                <span className="text-muted">COE</span> {c.coeStatusJa}
              </p>
              {c.documentAlertJa && (
                <p className="text-danger font-medium">{c.documentAlertJa}</p>
              )}
              <p className="text-muted text-xs">
                OCR デモ: ダッシュボード右下 FAB からサンプル抽出を表示できます。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">派遣履歴・評価（デモ）</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              本番では placements テーブルから表示。デモでは未配属または予定のみ表示します。
              {c.plannedAssignment && assigned && (
                <div className="mt-4 rounded-lg border border-border bg-surface p-4 text-foreground">
                  <p className="font-medium">{assigned.tradeNameJa}</p>
                  <p>{c.plannedAssignment.jobTitleJa}</p>
                  <p className="text-muted">
                    月給 {c.plannedAssignment.monthlySalaryJpy.toLocaleString()} 円（想定）
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI マッチング示唆</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {assigned && match ? (
                <>
                  <p>
                    <span className="font-semibold">{assigned.tradeNameJa}</span> との適合
                    目安:{" "}
                    <span className="text-lg font-bold text-primary">
                      {match.pct}%
                    </span>
                  </p>
                  <p className="leading-relaxed text-muted">{match.reason}</p>
                </>
              ) : (
                <p className="text-muted">
                  配属予定クライアントが未設定のため、マッチング画面で案件別の提案をご覧ください。
                </p>
              )}
              <p className="text-xs text-muted">
                    動画レジュメ解析・離職リスクは本番 AI 連携で拡張予定（デモは静的テキスト）。
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
