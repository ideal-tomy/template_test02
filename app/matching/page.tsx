import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIndustryDemoData } from "@/lib/demo-data-selector";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MatchingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);
  const data = getIndustryDemoData(industry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">
          {profile.labels.matching}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {profile.matchingDescription}
        </p>
      </div>
      <div className="space-y-8">
        {data.clients.map((cl) => {
          const top = data.getMatchesForClient(cl.id).slice(0, 3);
          return (
            <Card key={cl.id}>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">
                  <Link
                    href={withIndustryQuery(`/clients/${cl.id}`, industry)}
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
                          href={withIndustryQuery(
                            `/candidates/${candidate.id}`,
                            industry
                          )}
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
