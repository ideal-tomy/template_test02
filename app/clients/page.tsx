import Link from "next/link";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clients } from "@/lib/demo-data";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">案件・クライアント</h1>
        <p className="mt-1 text-sm text-muted">派遣先 {clients.length} 社（デモ）</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {clients.map((c) => (
          <Link key={c.id} href={`/clients/${c.id}`} className="group block">
            <Card className="h-full transition-all group-hover:border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start gap-2 text-base">
                  <Building2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="leading-snug">{c.tradeNameJa}</span>
                </CardTitle>
                <p className="text-xs text-muted">
                  {c.industryJa} / {c.prefectureJa}
                  {c.cityJa ? ` ${c.cityJa}` : ""}
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="line-clamp-2 text-muted">{c.cultureJa}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="warning">空き {c.operations.openSlots}</Badge>
                  <Badge variant="secondary">
                    稼働 {c.operations.currentAssignees}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
