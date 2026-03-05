"use client"; 

import { useEffect, useState } from "react"; 
import { supabase } from "@/lib/supabaseClient"; 
import { useRouter } from "next/navigation"; 

export default function Dashboard() { const router = useRouter(); const [loading, setLoading] = useState(true); const [email, setEmail] = useState<string | null>(null); useEffect(() => { async function load() { const { data, error } = await supabase.auth.getUser(); if (error || !data?.user) { router.push("/login"); return; } setEmail(data.user.email ?? null); setLoading(false); } load(); }, [router]); async function logout() { await supabase.auth.signOut(); router.push("/login"); } if (loading) return <div style={{ padding: 40 }}>Cargando...</div>; return ( <div style={{ padding: 40 }}> <h1>Dashboard Base12 Academy</h1> <p>Sesión iniciada como: <b>{email}</b></p> <hr style={{ margin: "20px 0" }} /> <h2>Panel del alumno</h2> <ul> <li>📚 Mis cursos</li> <li>🤖 Chat IA de dudas (lo haremos después)</li> <li>✅ Progreso</li> </ul> <button onClick={logout} style={{ marginTop: 20 }}> Cerrar sesión </button> </div> ); }