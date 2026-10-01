import { doctors, specialties, studies } from "./clinic.js";

export function parseRoute(hash) {
  const [path, query = ""] = hash.replace(/^#/, "").split("?");
  const pages = [
    "home",
    "dashboard",
    "schedule",
    "doctors",
    "review",
    "success",
    "appointments",
    "history",
    "specialties",
    "profile",
    "preferences",
    "exams",
    "notices",
  ];
  const page = pages.includes(path) ? path : "home";
  const params = new URLSearchParams(query);
  const specialty =
    page === "doctors" && specialties.includes(params.get("specialty"))
      ? params.get("specialty")
      : "";
  const study =
    specialty === "Imágenes" && studies.includes(params.get("study"))
      ? params.get("study")
      : "";
  return { page, specialty, study };
}
export function routeHash(page, filters = {}) {
  const params = new URLSearchParams();
  if (page === "doctors" && specialties.includes(filters.specialty)) {
    params.set("specialty", filters.specialty);
    if (filters.specialty === "Imágenes" && studies.includes(filters.study))
      params.set("study", filters.study);
  }
  return `#${page}${params.size ? `?${params}` : ""}`;
}
export function filterDoctors({
  specialty = "",
  study = "",
  search = "",
  moreAvailability = false,
} = {}) {
  return doctors.filter(
    (d) =>
      (!specialty || d.specialty === specialty) &&
      (!study || d.study === study) &&
      d.name.toLocaleLowerCase("es").includes(search.toLocaleLowerCase("es")) &&
      (!moreAvailability ||
        new Set(d.schedules.map((s) => s.weekday)).size >= 3),
  );
}
