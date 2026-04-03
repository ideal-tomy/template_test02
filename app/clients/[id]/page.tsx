import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getClientById,
  getMatchesForClient,
} from "@/lib/demo-data";

type Props = { params: Promise<{ id: string }> };

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params;
  const client = getClientById(id);
  if (!client) notFound();

  const matches = getMatchesForClient(client.id);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
        <Link href="/clients">
          <ArrowLeft className="size-4" />
          クライアント一覧
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">
          {client.legalNameJa}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {client.industryJa} · {client.prefectureJa}
          {client.cityJa}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">社風・環境</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>{client.cultureJa}</p>
            <p className="text-muted">{client.workplaceEnvironmentJa}</p>
            {client.currentChallengesJa && (
              <p className="text-warning text-xs">{client.currentChallengesJa}</p>
            )}
            {client.representative && (
              <p className="text-xs text-muted">
                代表: {client.representative.nameJa}{" "}
                {client.representative.age ? `（${client.representative.age}歳）` : ""}{" "}
                — {client.representative.noteJa}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">募集・稼働</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{client.recruitmentJa}</p>
            <Separator />
            <dl className="grid grid-cols-2 gap-2">
              <div>
                <dt className="text-muted text-xs">稼働中</dt>
                <dd className="font-semibold">
                  {client.operations.currentAssignees} 名
                </dd>
              </div>
              <div>
                <dt className="text-muted text-xs">欠員枠</dt>
                <dd className="font-semibold text-warning">
                  {client.operations.openSlots} 名
                </dd>
              </div>
              <div>
                <dt className="text-muted text-xs">定着率</dt>
                <dd>{client.operations.retentionRatePct}%</dd>
              </div>
              <div>
                <dt className="text-muted text-xs">満足度</dt>
                <dd>{client.operations.satisfactionScore} / 5</dd>
              </div>
            </dl>
            {client.ltMonthlyProfitPerHeadJpy != null && (
              <p className="text-xs text-muted">
                LTV 目安: 1 人あたり月{" "}
                {client.ltMonthlyProfitPerHeadJpy.toLocaleString()} 円（デモ値）
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-5 text-primary" />
            AI おすすめ候補（デモ）
          </CardTitle>
          <Badge variant="ai">タグ照合</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted">
            AI推奨ターゲット: {client.aiTargetProfileJa}
          </p>
          <ul className="space-y-4">
            {matches.map(({ candidate, pct, reason }, i) => (
              <li
                key={candidate.id}
                className="rounded-lg border border-border bg-surface/50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/candidates/${candidate.id}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {i + 1}. {candidate.displayName}
                  </Link>
                  <span className="text-lg font-bold tabular-nums text-primary">
                    {pct}%
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{reason}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
