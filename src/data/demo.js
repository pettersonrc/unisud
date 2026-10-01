import { doctors, scheduleLabel, validSelection } from "./clinic.js";

export const demoNotice =
  "Modo demostración · Las citas y acciones son simuladas; no se envían a la sede.";
export function validPatient(booking) {
  const birth = new Date(`${booking.birth}T12:00:00`);
  return Boolean(
    booking.name?.trim() &&
    booking.document?.trim() &&
    booking.reason?.trim() &&
    booking.consent &&
    ["Nuevo paciente", "Paciente registrado"].includes(booking.patient) &&
    Number.isFinite(birth.getTime()) &&
    birth <= new Date(),
  );
}
export function createDemoAppointments(today = new Date()) {
  return [7, -7].map((offset, index) => {
    const doctor = doctors.find((d) => d.id === "alicia-ovelar");
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + offset,
    );
    while ([0, 6].includes(date.getDay()))
      date.setDate(date.getDate() + (offset > 0 ? 1 : -1));
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return {
      id: `DEMO-00${index + 1}`,
      doctor,
      specialty: doctor.specialty,
      study: "",
      date: iso,
      time: scheduleLabel(doctor.schedules[0]),
      name: "Paciente de ejemplo",
      document: "DEMO-001",
      birth: "1998-04-12",
      patient: "Paciente registrado",
      reason: "Consulta de demostración",
      consent: true,
      status: index ? "completed" : "scheduled",
      sample: true,
    };
  });
}
export function confirmDemoAppointment(appointments, booking, id) {
  if (!validPatient(booking) || !validSelection(booking)) return appointments;
  if (
    booking.editingId &&
    !appointments.some(
      (a) => a.id === booking.editingId && a.status === "scheduled",
    )
  )
    return appointments;
  const appointment = {
    ...booking,
    id: booking.editingId || id,
    status: "scheduled",
    sample: false,
  };
  return booking.editingId
    ? appointments.map((a) => (a.id === booking.editingId ? appointment : a))
    : appointments.some((a) => a.id === id)
      ? appointments
      : [...appointments, appointment];
}
export function cancelDemoAppointment(appointments, id) {
  return appointments.map((a) =>
    a.id === id && a.status === "scheduled" ? { ...a, status: "cancelled" } : a,
  );
}
export const dateLabel = (date) =>
  new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
