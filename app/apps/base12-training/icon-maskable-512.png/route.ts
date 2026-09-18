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
            width: 384,
            height: 265,
            overflow: "hidden",
            position: "relative",
          },
        },
        React.createElement("img", {
          src: logo,
          width: 508,
          height: 508,
          alt: "",
          style: { position: "absolute", left: -66, top: -22 },
        }),
      ),
    ),
    { width: 512, height: 512 },
  );
}
