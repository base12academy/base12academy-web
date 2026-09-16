"use client";

import { useEffect } from "react";

const MATEMATICAS_II_LANDING = "/bachillerato-pau/matematicas-ii#modalidades";

export default function MatematicasIICatalogRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("curso") === "matematicas-ii") {
      window.location.replace(MATEMATICAS_II_LANDING);
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("button");
      if (!button || button.textContent?.trim() !== "Ver modalidades") return;

      const card = button.closest("article");
      const title = card?.querySelector("h3")?.textContent?.trim();
      if (title !== "Matemáticas II") return;

      event.preventDefault();
      event.stopPropagation();
      window.location.assign(MATEMATICAS_II_LANDING);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
