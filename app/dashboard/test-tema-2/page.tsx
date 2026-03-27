"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function TestTema2Page() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      const { data: perfil } = user
        ? await supabase
            .from("perfiles")
            .select("acceso")
            .eq("user_id", user.id)
            .maybeSingle()
        : { data: null };

      setAllowed(perfil?.acceso === true);
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) {
    return <div style={{ padding: "32px" }}>Cargando...</div>;
  }

  if (!allowed) {
    return (
      <div style={{ padding: "32px" }}>
        <h1>🔒 Test bloqueado</h1>
        <p>No tienes acceso.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      <h1>Test Tema 2</h1>
      <p>Aquí irá el test del tema 2.</p>
    </div>
  );
}