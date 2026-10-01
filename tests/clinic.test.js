import test from "node:test";
import assert from "node:assert/strict";
import {
  doctors,
  specialties,
  availableDates,
  schedulesOn,
  scheduleLabel,
  validSelection,
} from "../src/data/clinic.js";
const find = (id) => doctors.find((d) => d.id === id);
test("catálogo completo das cinco imagens, sem fotos ou médicos fictícios", () => {
  assert.equal(specialties.length, 5);
  assert.equal(doctors.length, 21);
  assert.equal(new Set(doctors.map((d) => d.id)).size, 21);
  assert.equal(
    doctors.reduce((n, d) => n + d.schedules.length, 0),
    36,
  );
  for (const d of doctors) {
    assert.ok(specialties.includes(d.specialty));
    assert.equal("photo" in d, false);
  }
  assert.deepEqual(
    specialties.map((s) => doctors.filter((d) => d.specialty === s).length),
    [3, 7, 3, 5, 3],
  );
});
test("calendário deriva o dia semanal e bloqueia datas passadas", () => {
  const carmen = find("carmen-perez-salum");
  assert.deepEqual(
    availableDates(carmen, 2026, 9, new Date(2026, 8, 30)),
    [6, 13, 20, 27],
  );
  assert.deepEqual(
    availableDates(carmen, 2026, 9, new Date(2026, 9, 14)),
    [20, 27],
  );
  assert.deepEqual(availableDates(carmen, 2026, 8, new Date(2026, 8, 30)), []);
  assert.deepEqual(
    schedulesOn(carmen, new Date(2026, 9, 6)).map(scheduleLabel),
    ["09:00–11:00"],
  );
  assert.deepEqual(schedulesOn(carmen, new Date(2026, 9, 7)), []);
});
test("preserva duas faixas no mesmo dia, sem criar intervalos intermediários", () => {
  assert.deepEqual(
    schedulesOn(find("clara-shirakawa"), new Date(2026, 9, 8)).map(
      scheduleLabel,
    ),
    ["07:00–09:00", "17:00–19:00"],
  );
  assert.deepEqual(
    schedulesOn(find("jorge-gabriel-gomez"), new Date(2026, 9, 6)).map(
      scheduleLabel,
    ),
    ["08:00–10:00", "10:00–12:00"],
  );
});
test("horários sem término e ecografia por chamada não recebem durações inventadas", () => {
  const alberto = find("alberto-gracia");
  assert.equal(scheduleLabel(alberto.schedules[0]), "11:00");
  assert.equal(alberto.schedules[0].end, undefined);
  assert.deepEqual(find("vivian-gimenez").schedules, [
    { weekday: 3, start: "07:30" },
    { weekday: 5, start: "14:00" },
  ]);
  const jose = find("jose-prado");
  assert.equal(jose.byPhone, true);
  assert.deepEqual(availableDates(jose, 2026, 9), []);
  assert.deepEqual(find("milena-gimenez").schedules, [
    { weekday: 1, start: "16:30" },
  ]);
});
test("revisão bloqueia especialidade, estudo, dia ou horário incompatível", () => {
  const doctor = find("carmen-perez-salum");
  // Primeira terça-feira do próximo ano, para manter a verificação independente do dia de execução.
  const future = new Date(new Date().getFullYear() + 1, 0, 1);
  while (future.getDay() !== 2) future.setDate(future.getDate() + 1);
  const date = `${future.getFullYear()}-01-${String(future.getDate()).padStart(2, "0")}`;
  const booking = {
    specialty: "Cirugía general",
    study: "",
    doctor,
    date,
    time: "09:00–11:00",
  };
  assert.equal(validSelection(booking), true);
  assert.equal(validSelection({ ...booking, specialty: "Pediatría" }), false);
  assert.equal(validSelection({ ...booking, time: "09:30" }), false);
  assert.equal(
    validSelection({ ...booking, study: "Ecografía General" }),
    false,
  );
  assert.equal(validSelection({ ...booking, date: "2020-01-07" }), false);
});
