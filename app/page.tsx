import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Clock,
  FileText,
  GitBranch,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardCandidateCard } from "@/components/dashboard-candidate-card";
import { DashboardMobileCardSlim } from "@/components/dashboard-mobile-card-slim";
import { TemplateDashboardHeader } from "@/components/templates/layout-primitives";
import {
  appTemplateConfig,
  dashboardExtensionSpanClass,
  dashboardGridClass,
} from "@/lib/app-template-config";
import {
  candidates,
  clients,
  countDocumentAlerts,
  countN3OrAbove,
  getPipelineCounts,
  getTopCandidatesByAiScore,
  monthlyRevenueTrend,
  totalOpenSlots,
} from "@/lib/demo-data";

const pipelineOrder = [
  "interview_coordination",
  "offer_accepted",
  "visa_applying",
  "awaiting_entry",
  "training",
  "document_prep",
  "document_blocked",
] as const;

const pipelineLabels: Record<(typeof pipelineOrder)[number], string> = {
  interview_coordination: "面接調整",
  offer_accepted: "内定",
  visa_applying: "ビザ申請",
  awaiting_entry: "入国待ち",
  training: "講習",
  document_prep: "書類準備",
  document_blocked: "書類不備",
};

export default function DashboardPage() {
  const pipeline = getPipelineCounts();
  const totalPipeline = Object.values(pipeline).reduce((a, b) => a + b, 0);
  const top5 = getTopCandidatesByAiScore(5);
  const trend = monthlyRevenueTrend();
  const lastRev = trend[trend.length - 1]?.amountManYen ?? 0;
  const docAlerts = countDocumentAlerts();
  const { dashboard } = appTemplateConfig;
  const gridCols = dashboard.gridColumns;

  return (
    <div className="space-y-6 sm:space-y-8">
      <TemplateDashboardHeader
        title={dashboard.pageTitle}
        subtitle={dashboard.pageSubtitle}
      />

      <div className={dashboardGridClass(gridCols)}>
        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <DashboardCandidateCard
            totalCount={candidates.length}
            n3OrAbove={countN3OrAbove()}
            top5={top5}
          />
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <DashboardMobileCardSlim
            href="/candidates?view=pipeline"
            icon={GitBranch}
            title="選考・ビザ進捗"
            subtitle={`要フォロー（書類）：${docAlerts}件`}
          />
          <Link
            href="/candidates?view=pipeline"
            className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
          >
            <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
              <CardHeader className="shrink-0 p-5 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <GitBranch className="size-5 shrink-0 text-primary" />
                  <span className="leading-tight">選考・ビザ進捗</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-5 pt-0">
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                  <div className="flex h-3 w-full shrink-0 overflow-hidden rounded-full bg-surface">
                    {pipelineOrder.map((key) => {
                      const n = pipeline[key];
                      if (n === 0) return null;
                      const w = Math.max(8, (n / totalPipeline) * 100);
                      return (
                        <div
                          key={key}
                          className="bg-primary/80 first:rounded-l-full last:rounded-r-full"
                          style={{ width: `${w}%` }}
                          title={`${pipelineLabels[key]}: ${n}`}
                        />
                      );
                    })}
                  </div>
                  <ul className="grid min-h-0 flex-1 grid-cols-2 content-start gap-x-2 gap-y-1 text-xs leading-tight text-muted">
                    {pipelineOrder.map((key) => (
                      <li key={key} className="flex justify-between gap-1">
                        <span className="truncate">{pipelineLabels[key]}</span>
                        <span className="shrink-0 font-semibold tabular-nums text-foreground">
                          {pipeline[key]}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {docAlerts > 0 && (
                    <p className="shrink-0 text-xs font-medium text-danger">
                      要フォロー（書類）: {docAlerts} 件
                    </p>
                  )}
                </div>
                <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                  詳細へ <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <DashboardMobileCardSlim
            href="/clients"
            icon={Building2}
            title="クライアント"
            subtitle={`${clients.length}社`}
          />
          <Link
            href="/clients"
            className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
          >
            <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
              <CardHeader className="shrink-0 p-5 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Building2 className="size-5 shrink-0 text-primary" />
                  クライアント
                </CardTitle>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0">
                <div className="flex min-h-0 flex-1 flex-col gap-3">
                  <div className="text-3xl font-bold tabular-nums">
                    {clients.length}
                    <span className="ml-2 text-sm font-normal text-muted">社</span>
                  </div>
                  <p className="text-sm text-muted">
                    欠員枠 合計:{" "}
                    <span className="font-semibold text-warning">
                      {totalOpenSlots()} 名分
                    </span>
                  </p>
                  <ul className="min-h-0 flex-1 space-y-1 text-xs text-muted">
                    {clients.slice(0, 3).map((c) => (
                      <li key={c.id} className="truncate leading-tight">
                        {c.tradeNameJa} — 空き {c.operations.openSlots}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                  一覧へ <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <DashboardMobileCardSlim
            href="/matching"
            icon={ClipboardList}
            title="マッチング"
            subtitle="AI生成候補"
          />
          <Link
            href="/matching"
            className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
          >
            <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
              <CardHeader className="flex shrink-0 flex-row items-start justify-between space-y-0 p-5 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ClipboardList className="size-5 shrink-0 text-primary" />
                  マッチング
                </CardTitle>
                <Badge variant="ai" className="shrink-0 text-xs">
                  AI
                </Badge>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0 text-sm">
                <div className="flex min-h-0 flex-1 flex-col gap-3">
                  <p className="leading-snug text-muted">
                    丸福惣菜 × Nuwan など、案件別の推奨候補を表示します。
                  </p>
                  <div className="rounded-lg bg-surface p-3 text-xs leading-relaxed text-foreground">
                    「規律重視の現場には軍・警察経験者が適合」— 3行理由つき（デモ）
                  </div>
                </div>
                <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                  提案一覧へ <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <DashboardMobileCardSlim
            href="/documents"
            icon={FileText}
            title="書類作成"
            subtitle="画像で書類作成"
          />
          <Link
            href="/documents"
            className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
          >
            <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
              <CardHeader className="flex shrink-0 flex-row items-start justify-between space-y-0 p-5 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="size-5 shrink-0 text-primary" />
                  書類
                </CardTitle>
                <Badge variant="ai" className="shrink-0 text-xs">
                  OCR
                </Badge>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0">
                <div className="flex min-h-0 flex-1 flex-col gap-3">
                  <p className="text-sm leading-snug text-muted">
                    生成・翻訳ステータス（デモ） / 右下 FAB で OCR 擬似体験
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="success">完了 12</Badge>
                    <Badge variant="warning">要確認 3</Badge>
                    <Badge variant="danger">不備 {docAlerts}</Badge>
                  </div>
                </div>
                <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                  書類管理へ <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <DashboardMobileCardSlim
            href="/revenue"
            icon={TrendingUp}
            title="収益"
            subtitle="売上推移"
          />
          <Link
            href="/revenue"
            className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
          >
            <Card className="flex h-full min-h-0 flex-1 flex-col transition-all group-hover:border-primary/30 group-hover:shadow-md">
              <CardHeader className="flex shrink-0 flex-row items-start justify-between space-y-0 p-5 pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="size-5 shrink-0 text-primary" />
                  収益
                </CardTitle>
                <Badge variant="ai" className="shrink-0 text-xs">
                  LTV
                </Badge>
              </CardHeader>
              <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5 pt-0">
                <div className="flex min-h-0 flex-1 flex-col gap-2">
                  <div className="text-3xl font-bold tabular-nums">
                    {lastRev}
                    <span className="ml-1 text-base font-normal text-muted">
                      万円/月
                    </span>
                  </div>
                  <p className="text-xs leading-snug text-muted">
                    直近月の売上イメージ（ダミー推移）
                  </p>
                </div>
                <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 text-sm font-medium text-primary">
                  収益画面へ <ArrowRight className="size-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {dashboard.extensionCards.attendanceBilling ? (
          <div
            className={`${dashboardExtensionSpanClass("attendance", gridCols)} flex h-full min-h-0 min-w-0 flex-col`}
          >
            <DashboardMobileCardSlim
              href="/operations"
              icon={Clock}
              title="勤怠・請求"
              subtitle="勤怠情報から経費計算連携"
            />
            <Link
              href="/operations"
              className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
            >
              <Card className="flex h-full min-h-0 flex-1 flex-col border-dashed transition-all group-hover:border-primary/40 group-hover:shadow-md">
                <CardHeader className="shrink-0 p-5 pb-2">
                  <CardTitle className="text-base font-semibold">
                    勤怠・請求（拡張枠）
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col p-5 pt-0 text-sm text-muted">
                  <p className="min-h-0 flex-1 leading-snug">
                    CSV 取込イメージ。今回はプレースホルダ — 実務・収益ハブへ
                  </p>
                  <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 font-medium text-primary">
                    開く <ArrowRight className="size-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : null}

        {dashboard.extensionCards.knowledgeAi ? (
          <div
            className={`${dashboardExtensionSpanClass("knowledge", gridCols)} flex h-full min-h-0 min-w-0 flex-col`}
          >
            <DashboardMobileCardSlim
              href="/knowledge"
              icon={Sparkles}
              title="社内ナレッジ"
              subtitle="社内情報管理と共有"
            />
            <Link
              href="/knowledge"
              className="group hidden min-h-0 w-full flex-1 flex-col md:flex"
            >
              <Card className="flex h-full min-h-0 flex-1 flex-col border-dashed transition-all group-hover:border-primary/40 group-hover:shadow-md">
                <CardHeader className="shrink-0 p-5 pb-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Sparkles className="size-5 shrink-0 text-primary" />
                    社内ナレッジ AI（拡張枠）
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col p-5 pt-0 text-sm text-muted">
                  <p className="min-h-0 flex-1 leading-snug">
                    入管トラブル FAQ をチャットで — デモでは概要のみ表示
                  </p>
                  <span className="mt-auto inline-flex shrink-0 items-center gap-1 pt-1 font-medium text-primary">
                    ナレッジへ <ArrowRight className="size-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
