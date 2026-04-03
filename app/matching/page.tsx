import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clients, getMatchesForClient } from "@/lib/demo-data";

export default function MatchingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">マッチング</h1>
        <p className="mt-1 text-sm text-muted">
          案件ごとの上位候補と AI 理由（デモロジック）
        </p>
      </div>
      <div className="space-y-8">
        {clients.map((cl) => {
          const top = getMatchesForClient(cl.id).slice(0, 3);
          return (
            <Card key={cl.id}>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">
                  <Link
                    href={`/clients/${cl.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {cl.tradeNameJa}
                  </Link>
                </CardTitle>
                <Badge variant="ai">
                  <Sparkles className="mr-1 size-3" />
                  AI
                </Badge>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {top.map(({ candidate, pct, reason }) => (
                    <li
                      key={candidate.id}
                      className="rounded-lg border border-border p-3 text-sm"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <Link
                          href={`/candidates/${candidate.id}`}
                          className="font-medium text-primary"
                        >
                          {candidate.displayName}
                        </Link>
                        <span className="font-bold text-primary">{pct}%</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        {reason}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
