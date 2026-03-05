"use client";

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Register() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function register() {

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Cuenta creada correctamente ✅")
    }
  }

  return (
    <div style={{padding:40}}>
      <h1>Registro Base12 Academy</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={register}>
        Crear cuenta
      </button>

      <p>{message}</p>

    </div>
  )
}