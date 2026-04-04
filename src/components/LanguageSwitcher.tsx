import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage, LANGUAGE_OPTIONS } from "@/hooks/useLanguage";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as typeof language)}>
      <SelectTrigger className={compact ? "w-[52px] h-8 px-2" : "w-[140px] h-9"}>
        {compact ? (
          <Globe className="h-4 w-4 text-muted-foreground" />
        ) : (
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue />
          </div>
        )}
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map((opt) => (
          <SelectItem key={opt.code} value={opt.code}>
            <span className="flex items-center gap-2">
              <span>{opt.nativeLabel}</span>
              {opt.code !== "en" && (
                <span className="text-muted-foreground text-xs">({opt.label})</span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
