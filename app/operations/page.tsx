import Link from "next/link";
import { FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIndustryProfile } from "@/lib/industry-profiles";
import {
  getIndustryFromSearchParams,
  withIndustryQuery,
} from "@/lib/industry-selection";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OperationsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const industry = getIndustryFromSearchParams(resolvedSearchParams);
  const profile = getIndustryProfile(industry);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">
          {profile.labels.operations}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {profile.operationsDescription}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href={withIndustryQuery("/documents", industry)} className="block">
          <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="size-6 text-primary" />
                {profile.labels.documents}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              生成ステータス、書類不備候補、OCR デモへ
            </CardContent>
          </Card>
        </Link>
        <Link href={withIndustryQuery("/revenue", industry)} className="block">
          <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="size-6 text-primary" />
                {profile.labels.revenue}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              月次グラフ、回収・リスクのダミー表示へ
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
