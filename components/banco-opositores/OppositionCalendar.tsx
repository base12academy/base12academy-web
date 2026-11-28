"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { madridDate } from "@/lib/opposition-geography";
import styles from "@/app/banco-opositores/banco.module.css";

type CalendarCall = {
  id: string;
  slug: string;
  title: string;
  application_start: string | null;
  application_end: string | null;
  exam_date: string | null;
};

const dates = [
  ["application_start", "Apertura de solicitudes"],
  ["application_end", "Fin de solicitudes"],
  ["exam_date", "Examen"],
] as const;

export default function OppositionCalendar({ territory }: { territory: string }) {
  const [month, setMonth] = useState(() => madridDate().slice(0, 7));
  const [calls, setCalls] = useState<CalendarCall[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ month, territory });
    fetch(`/api/banco-opositores/calendario?${params}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("No se pudo cargar la agenda.");
        return (await response.json()).calls as CalendarCall[];
      })
      .then(setCalls)
      .catch((reason: Error) => { if (!controller.signal.aborted) setError(reason.message); });
    return () => controller.abort();
  }, [month, territory]);

  const events = (calls ?? []).flatMap(call => dates.flatMap(([key, label]) => {
    const date = call[key];
    return date?.startsWith(month) ? [{ call, date, label, key }] : [];
  })).sort((a, b) => a.date.localeCompare(b.date) || a.call.title.localeCompare(b.call.title));

  return (
    <section className={styles.searchPanel} aria-labelledby="calendar-heading">
      <h2 id="calendar-heading">Calendario oficial</h2>
      <label>Mes <input type="month" value={month} onChange={event => {
        if (!event.target.value) return;
        setCalls(null);
        setError("");
        setMonth(event.target.value);
      }} /></label>
      {error && <p role="alert">{error}</p>}
      {!error && !calls && <p role="status">Cargando fechas oficiales…</p>}
      {calls && (events.length ? (
        <ul className={styles.calendarEvents}>{events.map(({ call, date, label, key }) => (
          <li key={`${call.id}-${key}`}>
            <time dateTime={date}>{date.split("-").reverse().join("/")}</time>
            <span>{label}</span>
            <Link href={`/banco-opositores/convocatoria/${call.slug}`}>{call.title}</Link>
          </li>
        ))}</ul>
      ) : <p>No hay fechas oficiales registradas para este mes.</p>)}
    </section>
  );
}
