import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Base12 Academy · Construye · Comprende · Domina";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          padding: "72px",
        }}
      >
        <img
          src="https://base12academy.es/images/base12-logo.png"
          alt="Base12 Academy"
          style={{ width: "560px", height: "auto", objectFit: "contain" }}
        />
        <div
          style={{
            marginTop: "36px",
            fontSize: "42px",
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "0.5px",
          }}
        >
          Construye · Comprende · Domina
        </div>
      </div>
    ),
    size,
  );
}
