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
            width: 464,
            height: 320,
            overflow: "hidden",
            position: "relative",
          },
        },
        React.createElement("img", {
          src: logo,
          width: 614,
          height: 614,
          alt: "",
          style: { position: "absolute", left: -80, top: -27 },
        }),
      ),
    ),
    { width: 512, height: 512 },
  );
}
