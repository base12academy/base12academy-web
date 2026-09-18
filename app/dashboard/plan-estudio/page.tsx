"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Plan = {
  study_days: string[] | null;
  study_time: string | null;
  session_duration_minutes: number | null;
  exam_date: string | null;
  exam_place: string | null;
  objective: string | null;
  reminder_30_minutes: boolean;
  reminder_5_minutes: boolean;
};

const COURSE_SLUG = "matematicas-aplicadas-ccss";

export default function StudyPlanPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (alive) {
          setError("Debes iniciar sesión para consultar tu plan.");
          setLoading(false);
        }
        return;
      }

      const { data: enrollment, error: enrollmentError } = await supabase
        .from("course_enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_slug", COURSE_SLUG)
        .in("status", ["active", "pending"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (enrollmentError || !enrollment) {
        if (alive) {
          setError("No se ha encontrado una matrícula de Matemáticas Aplicadas.");
          setLoading(false);
        }
        return;
      }

      const { data: studyPlan, error: planError } = await supabase
        .from("study_plans")
        .select("study_days,study_time,session_duration_minutes,exam_date,exam_place,objective,reminder_30_minutes,reminder_5_minutes")
        .eq("user_id", user.id)
        .eq("enrollment_id", enrollment.id)
        .maybeSingle();

      if (!alive) return;

      if (planError) {
        setError("No se ha podido cargar tu plan de estudio.");
      } else if (!studyPlan) {
        setError("Todavía no hay un plan de estudio guardado para esta matrícula.");
      } else {
        setPlan(studyPlan as Plan);
      }

      setLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  const duration = plan?.session_duration_minutes
    ? String(plan.session_duration_minutes) + " minutos"
    : "No indicada";

  const reminders = plan
    ? [
        plan.reminder_30_minutes ? "30 min" : "",
        plan.reminder_5_minutes ? "5 min" : "",
      ].filter(Boolean).join(" y ") || "Desactivados"
    : "";

  return (
    <main style={{ minHeight: "100vh", background: "#f6f9fd", padding: "40px 24px", color: "#102447" }}>
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <Link href="/dashboard/matematicas-aplicadas-ccss" style={{ color: "#155eef", fontWeight: 700, textDecoration: "none" }}>
          ← Volver al aula
        </Link>

        <div style={{ marginTop: 18, background: "#fff", border: "1px solid #dbe5f3", borderRadius: 18, padding: 28, boxShadow: "0 8px 28px rgba(15,49,92,.06)" }}>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: ".08em", color: "#cc8300" }}>FERNANDO · TUTOR IA</span>
          <h1 style={{ margin: "8px 0 6px", fontSize: 32, color: "#102d62" }}>Mi plan de estudio</h1>
          <p style={{ margin: "0 0 24px", color: "#607089" }}>Matemáticas Aplicadas a las Ciencias Sociales II</p>

          {loading ? (
            <p>Cargando tu planificación…</p>
          ) : error ? (
            <div style={{ padding: 14, borderRadius: 10, background: "#fff7ed", color: "#9a3412", fontWeight: 700 }}>{error}</div>
          ) : plan ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
              <Card title="Días de estudio" value={(plan.study_days || []).join(", ") || "No indicados"} />
              <Card title="Horario habitual" value={plan.study_time || "No indicado"} />
              <Card title="Duración de sesión" value={duration} />
              <Card title="Fecha de examen" value={plan.exam_date ? new Date(plan.exam_date + "T00:00:00").toLocaleDateString("es-ES") : "No indicada"} />
              <Card title="Lugar del examen" value={plan.exam_place || "No indicado"} />
              <Card title="Objetivo" value={plan.objective || "No indicado"} />
              <Card title="Recordatorios" value={reminders} />
            </div>
          ) : null}

          <p style={{ marginTop: 22, color: "#607089", fontSize: 13, lineHeight: 1.55 }}>
            Fernando utiliza esta planificación para generar tus recordatorios de estudio vinculados a Telegram.
          </p>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <article style={{ border: "1px solid #e1e8f1", borderRadius: 12, padding: 16, background: "#fbfdff" }}>
      <strong style={{ display: "block", fontSize: 12, color: "#526d89", marginBottom: 7 }}>{title}</strong>
      <span style={{ fontSize: 16, fontWeight: 700, color: "#123766" }}>{value}</span>
    </article>
  );
}
