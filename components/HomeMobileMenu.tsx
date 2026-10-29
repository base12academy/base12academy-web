"use client";

import { useRef, useState } from "react";
import HomeCatalogLink from "./HomeCatalogLink";
import styles from "@/app/home.module.css";

export default function HomeMobileMenu() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <div className={styles.mobileMenu} onKeyDown={(event) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    }}>
      <button ref={toggle} type="button" aria-expanded={open} aria-controls="home-mobile-menu" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}>
        <span aria-hidden="true">{open ? "×" : "☰"}</span>
      </button>
      {open && <nav id="home-mobile-menu" aria-label="Navegación móvil" onClick={(event) => {
        if ((event.target as HTMLElement).closest("a")) setOpen(false);
      }}>
        <HomeCatalogLink family="oposiciones">Oposiciones</HomeCatalogLink>
        <HomeCatalogLink family="bachillerato">Bachillerato y PAU</HomeCatalogLink>
        <HomeCatalogLink family="clases">Clases online</HomeCatalogLink>
        <HomeCatalogLink family="tropa">Tropa y Marinería</HomeCatalogLink>
        <HomeCatalogLink family="cursos">Cursos online</HomeCatalogLink>
        <a href="#aplicaciones">Aplicaciones y recursos</a>
        <a href="#metodo">Cómo funciona</a>
        <a href="#equipo">Sobre Base12</a>
        <a href="#contacto">Contacto</a>
      </nav>}
    </div>
  );
}
