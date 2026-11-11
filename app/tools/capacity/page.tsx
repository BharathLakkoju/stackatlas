import { PageHeader } from "@/components/page-header";
import { CapacityTool } from "@/components/tools/capacity";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Capacity calculator",
  description: "Back-of-envelope QPS, write rate, storage, and bandwidth for system design interviews.",
  path: "/tools/capacity",
});

export default function CapacityPage() {
  return (
    <div>
      <PageHeader
        title="Capacity calculator"
        description="Interview math you can defend: average QPS from DAU, then multiply by a peak factor before you buy hardware."
      />
      <CapacityTool />
    </div>
  );
}
