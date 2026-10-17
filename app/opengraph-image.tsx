import { ImageResponse } from "next/og";

export const alt = "Extreme Networks Solutions Toolkit — a personal project by Dr. Bin Han";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const features = ["Ask Fabric Connect AI", "Product Catalog", "Competitive Intelligence", "Fabric Connect Guide"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #6D1F7E 0%, #3b0f47 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#ffffff",
              color: "#6D1F7E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            BH
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Dr. Bin Han</div>
            <div style={{ fontSize: 22, opacity: 0.75 }}>Principal System Engineer · CCIE Wireless · CWNE · CISSP</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>Extreme Networks Solutions Toolkit</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {features.map((f) => (
              <div
                key={f}
                style={{
                  fontSize: 22,
                  padding: "8px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 20, opacity: 0.6 }}>Personal project · Not an official Extreme Networks website</div>
      </div>
    ),
    { ...size }
  );
}
