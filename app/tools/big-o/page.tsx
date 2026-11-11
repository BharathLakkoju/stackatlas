import { PageHeader } from "@/components/page-header";
import { BigOTool } from "@/components/tools/big-o";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Big-O reference",
  description: "Compare constant, linear, n log n, quadratic, and exponential work at a chosen n.",
  path: "/tools/big-o",
});

export default function BigOPage() {
  return (
    <div>
      <PageHeader title="Big-O reference" description="Pick n. Watch the dominant term take over. This is a growth-rate table, not a benchmark." />
      <BigOTool />
    </div>
  );
}
