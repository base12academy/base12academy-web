"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ClassBookingCalendar from "@/components/ClassBookingCalendar";
import styles from "./clases.module.css";

type Booking = {
  id: string;
  bono_id: string;
  slot_start: string;
  slot_end: string;
  status: string;
  subject: string | null;
  academic_level: string | null;
  topic: string | null;
  book_publisher: string | null;
  google_event_id: string | null;
  meet_url: string | null;
  created_at: string;
};

type Bono = {
  id: string;
  catalog_slug: string;
  plan_slug: string;
  class_service: string;
  total_hours: number;
  status: string;
  purchased_at: string;
  expires_at: string;
  created_at: string;
  committedHours: number;
  availableHours: number;
  nextBooking: Booking | null;
  futureBookings: Booking[];
  history: Booking[];
};

type ClassesResponse = {
  ok?: boolean;
  bonos?: Bono[];
  error?: string;
};

const TEXT = {
  title: "Mis clases",
  subtitle:
    "Consulta tus bonos, horas disponibles y clases programadas.",
  noBonos:
    "Todav\u00eda no tienes ning\u00fan bono de Clases Online activo.",
  total: "Horas del bono",
  committed: "Comprometidas",
  available: "Disponibles",
  expires: "Caduca",
  next: "Pr\u00f3xima clase",
  future: "Pr\u00f3ximas clases",
  history: "Historial",
  noNext: "No tienes otra clase programada.",
  loading: "Preparando tus clases...",
  login: "Debes iniciar sesi\u00f3n para consultar tus clases.",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}

function serviceName(service: string) {
  if (service === "universidad-historia") {
    return "Historia \u00b7 Universidad";
  }

  if (
    service ===
    "eso-bach-historia-filosofia"
  ) {
    return "Historia y Filosof\u00eda \u00b7 ESO y Bachillerato";
  }

  return "Clases Online";
}

function statusName(status: string) {
  if (status === "active") return "Activo";
  if (status === "exhausted") return "Agotado";
  if (status === "expired") return "Caducado";
  if (status === "cancelled") return "Cancelado";
  return status;
}

