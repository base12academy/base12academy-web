import React from "react";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(request: NextRequest) {
  const logo = new URL("/images/training/base12-training-192.png", request.nextUrl.origin).toString();
  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            width: 174,
            height: 120,
            overflow: "hidden",
            position: "relative",
          },
        },
        React.createElement("img", {
          src: logo,
          width: 230,
          height: 230,
          alt: "",
          style: { position: "absolute", left: -30, top: -10 },
        }),
      ),
    ),
    { width: 192, height: 192 },
  );
}
