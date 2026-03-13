import type { CollectionEntry } from "astro:content";

export const formatMonthYear = (date: Date) =>
  date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

export const formatFullDate = (date: Date) =>
  date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const isUpcomingEvent = (event: CollectionEntry<"events">, reference = new Date()) => {
  const eventEnd = event.data.endDate ?? event.data.startDate;
  return eventEnd >= reference;
};

export const eventStatusLabel = (event: CollectionEntry<"events">, reference = new Date()) => {
  if (isUpcomingEvent(event, reference)) {
    return "Programacao prevista";
  }

  if (event.data.status === "comemorativo") {
    return "Registro comemorativo";
  }

  return "Evento realizado";
};

export const documentCategoryLabel = (category: CollectionEntry<"documents">["data"]["category"]) => {
  const labels = {
    regulation: "Normativo institucional",
    membership: "Associacao",
    newsletter: "Informativo",
  };

  return labels[category];
};
