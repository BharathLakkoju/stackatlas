import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function NotFound() {
  return (
    <div>
      <PageHeader title="Page not in the graph" description="That URL is not a lesson, lab, or tool. Head home or search with ⌘K." />
      <Link href="/" className="underline-offset-4 hover:underline">
        Back to StackAtlas
      </Link>
    </div>
  );
}
