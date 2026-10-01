import test from "node:test";
import assert from "node:assert/strict";
import {
  createDemoAppointments,
  validPatient,
  confirmDemoAppointment,
  cancelDemoAppointment,
} from "../src/data/demo.js";
import { validSelection } from "../src/data/clinic.js";

test("exemplos usam dias publicados e identificam o paciente fictício", () => {
  const examples = createDemoAppointments();
  assert.equal(examples.length, 2);
  assert.ok(
    examples.every((a) => a.sample && a.name === "Paciente de ejemplo"),
  );
  assert.ok(validSelection(examples[0]));
  assert.equal(examples[1].status, "completed");
});
test("confirmação exige paciente e horário válidos e não duplica a mesma ação", () => {
  const booking = createDemoAppointments()[0];
  assert.equal(validPatient({ ...booking, birth: "2999-01-01" }), false);
  assert.equal(validPatient({ ...booking, name: " " }), false);
  assert.equal(validPatient({ ...booking, patient: "" }), false);
  assert.deepEqual(
    confirmDemoAppointment([], { ...booking, consent: false }, "NEW"),
    [],
  );
  const saved = confirmDemoAppointment([], booking, "NEW");
  assert.equal(saved.length, 1);
  assert.equal(saved[0].sample, false);
  assert.equal(confirmDemoAppointment(saved, booking, "NEW").length, 1);
});
test("cancelamento mantém registro e reprogramação substitui somente a cita ativa", () => {
  const examples = createDemoAppointments();
  const changed = confirmDemoAppointment(
    examples,
    { ...examples[0], editingId: examples[0].id, name: "Ejemplo actualizado" },
    "UNUSED",
  );
  assert.equal(changed.length, 2);
  assert.equal(changed[0].name, "Ejemplo actualizado");
  assert.deepEqual(changed[1], examples[1]);
  const cancelled = cancelDemoAppointment(changed, changed[0].id);
  assert.equal(cancelled[0].status, "cancelled");
  assert.equal(cancelled.length, 2);
  assert.deepEqual(
    confirmDemoAppointment(
      cancelled,
      { ...examples[0], editingId: examples[0].id },
      "UNUSED",
    ),
    cancelled,
  );
});
