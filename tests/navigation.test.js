import test from "node:test";
import assert from "node:assert/strict";
import {
  parseRoute,
  routeHash,
  filterDoctors,
} from "../src/data/navigation.js";
import { specialties, doctors } from "../src/data/clinic.js";
test("acesso geral não herda especialidade, estudo ou filtros de URL", () => {
  assert.deepEqual(parseRoute(routeHash("doctors")), {
    page: "doctors",
    specialty: "",
    study: "",
  });
  assert.equal(filterDoctors(parseRoute("#doctors")).length, 21);
  assert.deepEqual(
    parseRoute("#doctors?specialty=inexistente&study=Ecografía+General"),
    { page: "doctors", specialty: "", study: "" },
  );
});
test("seleção manual lista somente os profissionais da especialidade", () => {
  for (const specialty of specialties) {
    const route = parseRoute(routeHash("doctors", { specialty }));
    const selected = filterDoctors(route);
    assert.equal(
      selected.length,
      doctors.filter((d) => d.specialty === specialty).length,
    );
    assert.ok(selected.every((d) => d.specialty === specialty));
  }
  assert.equal(filterDoctors({ specialty: "" }).length, 21);
});
test("agendamento preserva seleção explícita e estudo compatível", () => {
  const route = parseRoute(
    routeHash("doctors", {
      specialty: "Imágenes",
      study: "Ecocardiograma Pediátrico",
    }),
  );
  assert.deepEqual(
    filterDoctors(route).map((d) => d.id),
    ["milena-gimenez"],
  );
  assert.equal(
    parseRoute("#doctors?specialty=Pediatría&study=Ecografía+General").study,
    "",
  );
});
