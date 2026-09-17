import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(request: NextRequest) {
  const logo = new URL("/images/training/base12-training-192.png?v=8", request.nextUrl.origin).toString();
  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        },
      },
      React.createElement("img", { src: logo, width: 224, height: 224, alt: "" }),
    ),
    { width: 192, height: 192 },
  );
}
