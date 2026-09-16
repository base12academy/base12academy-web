import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getBearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7);
}

const COMMITTED_STATUSES = new Set([
  "confirmed",
  "completed",
  "no_show",
]);

export async function GET(request: NextRequest) {
  try {
    const accessToken =
      getBearerToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const supabase = getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(
      accessToken
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const {
      data: bonos,
      error: bonosError,
    } = await supabase
      .from("class_bonos")
      .select(`
        id,
        catalog_slug,
        plan_slug,
        class_service,
        total_hours,
        status,
        purchased_at,
        expires_at,
        created_at
      `)
      .eq("user_id", user.id)
      .order("purchased_at", {
        ascending: false,
      });

    if (bonosError) {
      throw bonosError;
    }

    const {
      data: bookings,
      error: bookingsError,
    } = await supabase
      .from("class_bookings")
      .select(`
        id,
        bono_id,
        slot_start,
        slot_end,
        status,
        subject,
        academic_level,
        topic,
        book_publisher,
        google_event_id,
        meet_url,
        created_at
      `)
      .eq("user_id", user.id)
      .order("slot_start", {
        ascending: true,
      });

    if (bookingsError) {
      throw bookingsError;
    }

    const now = Date.now();

    const result =
      (bonos ?? []).map((bono) => {
        const bonoBookings =
          (bookings ?? []).filter(
            (booking) =>
              booking.bono_id === bono.id
          );

        const committedHours =
          bonoBookings.filter((booking) =>
            COMMITTED_STATUSES.has(
              booking.status
            )
          ).length;

        const availableHours =
          Math.max(
            0,
            bono.total_hours -
              committedHours
          );

        const expiresAt =
          Date.parse(bono.expires_at);

        const effectiveStatus =
          bono.status === "cancelled"
            ? "cancelled"
            : expiresAt <= now
              ? "expired"
              : availableHours === 0
                ? "exhausted"
                : "active";

        const futureBookings =
          bonoBookings.filter(
            (booking) =>
              booking.status ===
                "confirmed" &&
              Date.parse(
                booking.slot_start
              ) > now
          );

        const history =
          bonoBookings.filter(
            (booking) =>
              booking.status !==
                "confirmed" ||
              Date.parse(
                booking.slot_start
              ) <= now
          );

        return {
          ...bono,
          status: effectiveStatus,
          committedHours,
          availableHours,
          nextBooking:
            futureBookings[0] ?? null,
          futureBookings,
          history,
        };
      });

    return NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          email: user.email ?? null,
        },
        bonos: result,
      },
      {
        headers: {
          "Cache-Control":
            "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Error loading class dashboard",
      error
    );

    return NextResponse.json(
      {
        error:
          "CLASS_DASHBOARD_FAILED",
      },
      { status: 500 }
    );
  }
}
