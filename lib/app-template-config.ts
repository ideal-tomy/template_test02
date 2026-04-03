import {
  defaultIndustryKey,
  getIndustryProfile,
} from "@/lib/industry-profiles";

const defaultProfile = getIndustryProfile(defaultIndustryKey);

/**
 * アプリ全体の「テンプレート設定」— 別デモ・別業種に差し替える主入口。
 * 派遣デモの文言・ナビはここを編集するか、別ファイルにコピーして import を差し替える。
 */

/** ナビで使う Lucide アイコン名（components/template-nav-icons.tsx と一致させる） */
export type TemplateNavIconName =
  | "LayoutDashboard"
  | "Users"
  | "Building2"
  | "TrendingUp"
  | "Sparkles"
  | "Home"
  | "MoreHorizontal"
  | "ClipboardList"
  | "FileText"
  | "GitBranch"
  | "Clock"
  | "MessageSquare";

export type TemplateNavItem = {
  href: string;
  label: string;
  icon: TemplateNavIconName;
};

export const appTemplateConfig = {
  branding: {
    productName: defaultProfile.productName,
    /** ヘッダー横バッジ。不要なら null */
    badgeLabel: defaultProfile.badgeLabel as string | null,
    metadata: {
      title: defaultProfile.metadataTitle,
      description: defaultProfile.metadataDescription,
    },
  },

  /** トップダッシュ（/）のコピー */
  dashboard: {
    pageTitle: defaultProfile.dashboardTitle,
    pageSubtitle: defaultProfile.dashboardSubtitle,
    /**
     * メインカード群の列数（PC 想定）。3 = 従来の 3×2＋拡張行、4 = 1行4枚を優先。
     */
    gridColumns: 3 as 3 | 4,
    /** 拡張枠カードの表示（勤怠・請求 / 社内ナレッジ） */
    extensionCards: {
      attendanceBilling: true,
      knowledgeAi: true,
    },
  },

  /** シェル周り */
  shell: {
    topNav: [
      { href: "/", label: "ダッシュボード", icon: "LayoutDashboard" },
      { href: "/candidates", label: "候補者", icon: "Users" },
      { href: "/clients", label: "案件", icon: "Building2" },
      { href: "/operations", label: "実務・収益", icon: "TrendingUp" },
      { href: "/knowledge", label: "ナレッジ", icon: "Sparkles" },
    ] satisfies TemplateNavItem[],
    bottomNav: [
      { href: "/", label: "Home", icon: "Home" },
      { href: "/candidates", label: "候補者", icon: "Users" },
      { href: "/clients", label: "案件", icon: "Building2" },
      { href: "/revenue", label: "収益", icon: "TrendingUp" },
      { href: "/more", label: "その他", icon: "MoreHorizontal" },
    ] satisfies TemplateNavItem[],
    /** メッセージ（ベル）リンク */
    showMessagesLink: true,
    /** 右下 FAB（OCR デモ等） */
    showDemoFab: true,
  },
} as const;

export type AppTemplateConfig = typeof appTemplateConfig;

/** ダッシュボードグリッド用 Tailwind クラス */
export function dashboardGridClass(columns: 3 | 4): string {
  if (columns === 3) {
    return "grid min-w-0 grid-cols-3 items-stretch gap-1.5 md:gap-4 xl:gap-6";
  }
  return "grid min-w-0 grid-cols-3 md:grid-cols-4 items-stretch gap-1.5 md:gap-4 xl:gap-6";
}

/** 拡張枠（勤怠・ナレッジ）の列スパン */
export function dashboardExtensionSpanClass(
  slot: "attendance" | "knowledge",
  columns: 3 | 4
): string {
  if (columns === 3) {
    return slot === "attendance" ? "col-span-1" : "col-span-2";
  }
  /* 4列: 狭い画面は従来どおり 1+2、md 以上で下段を半々 */
  return slot === "attendance"
    ? "col-span-1 md:col-span-2"
    : "col-span-2 md:col-span-2";
}
