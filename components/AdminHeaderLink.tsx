"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ADMIN_EMAIL } from "@/lib/course-access";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function AdminHeaderLink({ className, style }: Props) {
  const [isAdministrator, setIsAdministrator] = useState(false);

  useEffect(() => {
    let active = true;

    const updateVisibility = (email?: string | null) => {
      if (active) setIsAdministrator(email?.trim().toLowerCase() === ADMIN_EMAIL);
    };

    supabase.auth.getUser().then(({ data }) => updateVisibility(data.user?.email));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      updateVisibility(session?.user.email);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!isAdministrator) return null;

  return <Link href="/admin" className={className} style={style}>Administración</Link>;
}
