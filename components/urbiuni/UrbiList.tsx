"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/app/urbiuni/urbiuni.module.css";

const KEY = "urbiuni-lista";
const EVENT = "urbiuni-lista";
const MAX = 10;

function readList(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((item): item is string => typeof item === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}

function writeList(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // Sin almacenamiento disponible: la lista dura solo esta visita.
  }
  window.dispatchEvent(new Event(EVENT));
}

function useList(): string[] {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const update = () => setList(readList());
    update();
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return list;
}

function toggle(slug: string, list: string[]) {
  writeList(list.includes(slug) ? list.filter((item) => item !== slug) : [...list, slug]);
}

const Heart = ({ filled }: { filled: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
);

export function SaveButton({ slug, name }: { slug: string; name: string }) {
  const list = useList();
  const saved = list.includes(slug);
  return (
    <button type="button" className={styles.saveButton} aria-pressed={saved} aria-label={saved ? `Quitar ${name} de Mi lista` : `Guardar ${name} en Mi lista`} onClick={() => toggle(slug, list)}>
      <Heart filled={saved} />
    </button>
  );
}

export function SaveWideButton({ slug }: { slug: string }) {
  const list = useList();
  const saved = list.includes(slug);
  return (
    <button type="button" className={styles.saveWide} aria-pressed={saved} onClick={() => toggle(slug, list)}>
      <Heart filled={saved} />
      {saved ? "Guardado en Mi lista" : "Guardar en Mi lista"}
    </button>
  );
}

export function ListLink() {
  const list = useList();
  const href = list.length ? `/urbiuni/comparar?g=${list.join(",")}` : "/urbiuni/comparar";
  return (
    <Link href={href} className={styles.listLink}>
      Mi lista {list.length > 0 && <span className={styles.listCount}>{list.length}</span>}
    </Link>
  );
}

// En el comparador sin opciones en la dirección, abre las guardadas en este navegador.
export function ListRedirect() {
  const router = useRouter();
  const [empty, setEmpty] = useState(false);
  useEffect(() => {
    const list = readList();
    if (list.length) router.replace(`/urbiuni/comparar?g=${list.join(",")}`);
    else setEmpty(true);
  }, [router]);
  if (!empty) return null;
  return (
    <div className={styles.empty}>
      <p>Todavía no has guardado ninguna opción.</p>
      <p>Pulsa el corazón de los grados que te interesen y aparecerán aquí para compararlos.</p>
      <Link href="/urbiuni/buscar" className={styles.button}>Buscar grados</Link>
    </div>
  );
}

export function ClearListButton() {
  const router = useRouter();
  return (
    <button type="button" className={styles.saveWide} onClick={() => { writeList([]); router.push("/urbiuni/comparar"); }}>
      Vaciar Mi lista
    </button>
  );
}
