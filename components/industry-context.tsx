"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  defaultIndustryKey,
  parseEnabledIndustryKey,
  type EnabledIndustryKey,
} from "@/lib/industry-profiles";
import { getIndustryFromSearchParams } from "@/lib/industry-selection";
import { readStoredIndustry, writeStoredIndustry } from "@/lib/industry-storage";

type IndustryContextValue = {
  industry: EnabledIndustryKey;
  setIndustry: (key: EnabledIndustryKey) => void;
};

const IndustryContext = createContext<IndustryContextValue | null>(null);

export function useIndustry(): IndustryContextValue {
  const v = useContext(IndustryContext);
  if (!v) {
    throw new Error("useIndustry must be used within IndustryProvider");
  }
  return v;
}

export function IndustryProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const industry = useMemo(
    () => getIndustryFromSearchParams(searchParams),
    [searchParams]
  );

  /** URL に industry が無いとき、localStorage を URL に反映（サーバーと一致させる） */
  useEffect(() => {
    const current = searchParams.get("industry");
    if (current) {
      writeStoredIndustry(parseEnabledIndustryKey(current));
      return;
    }
    const stored = readStoredIndustry();
    if (stored && stored !== defaultIndustryKey) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("industry", stored);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }
  }, [pathname, router, searchParams]);

  const setIndustry = useCallback(
    (key: EnabledIndustryKey) => {
      writeStoredIndustry(key);
      const params = new URLSearchParams(searchParams.toString());
      params.set("industry", key);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
      router.refresh();
    },
    [pathname, router, searchParams]
  );

  const value = useMemo(
    () => ({ industry, setIndustry }),
    [industry, setIndustry]
  );

  return (
    <IndustryContext.Provider value={value}>{children}</IndustryContext.Provider>
  );
}
