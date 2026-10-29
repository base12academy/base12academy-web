"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

const families: Record<string, string> = {
  oposiciones: "Oposiciones",
  bachillerato: "Bachillerato y PAU",
  clases: "Clases Online",
  tropa: "Tropa y Marinería",
  cursos: "Cursos Online",
};

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  family: keyof typeof families;
};

export default function HomeCatalogLink({ family, children, onClick, ...props }: Props) {
  function select(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const catalog = document.getElementById("catalogo");
    if (!catalog) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("b12:select-family", { detail: families[family] }));
    window.history.replaceState(null, "", `/?familia=${family}#catalogo`);
    catalog.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    catalog.focus({ preventScroll: true });
  }

  return <a {...props} href={`/?familia=${family}#catalogo`} onClick={select}>{children}</a>;
}
