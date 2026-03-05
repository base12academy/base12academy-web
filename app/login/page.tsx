"use client"; 

import { useState } from "react"; 
import { supabase } from "@/lib/supabaseClient"; 

export default function Login() { const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); async function login() { setMessage("Iniciando sesión..."); const { error } = await supabase.auth.signInWithPassword({ email, password, }); if (error) setMessage("ERROR: " + error.message); else setMessage("Sesión iniciada ✅"); } return ( <div style={{ padding: 40 }}> <h1>Login Base12 Academy</h1> <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br /> <br /> <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> <br /> <br /> <button onClick={login}>Entrar</button> <p>{message}</p> </div> ); }