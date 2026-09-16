"use client";

import { useEffect } from "react";

const MATEMATICAS_II_LANDING = "/bachillerato-pau/matematicas-ii#modalidades";

const planSlug: Record<string, string> = {
  Esencial: "esencial",
  "Estándar": "estandar",
  PAU: "pau",
};

function enhanceMatematicasIIModal() {
  const modals = Array.from(document.querySelectorAll<HTMLElement>(".original-modal"));

  for (const modal of modals) {
    const title = modal.querySelector<HTMLElement>("#modal-course-title")?.textContent?.trim();
    if (title !== "Matemáticas II") continue;

    const activePlan = modal
      .querySelector<HTMLElement>(".original-plan-option.active .original-plan-select b")
      ?.textContent?.trim();
    const selectedPlan = activePlan && planSlug[activePlan] ? planSlug[activePlan] : "esencial";

    const checkoutButton = modal.querySelector<HTMLButtonElement>(".original-checkout button");
    if (!checkoutButton) continue;

    checkoutButton.disabled = false;
    checkoutButton.textContent = "Continuar con la matrícula";
    checkoutButton.dataset.mat2Plan = selectedPlan;
    checkoutButton.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const selected = checkoutButton.dataset.mat2Plan || "esencial";
      window.location.assign(`/dashboard/comprar/matematicas-ii-${selected}`);
    };
  }
}

export default function MatematicasIICatalogRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("curso") === "matematicas-ii") {
      window.location.replace(MATEMATICAS_II_LANDING);
      return;
    }

    const handleCatalogClick = (event: MouseEvent) => {
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

    document.addEventListener("click", handleCatalogClick, true);

    enhanceMatematicasIIModal();
    const observer = new MutationObserver(() => enhanceMatematicasIIModal());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "disabled"],
    });

    return () => {
      document.removeEventListener("click", handleCatalogClick, true);
      observer.disconnect();
    };
  }, []);

  return null;
}
