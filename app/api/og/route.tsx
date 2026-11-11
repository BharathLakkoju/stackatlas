import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "StackAtlas";
  const path = searchParams.get("path") ?? "/";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111110",
          color: "#f4f1ea",
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7 }}>
          StackAtlas
        </div>
        <div style={{ fontSize: title.length > 48 ? 48 : 60, lineHeight: 1.15, maxWidth: "90%" }}>{title}</div>
        <div style={{ fontSize: 24, opacity: 0.6 }}>{path}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
