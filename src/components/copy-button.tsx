import { useState } from "react";
// UTILS
import { cn } from "@/lib/utils";
// UI
import { Button } from "@/components/ui/button";
// ICONS
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

export const CopyButton = ({ textToCopy, className }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn(className)}
      title="Copy listing ID"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="size-4.5 text-green-500" />
      ) : (
        <Copy className="size-4.5" />
      )}
    </Button>
  );
};
