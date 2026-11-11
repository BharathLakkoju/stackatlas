import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const completed = Number(request.nextUrl.searchParams.get("completed") ?? "0");
  const total = Number(request.nextUrl.searchParams.get("total") ?? "42");
  const label = `${completed}/${total} lessons`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="28" role="img" aria-label="${label}">
  <rect width="180" height="28" rx="6" fill="#171717"/>
  <text x="12" y="19" fill="#f4f1ea" font-family="ui-sans-serif,system-ui" font-size="12">StackAtlas ${label}</text>
</svg>`;
  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
