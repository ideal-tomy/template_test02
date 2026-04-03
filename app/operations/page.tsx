import Link from "next/link";
import { FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OperationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">実務・収益</h1>
        <p className="mt-1 text-sm text-muted">
          書類・数値へのショートカット（デモ）
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/documents" className="block">
          <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="size-6 text-primary" />
                書類・OCR
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              生成ステータス、書類不備候補、OCR デモへ
            </CardContent>
          </Card>
        </Link>
        <Link href="/revenue" className="block">
          <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="size-6 text-primary" />
                収益・LTV
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
