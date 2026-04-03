import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary-alt">ナレッジ AI</h1>
        <p className="mt-1 text-sm text-muted">
          本番では pgvector + Edge Functions でチャット検索（デモはプレースホルダ）
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-5 text-primary" />
            Coming soon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted">
          <p>
            入管不交付理由や寮トラブル事例を、過去 PDF から RAG で回答する想定です。
          </p>
          <p>
            営業デモでは{" "}
            <Link href="/messages" className="text-primary underline">
              メッセージ翻訳
            </Link>{" "}
            と{" "}
            <Link href="/matching" className="text-primary underline">
              マッチング理由
            </Link>{" "}
            を併用してください。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
