import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

const TOOLS = [
  {
    href: "/tools/big-o",
    title: "Big-O reference",
    summary: "See how operation counts explode as n grows, with the algorithms that live in each class.",
  },
  {
    href: "/tools/capacity",
    title: "Capacity calculator",
    summary: "Back-of-envelope QPS, storage, and bandwidth from DAU and payload size.",
  },
  {
    href: "/tools/llm-cost",
    title: "LLM token cost",
    summary: "Envelope monthly spend from tokens in, tokens out, and call volume.",
  },
];

export const metadata = pageMetadata({
  title: "Tools",
  description: "Free calculators for complexity, capacity planning, and LLM cost.",
  path: "/tools",
  type: "website",
});

export default function ToolsPage() {
  return (
    <div>
      <PageHeader title="Tools" description="Tiny utilities we actually use while writing the lessons. No signup." />
      <div className="grid gap-4 md:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.href}>
            <CardHeader>
              <CardTitle>
                <Link href={tool.href}>{tool.title}</Link>
              </CardTitle>
              <CardDescription>{tool.summary}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
