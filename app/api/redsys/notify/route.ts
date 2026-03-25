import { NextResponse } from "next/server";

export async function POST() {
  // Redsys enviará datos aquí

  return NextResponse.redirect(
    "https://base12academy-web-3k98.vercel.app/pago-ok"
  );
}
