"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Student = {
  user_id: string;
  full_name: string | null;
  contact_email: string | null;
  phone: string | null;
};

type Booking = {
  id: string;
  bono_id: string;
  user_id: string;
  slot_start: string;
  slot_end: string;
  status:
    | "confirmed"
    | "completed"
    | "no_show"
    | "cancelled_by_base12";
  subject: string | null;
  academic_level: string | null;
  topic: string | null;
  book_publisher: string | null;
  google_event_id: string | null;
  meet_url: string | null;
  confirmed_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  student: Student | null;
};

type FinalStatus =
  | "completed"
  | "no_show"
  | "cancelled_by_base12";

const STATUS_LABELS: Record<Booking["status"], string> = {
  confirmed: "Confirmada",
  completed: "Realizada",
  no_show: "No presentado",
  cancelled_by_base12: "Cancelada por Base12",
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ClassBookingAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      setMessage("No hay sesión administrativa activa.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/classes/status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "No se pudieron cargar las clases.");
        setLoading(false);
        return;
      }

      setBookings(result.bookings || []);
    } catch {
      setMessage("No se pudieron cargar las clases.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const orderedBookings = useMemo(() => {
    return [...bookings].sort(
      (a, b) =>
        new Date(b.slot_start).getTime() -
        new Date(a.slot_start).getTime()
    );
  }, [bookings]);

  const changeStatus = async (
    booking: Booking,
    status: FinalStatus
  ) => {
    const actionLabel =
      status === "completed"
        ? "marcar esta clase como realizada"
        : status === "no_show"
          ? "marcar al alumno como no presentado"
          : "cancelar esta clase por Base12 y devolver la hora al bono";

    if (
      !window.confirm(
        `¿Confirmas que quieres ${actionLabel}?`
      )
    ) {
      return;
    }

    setSavingId(booking.id);
    setMessage("");

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (!token) {
      setMessage("No hay sesión administrativa activa.");
      setSavingId(null);
      return;
    }

    try {
      const response = await fetch("/api/admin/classes/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "No se pudo actualizar la clase.");
        setSavingId(null);
        return;
      }

      setMessage(
        status === "cancelled_by_base12"
          ? "Clase cancelada por Base12. La hora vuelve a estar disponible en el bono."
          : status === "completed"
            ? "Clase marcada como realizada."
            : "Clase marcada como no presentado. La hora permanece consumida."
      );

      await loadBookings();
    } catch {
      setMessage("No se pudo actualizar la clase.");
    } finally {
      setSavingId(null);
    }
  };

  const now = Date.now();

  return (
    <section
      style={{
        marginTop: 24,
        padding: 22,
        border: "1px solid #dbe3ef",
        borderRadius: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ marginBottom: 6 }}>Clases Online</h2>
          <p style={{ margin: 0, color: "#475569" }}>
            Gestiona el cierre de las clases y las cancelaciones de Base12.
          </p>
        </div>
        <button
          type="button"
          onClick={loadBookings}
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            background: "white",
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Actualizando…" : "Actualizar"}
        </button>
      </div>

      {message && (
        <p
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 10,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          {message}
        </p>
      )}

      {!loading && orderedBookings.length === 0 && (
        <p style={{ marginTop: 18 }}>
          Todavía no hay clases registradas.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gap: 14,
          marginTop: 18,
        }}
      >
        {orderedBookings.map((booking) => {
          const startMs = new Date(booking.slot_start).getTime();
          const endMs = new Date(booking.slot_end).getTime();
          const isConfirmed = booking.status === "confirmed";
          const canComplete = isConfirmed && now >= endMs;
          const canNoShow = isConfirmed && now >= startMs;
          const busy = savingId === booking.id;

          return (
            <article
              key={booking.id}
              style={{
                padding: 16,
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                background:
                  booking.status === "cancelled_by_base12"
                    ? "#f8fafc"
                    : "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 14,
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong>
                    {booking.student?.full_name ||
                      booking.student?.contact_email ||
                      "Alumno"}
                  </strong>
                  <div style={{ marginTop: 4, color: "#334155" }}>
                    {formatDateTime(booking.slot_start)}
                  </div>
                </div>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background:
                      booking.status === "confirmed"
                        ? "#eff6ff"
                        : booking.status === "completed"
                          ? "#ecfdf5"
                          : booking.status === "no_show"
                            ? "#fff7ed"
                            : "#f1f5f9",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 5,
                  marginTop: 12,
                  fontSize: 14,
                  color: "#475569",
                }}
              >
                {booking.student?.contact_email && (
                  <div>Email: {booking.student.contact_email}</div>
                )}
                {booking.student?.phone && (
                  <div>Móvil: {booking.student.phone}</div>
                )}
                {booking.academic_level && (
                  <div>Nivel: {booking.academic_level}</div>
                )}
                {booking.subject && (
                  <div>Asignatura: {booking.subject}</div>
                )}
                {booking.topic && (
                  <div>Tema: {booking.topic}</div>
                )}
                {booking.book_publisher && (
                  <div>Editorial: {booking.book_publisher}</div>
                )}
                {booking.meet_url && booking.status !== "cancelled_by_base12" && (
                  <div>
                    <a
                      href={booking.meet_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir Google Meet
                    </a>
                  </div>
                )}
              </div>

              {isConfirmed && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginTop: 14,
                  }}
                >
                  <button
                    type="button"
                    disabled={!canComplete || busy}
                    onClick={() =>
                      changeStatus(booking, "completed")
                    }
                    title={
                      canComplete
                        ? "Marcar como realizada"
                        : "Disponible cuando la clase haya terminado"
                    }
                    style={{
                      padding: "9px 12px",
                      borderRadius: 9,
                      border: 0,
                      background: canComplete ? "#166534" : "#cbd5e1",
                      color: "white",
                      fontWeight: 800,
                      cursor: canComplete && !busy ? "pointer" : "default",
                    }}
                  >
                    Realizada
                  </button>

                  <button
                    type="button"
                    disabled={!canNoShow || busy}
                    onClick={() =>
                      changeStatus(booking, "no_show")
                    }
                    title={
                      canNoShow
                        ? "Marcar como no presentado"
                        : "Disponible cuando haya comenzado la clase"
                    }
                    style={{
                      padding: "9px 12px",
                      borderRadius: 9,
                      border: "1px solid #c2410c",
                      background: "white",
                      color: canNoShow ? "#9a3412" : "#94a3b8",
                      fontWeight: 800,
                      cursor: canNoShow && !busy ? "pointer" : "default",
                    }}
                  >
                    No presentado
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      changeStatus(
                        booking,
                        "cancelled_by_base12"
                      )
                    }
                    style={{
                      padding: "9px 12px",
                      borderRadius: 9,
                      border: "1px solid #b91c1c",
                      background: "white",
                      color: "#b91c1c",
                      fontWeight: 800,
                      cursor: busy ? "default" : "pointer",
                    }}
                  >
                    Cancelar por Base12
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
