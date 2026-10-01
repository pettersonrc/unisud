// Fonte: IMG_1321–IMG_1325 fornecidas pelo usuário.
// weekday usa a convenção de Date: domingo = 0, segunda = 1.
// end ausente significa que a imagem informa apenas o horário inicial.
const schedule = (weekday, start, end) => ({
  weekday,
  start,
  ...(end ? { end } : {}),
});
export const clinic = {
  name: "Sede Unisud",
  city: "Pedro Juan Caballero",
  phone: "+595 992 311 119",
  phoneLink: "tel:+595992311119",
  notice:
    "Los horarios pueden estar sujetos a modificaciones. Se recomienda confirmar previamente la disponibilidad.",
};
export const specialties = [
  "Cirugía general",
  "Ginecología",
  "Pediatría",
  "Clínica médica",
  "Imágenes",
];
export const doctors = [
  {
    id: "carmen-perez-salum",
    name: "Dra. Carmen Pérez Salum",
    specialty: specialties[0],
    schedules: [schedule(2, "09:00", "11:00")],
  },
  {
    id: "jorge-alvarez",
    name: "Dr. Jorge Álvarez",
    specialty: specialties[0],
    schedules: [schedule(4, "09:30", "11:30")],
  },
  {
    id: "jose-caceres",
    name: "Dr. José Cáceres",
    specialty: specialties[0],
    schedules: [schedule(1, "08:00", "10:00"), schedule(5, "10:00", "12:00")],
  },
  {
    id: "hugo-noguera",
    name: "Dr. Hugo Noguera",
    specialty: specialties[1],
    schedules: [schedule(5, "13:00", "15:00")],
  },
  {
    id: "sara-barreto",
    name: "Dra. Sara Barreto",
    specialty: specialties[1],
    schedules: [schedule(3, "13:00", "15:00")],
  },
  {
    id: "romina-chamorro",
    name: "Dra. Romina Chamorro",
    specialty: specialties[1],
    schedules: [schedule(3, "17:00", "19:00")],
  },
  {
    id: "antonella-romano",
    name: "Dra. Antonella Romano",
    specialty: specialties[1],
    schedules: [
      schedule(2, "11:00", "12:00"),
      schedule(3, "16:00", "18:00"),
      schedule(5, "10:00", "14:00"),
    ],
  },
  {
    id: "veronica-martins",
    name: "Dra. Verónica Martins",
    specialty: specialties[1],
    schedules: [schedule(5, "11:00", "13:00")],
  },
  {
    id: "diego-berto",
    name: "Dr. Diego Berto",
    specialty: specialties[1],
    schedules: [schedule(5, "11:00", "13:00")],
  },
  {
    id: "clara-shirakawa",
    name: "Dra. Clara Shirakawa",
    specialty: specialties[1],
    schedules: [schedule(4, "07:00", "09:00"), schedule(4, "17:00", "19:00")],
  },
  {
    id: "alberto-gracia",
    name: "Dr. Alberto Gracia",
    specialty: specialties[2],
    schedules: [
      schedule(1, "11:00"),
      schedule(2, "15:00"),
      schedule(4, "15:00"),
    ],
  },
  {
    id: "karen-orue",
    name: "Dra. Karen Orue",
    specialty: specialties[2],
    schedules: [schedule(3, "11:00", "13:00"), schedule(4, "07:00", "09:00")],
  },
  {
    id: "monica-denis",
    name: "Dra. Mónica Denis",
    specialty: specialties[2],
    schedules: [
      schedule(1, "12:00", "14:00"),
      schedule(2, "18:00", "20:00"),
      schedule(5, "16:00", "18:00"),
    ],
  },
  {
    id: "alicia-ovelar",
    name: "Dra. Alicia Ovelar",
    specialty: specialties[3],
    schedules: [1, 2, 3, 4, 5].map((day) => schedule(day, "08:00", "11:00")),
  },
  {
    id: "jorge-gabriel-gomez",
    name: "Dr. Jorge Gabriel Gómez",
    specialty: specialties[3],
    schedules: [schedule(2, "08:00", "10:00"), schedule(2, "10:00", "12:00")],
  },
  {
    id: "ignacia-borjes",
    name: "Dra. Ignacia Borjes",
    specialty: specialties[3],
    schedules: [schedule(1, "16:00", "19:00")],
  },
  {
    id: "nelson-bobadilla",
    name: "Dr. Nelson Bobadilla",
    specialty: specialties[3],
    schedules: [schedule(1, "15:00", "19:00"), schedule(3, "09:30", "13:00")],
  },
  {
    id: "vivian-gimenez",
    name: "Dra. Vivian Giménez",
    specialty: specialties[3],
    schedules: [schedule(3, "07:30"), schedule(5, "14:00")],
  },
  {
    id: "jose-prado",
    name: "Dr. José Prado",
    specialty: specialties[4],
    study: "Ecografía General",
    byPhone: true,
    schedules: [],
  },
  {
    id: "alfredo-ferreira",
    name: "Dr. Alfredo Ferreira",
    specialty: specialties[4],
    study: "Ecocardiograma Adulto",
    schedules: [schedule(3, "10:00")],
  },
  {
    id: "milena-gimenez",
    name: "Dra. Milena Giménez",
    specialty: specialties[4],
    study: "Ecocardiograma Pediátrico",
    schedules: [schedule(1, "16:30")],
  },
];
export const studies = doctors.filter((d) => d.study).map((d) => d.study);
export const weekdays = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
export const scheduleLabel = (s) => (s.end ? `${s.start}–${s.end}` : s.start);
export const dayCount = (d) => new Set(d.schedules.map((s) => s.weekday)).size;
export const schedulesOn = (doctor, date) =>
  doctor?.schedules.filter((s) => s.weekday === date.getDay()) || [];
export function availableDates(doctor, year, month, today = new Date()) {
  const current = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return Array.from(
    { length: new Date(year, month + 1, 0).getDate() },
    (_, i) => i + 1,
  ).filter((day) => {
    const date = new Date(year, month, day);
    return date >= current && schedulesOn(doctor, date).length > 0;
  });
}
export function validSelection(booking) {
  const doctor = doctors.find((d) => d.id === booking.doctor?.id);
  if (
    !doctor ||
    doctor.specialty !== booking.specialty ||
    (booking.study && doctor.study !== booking.study) ||
    !booking.date ||
    !booking.time
  )
    return false;
  const date = new Date(`${booking.date}T12:00:00`);
  if (!Number.isFinite(date.getTime())) return false;
  return (
    availableDates(doctor, date.getFullYear(), date.getMonth()).includes(
      date.getDate(),
    ) &&
    schedulesOn(doctor, date).some((s) => scheduleLabel(s) === booking.time)
  );
}
