"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIndustry } from "@/components/industry-context";
import {
  enabledIndustryKeys,
  industryOptionLabelJa,
  type EnabledIndustryKey,
} from "@/lib/industry-profiles";

const DEMO_PIN = "1234";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function IndustrySecretModal({ open, onOpenChange }: Props) {
  const { industry, setIndustry } = useIndustry();
  const [step, setStep] = useState<"password" | "select">("password");
  const [pin, setPin] = useState("");
  const [selected, setSelected] = useState<EnabledIndustryKey>(industry);

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim() === DEMO_PIN) {
      setStep("select");
      setSelected(industry);
      return;
    }
    toast.error("コードが違います（デモ）");
  }

  function applyIndustry() {
    setIndustry(selected);
    onOpenChange(false);
    toast.success(
      `${industryOptionLabelJa[selected]} に切り替えました（テンプレ表示）`
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title="業種切替（デモ）">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            営業デモ用の隠し扉です。表示する業種プロファイルを切り替えます。
          </p>

          {step === "password" ? (
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <label className="block text-sm font-medium">
                コード
                <Input
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="4桁"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="mt-1"
                />
              </label>
              <Button type="submit" className="w-full">
                次へ
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                業種
                <select
                  className="mt-1 flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                  value={selected}
                  onChange={(e) =>
                    setSelected(e.target.value as EnabledIndustryKey)
                  }
                >
                  {enabledIndustryKeys.map((key) => (
                    <option key={key} value={key}>
                      {industryOptionLabelJa[key]}
                    </option>
                  ))}
                </select>
              </label>
              <Button type="button" className="w-full" onClick={applyIndustry}>
                この業種に切り替え
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => setStep("password")}
              >
                コード入力に戻る
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
