import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Stoop — the neighborhood marketplace for home services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "#fdfaf5",
          padding: 80,
          color: "#1a1a18",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 32,
            fontWeight: 700,
            color: "#c24f37",
          }}
        >
          Stoop
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 600, lineHeight: 1.05, color: "#1a1a18", maxWidth: 1000 }}>
            Find a tradesperson the way you&rsquo;d find a babysitter.
          </div>
          <div style={{ fontSize: 32, color: "#51514b", maxWidth: 900 }}>
            The neighborhood marketplace for home services. Built for Brooklyn brownstones.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 24,
            color: "#686860",
          }}
        >
          <span>stoop.app</span>
          <span>Ask your stoop.</span>
        </div>
      </div>
    ),
    size
  );
}
