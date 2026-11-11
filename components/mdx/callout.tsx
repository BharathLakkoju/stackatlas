import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Callout({
  title = "Note",
  type = "note",
  children,
}: {
  title?: string;
  type?: "note" | "warn" | "tip";
  children: React.ReactNode;
}) {
  return (
    <Alert className="not-prose my-6">
      <AlertTitle>
        {type === "warn" ? "Watch out" : type === "tip" ? "Tip" : title}
      </AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
