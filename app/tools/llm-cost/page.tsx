import { PageHeader } from "@/components/page-header";
import { LlmCostTool } from "@/components/tools/llm-cost";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "LLM token cost calculator",
  description: "Estimate monthly model spend from input tokens, output tokens, and call volume.",
  path: "/tools/llm-cost",
});

export default function LlmCostPage() {
  return (
    <div>
      <PageHeader
        title="LLM token cost calculator"
        description="List prices move. Use this to size a feature before you commit to a context window."
      />
      <LlmCostTool />
    </div>
  );
}
