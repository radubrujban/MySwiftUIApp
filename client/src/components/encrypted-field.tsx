import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EncryptedFieldProps {
  label: string;
  value: string | null;
  sensitive?: boolean;
  className?: string;
}

export default function EncryptedField({ label, value, sensitive = false, className = "" }: EncryptedFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!value) {
    return (
      <div className={`space-y-1 ${className}`}>
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        <div className="text-sm text-muted-foreground">Not provided</div>
      </div>
    );
  }

  const displayValue = sensitive && !isVisible ? "••••••••••" : value;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          {sensitive && <Lock className="h-3 w-3" />}
          {label}
        </label>
        {sensitive && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              AES-256
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(!isVisible)}
              className="h-6 w-6 p-0"
            >
              {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
        )}
      </div>
      <div className="text-sm font-mono bg-muted/30 px-2 py-1 rounded border">
        {displayValue}
      </div>
    </div>
  );
}