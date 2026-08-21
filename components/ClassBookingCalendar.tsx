"use client";

import { useEffect, useState } from "react";
import styles from "./ClassBookingCalendar.module.css";
import { supabase } from "@/lib/supabaseClient";

const TIME_ZONE = "Europe/Madrid";
const HOLD_STORAGE_KEY = "b12_class_booking_hold";

type SlotStatus = "available" | "unavailable";

type AvailabilitySlot = {
  start: string;
  end: string;
  status: SlotStatus;
};

type AvailabilityDay = {
  date: string;
  weekday: string;
  open: boolean;
  slots: AvailabilitySlot[];
};

type AvailabilityMonth = {
  key: string;
  label: string;
  days: AvailabilityDay[];
};

type AvailabilityResponse = {
  ok: boolean;
  timezone: string;
  minimumBookingNoticeMinutes: number;
  months: AvailabilityMonth[];
  error?: string;
};

type ActiveHold = {
  holdId: string;
  holdToken: string;
  date: string;
  start: string;
  expiresAt: string;
};

type ClassBookingCalendarProps = {
  mode?: "prepurchase" | "bono" | "reprogram";
  bonoId?: string;
  bookingId?: string;
  academicLevel?: string;
  subject?: string;
  topic?: string;
  bookPublisher?: string;
  onReserved?: () => void | Promise<void>;
  onReprogrammed?: () => void | Promise<void>;
};

const WEEKDAY_COLUMN: Record<string, number> = {
  lunes: 1,
  martes: 2,
  "mi\u00e9rcoles": 3,
  jueves: 4,
  viernes: 5,
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function madridTodayKey() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values: Record<string, string> = {};

  for (const part of parts) {
    if (part.type !== "literal") values[part.type] = part.value;
  }

  return `${values.year}-${values.month}-${values.day}`;
}

function formatSelectedDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00Z`));
}

function formatSlot(slot: AvailabilitySlot) {
  const endHour = Number(slot.end.slice(0, 2));
  const visibleEnd = `${String(endHour - 1).padStart(2, "0")}:59`;
  return `${slot.start}\u2013${visibleEnd}`;
}

async function fetchAvailability() {
  const response = await fetch("/api/classes/availability", {
    cache: "no-store",
  });

  const payload = (await response.json()) as AvailabilityResponse;

  if (!response.ok || !payload.ok) {
    throw new Error(
      payload.error || "No se pudo consultar la disponibilidad."
    );
  }

  return payload;
}

function readStoredHold(): ActiveHold | null {
  try {
    const raw = window.sessionStorage.getItem(HOLD_STORAGE_KEY);
    if (!raw) return null;

    const hold = JSON.parse(raw) as ActiveHold;

    if (!hold.expiresAt || Date.parse(hold.expiresAt) <= Date.now()) {
      window.sessionStorage.removeItem(HOLD_STORAGE_KEY);
      return null;
    }

    return hold;
  } catch {
    window.sessionStorage.removeItem(HOLD_STORAGE_KEY);
    return null;
  }
}

function saveStoredHold(hold: ActiveHold | null) {
  if (hold) {
    window.sessionStorage.setItem(
      HOLD_STORAGE_KEY,
      JSON.stringify(hold)
    );
  } else {
    window.sessionStorage.removeItem(HOLD_STORAGE_KEY);
  }
}

export default function ClassBookingCalendar({
  mode = "prepurchase",
  bonoId = "",
  bookingId = "",
  academicLevel = "",
  subject = "",
  topic = "",
  bookPublisher = "",
  onReserved,
  onReprogrammed,
}: ClassBookingCalendarProps = {}) {
  const isBono = mode === "bono";
  const isReprogram = mode === "reprogram";
  const isPostPurchase =
    isBono || isReprogram;
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState<string | null>(null);

  const [hold, setHold] = useState<ActiveHold | null>(null);
  const [holdBusy, setHoldBusy] = useState(false);
  const [holdError, setHoldError] = useState("");
  const [reservationNotice, setReservationNotice] = useState("");

  async function refreshAvailability() {
    const payload = await fetchAvailability();
    setData(payload);
    return payload;
  }

  useEffect(() => {
    let active = true;

    if (!isPostPurchase) {
      const storedHold = readStoredHold();
      if (storedHold) setHold(storedHold);
    }

    async function initialLoad() {
      try {
        const payload = await fetchAvailability();
        if (!active) return;

        setData(payload);
        setError("");
      } catch (loadError) {
        if (!active) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudo consultar la disponibilidad."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    void initialLoad();

    const timer = window.setInterval(() => {
      void fetchAvailability()
        .then((payload) => {
          if (active) setData(payload);
        })
        .catch(() => {});
    }, 60_000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [isPostPurchase]);

  useEffect(() => {
    if (!data?.months.length) return;

    if (!data.months.some((item) => item.key === month)) {
      setMonth(data.months[0].key);
      setDay(null);
    }
  }, [data, month]);

  useEffect(() => {
    if (isPostPurchase || !hold) return;

    const remaining = Date.parse(hold.expiresAt) - Date.now();

    if (remaining <= 0) {
      saveStoredHold(null);
      setHold(null);
      void refreshAvailability();
      return;
    }

    const timer = window.setTimeout(() => {
      saveStoredHold(null);
      setHold(null);
      void refreshAvailability();
    }, remaining + 500);

    return () => window.clearTimeout(timer);
  }, [hold, isPostPurchase]);

  const selectedMonth =
    data?.months.find((item) => item.key === month) ??
    data?.months[0] ??
    null;

  const businessDays =
    selectedMonth?.days.filter((item) => item.open) ?? [];

  const selectedDay =
    selectedMonth?.days.find((item) => item.date === day) ?? null;

  const hours = selectedDay?.slots ?? [];
  const today = madridTodayKey();

  async function releaseExistingHold(existing: ActiveHold) {
    const response = await fetch("/api/classes/hold", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        holdId: existing.holdId,
        holdToken: existing.holdToken,
      }),
    });

    /*
     * 409 significa que ya hab?a caducado o dejado de estar activa.
     * En ambos casos podemos continuar.
     */
    if (!response.ok && response.status !== 409) {
      throw new Error(
        "No se pudo liberar la hora seleccionada anteriormente."
      );
    }
  }

  async function selectHour(slot: AvailabilitySlot) {
    if (
      !selectedDay ||
      holdBusy ||
      slot.status !== "available"
    ) {
      return;
    }

    /*
     * REPROGRAMACIÓN:
     * mueve la misma class_booking y conserva el consumo.
     */
    if (isReprogram) {
      if (!bookingId) {
        setHoldError(
          "No se ha podido identificar la clase que quieres cambiar."
        );
        return;
      }

      setHoldBusy(true);
      setHoldError("");
      setReservationNotice("");

      try {
        const { data: sessionData } =
          await supabase.auth.getSession();

        const accessToken =
          sessionData.session?.access_token;

        if (!accessToken) {
          throw new Error(
            "Tu sesión ha caducado. Vuelve a iniciar sesión."
          );
        }

        const response = await fetch(
          "/api/classes/reprogram",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              bookingId,
              date: selectedDay.date,
              start: slot.start,
            }),
          }
        );

        const payload =
          await response.json().catch(() => ({}));

        if (!response.ok || !payload.ok) {
          throw new Error(
            payload.error ||
              "No se pudo cambiar el horario."
          );
        }

        setReservationNotice(
          `Horario actualizado: ${formatSelectedDate(
            selectedDay.date
          )}, ${formatSlot(slot)}.`
        );

        await refreshAvailability();

        if (onReprogrammed) {
          await onReprogrammed();
        }
      } catch (selectionError) {
        setHoldError(
          selectionError instanceof Error
            ? selectionError.message
            : "No se pudo reprogramar la clase."
        );

        try {
          await refreshAvailability();
        } catch {}
      } finally {
        setHoldBusy(false);
      }

      return;
    }

    /*
     * BONO YA COMPRADO:
     * reserva definitiva contra las horas disponibles.
     */
    if (isBono) {
      if (
        !bonoId ||
        !academicLevel.trim() ||
        !subject.trim() ||
        !topic.trim()
      ) {
        setHoldError(
          "Completa el nivel, la asignatura y el tema antes de elegir una hora."
        );
        return;
      }

      setHoldBusy(true);
      setHoldError("");
      setReservationNotice("");

      try {
        const { data: sessionData } =
          await supabase.auth.getSession();

        const accessToken =
          sessionData.session?.access_token;

        if (!accessToken) {
          throw new Error(
            "Tu sesión ha caducado. Vuelve a iniciar sesión."
          );
        }

        const response = await fetch(
          "/api/classes/reserve",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              bonoId,
              date: selectedDay.date,
              start: slot.start,
              academicLevel: academicLevel.trim(),
              subject: subject.trim(),
              topic: topic.trim(),
              bookPublisher:
                bookPublisher.trim() || null,
            }),
          }
        );

        const payload =
          await response.json().catch(() => ({}));

        if (!response.ok || !payload.ok) {
          throw new Error(
            payload.error ||
              "La hora ya no está disponible."
          );
        }

        setReservationNotice(
          `Clase confirmada: ${formatSelectedDate(
            selectedDay.date
          )}, ${formatSlot(slot)}.`
        );

        await refreshAvailability();

        if (onReserved) {
          await onReserved();
        }
      } catch (selectionError) {
        setHoldError(
          selectionError instanceof Error
            ? selectionError.message
            : "No se pudo confirmar la clase."
        );

        try {
          await refreshAvailability();
        } catch {}
      } finally {
        setHoldBusy(false);
      }

      return;
    }

    /*
     * PRECOMPRA:
     * reserva provisional durante 60 minutos.
     */
    if (
      hold &&
      hold.date === selectedDay.date &&
      hold.start === slot.start
    ) {
      return;
    }

    setHoldBusy(true);
    setHoldError("");

    try {
      if (hold) {
        await releaseExistingHold(hold);
        saveStoredHold(null);
        setHold(null);
      }

      const response = await fetch("/api/classes/hold", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDay.date,
          start: slot.start,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error ||
            "La hora ya no está disponible."
        );
      }

      const newHold: ActiveHold = {
        holdId: payload.holdId,
        holdToken: payload.holdToken,
        date: payload.date,
        start: payload.start,
        expiresAt: payload.expiresAt,
      };

      setHold(newHold);
      saveStoredHold(newHold);

      await refreshAvailability();
    } catch (selectionError) {
      setHoldError(
        selectionError instanceof Error
          ? selectionError.message
          : "No se pudo reservar provisionalmente la hora."
      );

      try {
        await refreshAvailability();
      } catch {}
    } finally {
      setHoldBusy(false);
    }
  }

  const holdExpiresLabel = hold
    ? new Intl.DateTimeFormat("es-ES", {
        timeZone: TIME_ZONE,
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(hold.expiresAt))
    : null;

  return (
    <section className={styles.wrapper}>
      <div className={styles.heading}>
        <div>
          <span>
            {isReprogram
              ? "CAMBIA EL HORARIO"
              : isBono
                ? "RESERVA UNA CLASE"
                : "RESERVA TU PRIMERA CLASE"}
          </span>
          <h3>Elige una hora disponible</h3>
          <p>
            {isReprogram
              ? "Selecciona una nueva fecha y hora. Se moverá la misma clase y no se descontará otra hora del bono."
              : isBono
                ? "Selecciona una fecha y una hora libre. La reserva se descontará de las horas disponibles de tu bono."
                : "Consulta el mes actual y los dos meses siguientes antes de contratar tu bono."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className={styles.placeholder}>
          <strong>Consultando disponibilidad</strong>
          <span>Estamos leyendo el calendario de Clases Online.</span>
        </div>
      ) : error ? (
        <div className={styles.placeholder}>
          <strong>No se pudo cargar la agenda</strong>
          <span>{error}</span>
        </div>
      ) : data && selectedMonth ? (
        <>
          <div className={styles.months}>
            {data.months.map((item) => (
              <button
                key={item.key}
                type="button"
                className={month === item.key ? styles.monthActive : ""}
                onClick={() => {
                  setMonth(item.key);
                  setDay(null);
                }}
              >
                <strong>{capitalize(item.label.split(" de ")[0])}</strong>
                <small>{item.key.slice(0, 4)}</small>
              </button>
            ))}
          </div>

          <div className={styles.bookingGrid}>
            <div className={styles.calendar}>
              <div className={styles.weekdays}>
                <span>L</span>
                <span>M</span>
                <span>X</span>
                <span>J</span>
                <span>V</span>
              </div>

              <div className={styles.days}>
                {businessDays.map((item) => {
                  const past = item.date < today;
                  const selected = day === item.date;

                  const hasFreeSlots = item.slots.some(
                    (slot) => slot.status === "available"
                  );

                  return (
                    <button
                      key={item.date}
                      type="button"
                      disabled={past}
                      style={{
                        gridColumn: WEEKDAY_COLUMN[item.weekday] ?? 1,
                      }}
                      className={[
                        styles.day,
                        selected ? styles.daySelected : "",
                      ].join(" ")}
                      onClick={() => setDay(item.date)}
                    >
                      <strong>{Number(item.date.slice(-2))}</strong>
                      {!past && (
                        <small>
                          {hasFreeSlots ? "Ver horas" : "Sin huecos"}
                        </small>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className={styles.side}>
              <div className={styles.hoursPanel}>
                {!selectedDay ? (
                  <div className={styles.placeholder}>
                    <strong>Selecciona un d?a</strong>
                    <span>
                      Despu?s podr?s elegir una de sus horas libres.
                    </span>
                  </div>
                ) : (
                  <>
                    <div className={styles.selectedDate}>
                      <small>Fecha seleccionada</small>
                      <strong>
                        {formatSelectedDate(selectedDay.date)}
                      </strong>
                    </div>

                    <div className={styles.hours}>
                      {hours.map((item) => {
                        const mine =
                          !isPostPurchase &&
                          hold !== null &&
                          hold.date === selectedDay.date &&
                          hold.start === item.start &&
                          Date.parse(hold.expiresAt) > Date.now();

                        const unavailable =
                          item.status !== "available" && !mine;

                        return (
                          <button
                            key={item.start}
                            type="button"
                            disabled={unavailable || holdBusy}
                            className={[
                              styles.hour,
                              mine
                                ? styles.provisional
                                : unavailable
                                  ? styles.unavailable
                                  : styles.free,
                            ].join(" ")}
                            onClick={() => void selectHour(item)}
                          >
                            <strong>{formatSlot(item)}</strong>
                            <span>
                              {mine
                                ? "Reserva provisional"
                                : unavailable
                                  ? "No disponible"
                                  : holdBusy
                                    ? "Comprobando"
                                    : "Libre"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div className={styles.legend}>
                <h4>Leyenda</h4>

                <div>
                  <i className={styles.freeSample} />
                  <span>
                    <strong>Libre</strong>
                    <small>Puedes reservarla</small>
                  </span>
                </div>

                {!isPostPurchase && (
                  <>
                    <div>
                      <i className={styles.provisionalSample} />
                      <span>
                        <strong>Reserva provisional</strong>
                        <small>Retenida para ti antes del pago</small>
                      </span>
                    </div>

                    <div>
                      <i className={styles.mineSample} />
                      <span>
                        <strong>Reservado por ti</strong>
                        <small>Clase confirmada de tu bono</small>
                      </span>
                    </div>
                  </>
                )}

                <div>
                  <i className={styles.unavailableSample} />
                  <span>
                    <strong>No disponible</strong>
                    <small>Ocupada o bloqueada por Base12</small>
                  </span>
                </div>
              </div>
            </aside>
          </div>

          <div className={styles.notice}>
            {isReprogram ? (
              reservationNotice ? (
                <>
                  <strong>{reservationNotice}</strong>
                  <p>
                    La misma clase ha cambiado de horario. No se ha consumido
                    una segunda hora del bono.
                  </p>
                </>
              ) : (
                <>
                  <strong>
                    Elige la nueva hora para esta clase.
                  </strong>
                  <p>
                    Puedes cambiarla hasta 30 minutos antes de su comienzo.
                    Se conservará la misma reserva y el mismo Google Meet.
                  </p>
                </>
              )
            ) : isBono ? (
              reservationNotice ? (
                <>
                  <strong>{reservationNotice}</strong>
                  <p>
                    La clase ya figura en tu bono y en Mis clases.
                  </p>
                </>
              ) : (
                <>
                  <strong>
                    La reserva será definitiva al elegir una hora.
                  </strong>
                  <p>
                    Se descontará una hora de tu bono. No se realizará
                    ningún nuevo pago.
                  </p>
                </>
              )
            ) : hold ? (
              <>
                <strong>
                  Reserva provisional activa hasta las {holdExpiresLabel}.
                </strong>
                <p>
                  Esta hora se mantiene para ti durante 60 minutos mientras
                  completas la contratación del bono.
                </p>
              </>
            ) : (
              <>
                <strong>
                  Al seleccionar una hora quedará retenida durante 60 minutos.
                </strong>
                <p>
                  Si no completas la contratación dentro de ese plazo, volverá
                  automáticamente a estar disponible.
                </p>
              </>
            )}

            {holdError && <p role="alert">{holdError}</p>}
          </div>

          <div className={styles.scheduleNote}>
            <span>Lunes a jueves: 15:00?20:59</span>
            <span>Viernes: 15:00?18:59</span>
            <span>Horario peninsular ? Europe/Madrid</span>
          </div>
        </>
      ) : null}
    </section>
  );
}
