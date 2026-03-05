"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {

  const [status, setStatus] = useState("probando conexión...");

  useEffect(() => {

    async function testConnection() {

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus("ERROR: " + error.message);
      } else {
        setStatus("Supabase conectado correctamente ✅");
      }

    }

    testConnection();

  }, []);

  return (
    <main style={{padding:40}}>
      <h1>Base12 Academy</h1>
      <p>{status}</p>
    </main>
  );
}