export default function ClassesDashboardPage() {
  const router = useRouter();

  const [data, setData] =
    useState<ClassesResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [reloadKey, setReloadKey] =
    useState(0);

  const [bookingBonoId, setBookingBonoId] =
    useState<string | null>(null);

  const [
    reprogramBookingId,
    setReprogramBookingId,
  ] = useState<string | null>(null);

  const [bookingAcademicLevel, setBookingAcademicLevel] = useState("");
  const [bookingSubject, setBookingSubject] = useState("");
  const [bookingTopic, setBookingTopic] = useState("");
  const [bookingPublisher, setBookingPublisher] = useState("");

  useEffect(() => {
    let active = true;

    async function loadClasses() {
      try {
        setLoading(true);
        setError("");

        const {
          data: sessionData,
        } =
          await supabase.auth.getSession();

        const accessToken =
          sessionData.session?.access_token;

        if (!accessToken) {
          router.replace(
            "/login?redirect=/dashboard/clases"
          );
          return;
        }

        const response =
          await fetch("/api/classes/me", {
            cache: "no-store",
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          });

        const result =
          (await response
            .json()
            .catch(() => ({}))) as ClassesResponse;

        if (!response.ok) {
          throw new Error(
            result.error ||
              "No se pudieron cargar tus clases."
          );
        }

        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar tus clases."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadClasses();

    return () => {
      active = false;
    };
  }, [router, reloadKey]);

  function toggleBooking(bono: Bono) {
    setReprogramBookingId(null);

    if (bookingBonoId === bono.id) {
      setBookingBonoId(null);
      return;
    }

    setBookingBonoId(bono.id);
    setBookingAcademicLevel("");
    setBookingSubject(
      bono.class_service === "universidad-historia"
        ? "Historia"
        : ""
    );
    setBookingTopic("");
    setBookingPublisher("");
  }

  function toggleReprogram(bookingId: string) {
    setBookingBonoId(null);

    setReprogramBookingId(
      (current) =>
        current === bookingId
          ? null
          : bookingId
    );
  }

  const bonos = useMemo(
    () => data?.bonos ?? [],
    [data]
  );

  if (loading) {
    return (
      <main className={styles.centered}>
        {TEXT.loading}
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link
            href="/"
            className={styles.brand}
          >
            B12
            <span>Base12 Academy</span>
          </Link>

          <p className={styles.eyebrow}>
            CLASES ONLINE
          </p>

          <h1>{TEXT.title}</h1>

          <p className={styles.subtitle}>
            {TEXT.subtitle}
          </p>
        </div>

        <Link
          href="/dashboard"
          className={styles.dashboardLink}
        >
          Volver al dashboard
        </Link>
      </header>

      {error && (
        <div
          role="alert"
          className={styles.error}
        >
          {error}
        </div>
      )}

      {!error && bonos.length === 0 && (
        <section className={styles.empty}>
          <h2>Clases Online</h2>
          <p>{TEXT.noBonos}</p>
          <Link href="/">
            Ver Clases Online
          </Link>
        </section>
      )}

      <div className={styles.bonos}>
        {bonos.map((bono) => (
          <section
            key={bono.id}
            className={styles.bono}
          >
            <div className={styles.bonoHeader}>
              <div>
                <p className={styles.eyebrow}>
                  BONO DE CLASES
                </p>

                <h2>
                  {serviceName(
                    bono.class_service
                  )}
                </h2>

                <p className={styles.plan}>
                  {bono.plan_slug}
                </p>
              </div>

              <span
                className={styles.status}
                data-status={bono.status}
              >
                {statusName(bono.status)}
              </span>
            </div>

            <div className={styles.summary}>
              <Summary
                label={TEXT.total}
                value={bono.total_hours}
              />

              <Summary
                label={TEXT.committed}
                value={bono.committedHours}
              />

              <Summary
                label={TEXT.available}
                value={bono.availableHours}
              />

              <Summary
                label={TEXT.expires}
                value={formatDate(
                  bono.expires_at
                )}
              />
            </div>

            <section
              className={styles.nextClass}
            >
              <p className={styles.eyebrow}>
                {TEXT.next.toUpperCase()}
              </p>

              {bono.nextBooking ? (
                <BookingCard
                  booking={bono.nextBooking}
                  featured
                  reprogramming={
                    reprogramBookingId ===
                    bono.nextBooking.id
                  }
                  onReprogram={() =>
                    toggleReprogram(
                      bono.nextBooking!.id
                    )
                  }
                  onReprogrammed={() => {
                    setReprogramBookingId(null);
                    setReloadKey(
                      (value) => value + 1
                    );
                  }}
                />
              ) : (
                <p className={styles.muted}>
                  {TEXT.noNext}
                </p>
              )}
            </section>

            {bono.futureBookings.length > 1 && (
              <section className={styles.section}>
                <h3>{TEXT.future}</h3>

                <div className={styles.bookingList}>
                  {bono.futureBookings
                    .slice(1)
                    .map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        reprogramming={
                          reprogramBookingId ===
                          booking.id
                        }
                        onReprogram={() =>
                          toggleReprogram(
                            booking.id
                          )
                        }
                        onReprogrammed={() => {
                          setReprogramBookingId(null);
                          setReloadKey(
                            (value) => value + 1
                          );
                        }}
                      />
                    ))}
                </div>
              </section>
            )}

            {bono.history.length > 0 && (
              <details className={styles.history}>
                <summary>
                  {TEXT.history} (
                  {bono.history.length})
                </summary>

                <div className={styles.bookingList}>
                  {bono.history.map(
                    (booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                      />
                    )
                  )}
                </div>
              </details>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                disabled={
                  bono.status !== "active" ||
                  bono.availableHours < 1
                }
                onClick={() => toggleBooking(bono)}
              >
                {bookingBonoId === bono.id
                  ? "Cerrar reserva"
                  : "Reservar otra hora"}
              </button>

              <p>
                Los cambios de horario se gestionan
                desde Mis clases hasta 30 minutos
                antes del comienzo.
              </p>
            </div>

            {bookingBonoId === bono.id && (
              <section className={styles.bookingPanel}>
                <div className={styles.bookingPanelHeader}>
                  <p className={styles.eyebrow}>NUEVA CLASE</p>
                  <h3>Indica qué necesitas trabajar</h3>
                  <p>Completa los datos de la clase y después selecciona una hora libre.</p>
                </div>

                <div className={styles.bookingFields}>
                  {bono.class_service === "universidad-historia" ? (
                    <>
                      <label className={styles.bookingField}>
                        <span>Titulación y curso</span>
                        <input
                          value={bookingAcademicLevel}
                          onChange={(event) => setBookingAcademicLevel(event.target.value)}
                          placeholder="Ej.: Grado en Historia, 2.º curso"
                        />
                      </label>

                      <div className={styles.fixedSubject}>
                        <span>Asignatura</span>
                        <strong>Historia</strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <label className={styles.bookingField}>
                        <span>Nivel / curso</span>
                        <select
                          value={bookingAcademicLevel}
                          onChange={(event) => setBookingAcademicLevel(event.target.value)}
                        >
                          <option value="">Selecciona el nivel</option>
                          <option value="4.º ESO">4.º ESO</option>
                          <option value="1.º Bachillerato">1.º Bachillerato</option>
                          <option value="2.º Bachillerato">2.º Bachillerato</option>
                        </select>
                      </label>

                      <label className={styles.bookingField}>
                        <span>Asignatura</span>
                        <select
                          value={bookingSubject}
                          onChange={(event) => setBookingSubject(event.target.value)}
                        >
                          <option value="">Selecciona la asignatura</option>
                          <option value="Historia">Historia</option>
                          <option value="Filosofía">Filosofía</option>
                        </select>
                      </label>
                    </>
                  )}

                  <label className={styles.bookingField}>
                    <span>Tema de la clase</span>
                    <input
                      value={bookingTopic}
                      onChange={(event) => setBookingTopic(event.target.value)}
                      placeholder="Tema o contenido que necesitas trabajar"
                    />
                  </label>

                  <label className={styles.bookingField}>
                    <span>Editorial del libro (opcional)</span>
                    <input
                      value={bookingPublisher}
                      onChange={(event) => setBookingPublisher(event.target.value)}
                      placeholder="Déjalo en blanco si no utilizas libro"
                    />
                  </label>
                </div>

                <ClassBookingCalendar
                  mode="bono"
                  bonoId={bono.id}
                  academicLevel={bookingAcademicLevel}
                  subject={
                    bono.class_service === "universidad-historia"
                      ? "Historia"
                      : bookingSubject
                  }
                  topic={bookingTopic}
                  bookPublisher={bookingPublisher}
                  onReserved={() => {
                    setBookingBonoId(null);
                    setBookingAcademicLevel("");
                    setBookingSubject("");
                    setBookingTopic("");
                    setBookingPublisher("");
                    setReloadKey((value) => value + 1);
                  }}
                />
              </section>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className={styles.summaryItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BookingCard({
  booking,
  featured = false,
  reprogramming = false,
  onReprogram,
  onReprogrammed,
}: {
  booking: Booking;
  featured?: boolean;
  reprogramming?: boolean;
  onReprogram?: () => void;
  onReprogrammed?: () => void | Promise<void>;
}) {
  const minutesUntilStart =
    (
      Date.parse(booking.slot_start) -
      Date.now()
    ) / 60000;

  const canReprogram =
    booking.status === "confirmed" &&
    minutesUntilStart >= 30;

  return (
    <div>
      <article
        className={
          featured
            ? styles.bookingFeatured
            : styles.booking
        }
      >
        <div>
          <strong>
            {formatDateTime(
              booking.slot_start
            )}
          </strong>

          <p>
            {booking.subject || "Clase"}
            {booking.academic_level
              ? ` · ${booking.academic_level}`
              : ""}
          </p>

          {booking.topic && (
            <p className={styles.topic}>
              Tema: {booking.topic}
            </p>
          )}

          {booking.book_publisher && (
            <p className={styles.muted}>
              Editorial:{" "}
              {booking.book_publisher}
            </p>
          )}
        </div>

        <div className={styles.bookingControls}>
          {booking.meet_url && (
            <a
              href={booking.meet_url}
              target="_blank"
              rel="noreferrer"
              className={styles.meet}
            >
              Entrar en Google Meet
            </a>
          )}

          {onReprogram && canReprogram && (
            <button
              type="button"
              className={styles.reprogramButton}
              onClick={onReprogram}
            >
              {reprogramming
                ? "Cerrar cambio"
                : "Cambiar horario"}
            </button>
          )}
        </div>
      </article>

      {reprogramming && canReprogram && (
        <section className={styles.reprogramPanel}>
          <ClassBookingCalendar
            mode="reprogram"
            bookingId={booking.id}
            onReprogrammed={
              onReprogrammed
            }
          />
        </section>
      )}

      {onReprogram && !canReprogram && (
        <p className={styles.reprogramClosed}>
          Esta clase ya no puede cambiarse porque faltan menos
          de 30 minutos para su comienzo.
        </p>
      )}
    </div>
  );
}
