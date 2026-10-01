import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  X,
  Check,
} from "lucide-react";
import { filterDoctors } from "../data/navigation";
import { Button, Logo } from "../components/UI";
import { validPatient, dateLabel } from "../data/demo";
import {
  specialties,
  studies,
  clinic,
  weekdays,
  scheduleLabel,
  dayCount,
  schedulesOn,
  availableDates,
  validSelection,
} from "../data/clinic";
const initials = (name) =>
  name
    .replace(/^Dra?\.\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
export function Schedule({ booking, setBooking, navigate }) {
  const [error, setError] = useState("");
  return (
    <div className="medical-background">
      <form
        className="schedule-card card"
        onSubmit={(e) => {
          e.preventDefault();
          if (!validPatient(booking)) {
            setError("Revisa los datos obligatorios y la fecha de nacimiento.");
            return;
          }
          if (validSelection(booking)) {
            navigate("review");
            return;
          }
          navigate("doctors", {
            specialty: booking.specialty,
            study: booking.study,
          });
        }}
      >
        <h1 tabIndex={-1}>Agendar consulta</h1>
        <p className="flow-progress">
          1. Datos del paciente → 2. Profesional y horario → 3. Confirmación
        </p>
        <p className="appointment-note">
          Demostración: utiliza datos de ejemplo. No se realizará una reserva
          real.
        </p>
        {booking.doctor && (
          <p className="selected-booking">
            Horario seleccionado: {booking.doctor.name} ·{" "}
            {dateLabel(booking.date)} · {booking.time}
          </p>
        )}
        <p className="form-caption">* Campos obligatorios</p>
        <label className="specialty-label">
          Selecciona la especialidad:
          <select
            value={booking.specialty}
            onChange={(e) =>
              setBooking({
                ...booking,
                specialty: e.target.value,
                study: "",
                doctor: null,
                date: "",
                time: "",
              })
            }
          >
            {specialties.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className="form-grid">
          <label>
            Nombre y apellidos <em>*</em>
            <input
              required
              autoComplete="name"
              value={booking.name}
              onChange={(e) => setBooking({ ...booking, name: e.target.value })}
              placeholder="Nombre del paciente"
            />
          </label>
          <label>
            Documento <em>*</em>
            <input
              required
              value={booking.document}
              onChange={(e) =>
                setBooking({ ...booking, document: e.target.value })
              }
              placeholder="Número de documento"
            />
          </label>
          <label>
            Especialidad
            <input value={booking.specialty} readOnly />
          </label>
          <label>
            Fecha de nacimiento <em>*</em>
            <input
              type="date"
              required
              max={new Date().toLocaleDateString("en-CA")}
              value={booking.birth}
              onInput={(e) =>
                setBooking({ ...booking, birth: e.currentTarget.value })
              }
              onChange={(e) =>
                setBooking({ ...booking, birth: e.target.value })
              }
            />
          </label>
          <label>
            Paciente <em>*</em>
            <select
              required
              value={booking.patient}
              onChange={(e) =>
                setBooking({ ...booking, patient: e.target.value })
              }
            >
              <option value="">Seleccionar</option>
              <option>Nuevo paciente</option>
              <option>Paciente registrado</option>
            </select>
          </label>
          <label>
            {booking.specialty === "Imágenes" ? "Estudio" : "Horario"}
            {booking.specialty === "Imágenes" ? (
              <select
                value={booking.study}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    study: e.target.value,
                    doctor: null,
                    date: "",
                    time: "",
                  })
                }
              >
                <option value="">Todos los estudios</option>
                {studies.map((study) => (
                  <option key={study}>{study}</option>
                ))}
              </select>
            ) : (
              <input value="Según el profesional" readOnly />
            )}
          </label>
        </div>
        <label>
          Motivo de la consulta <em>*</em>
          <input
            required
            placeholder="Indica el motivo de la consulta"
            value={booking.reason}
            onChange={(e) => setBooking({ ...booking, reason: e.target.value })}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            required
            checked={booking.consent}
            onChange={(e) =>
              setBooking({ ...booking, consent: e.target.checked })
            }
          />
          Confirmo los datos de la consulta
        </label>
        <div className="form-actions">
          <button
            type="button"
            className="text-link"
            onClick={() => navigate("dashboard")}
          >
            Volver
          </button>
          <Button>
            {booking.doctor ? "Revisar consulta" : "Ver médicos disponibles"}
          </Button>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
export function Doctors({
  search,
  booking,
  setBooking,
  navigate,
  doctorFilters,
  setDoctorFilters,
  setSearch,
}) {
  const [filter, setFilter] = useState("Todos los médicos");
  const [calendar, setCalendar] = useState(null);
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [day, setDay] = useState(null);
  const [time, setTime] = useState("");
  const [tab, setTab] = useState("date");
  const dates = availableDates(calendar, year, month);
  const windows = day ? schedulesOn(calendar, new Date(year, month, day)) : [];
  useEffect(() => {
    if (!calendar) return;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = document.querySelector(".calendar-modal");
    const focusable = () => [
      ...dialog.querySelectorAll("button:not(:disabled),a[href],select,input"),
    ];
    focusable()[0]?.focus();
    function keydown(e) {
      if (e.key === "Escape") setCalendar(null);
      if (e.key === "Tab") {
        const items = focusable();
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [calendar]);
  const monthName = new Intl.DateTimeFormat("es", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
  function changeMonth(delta) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setDay(null);
    setTime("");
  }
  const matching = filterDoctors({
    specialty: doctorFilters.specialty,
    study: doctorFilters.study,
    search,
    moreAvailability: filter !== "Todos los médicos",
  });
  useEffect(() => {
    setCalendar(null);
    setDay(null);
    setTime("");
  }, [doctorFilters.specialty, doctorFilters.study]);
  return (
    <>
      <h1 tabIndex={-1}>Médicos disponibles</h1>
      <p className="page-intro">
        Elige un profesional y consulta sus días de atención. La reserva de este
        prototipo es simulada.
      </p>
      <div className="doctors-panel">
        <div className="section-heading">
          <div className="directory-filters">
            <select
              aria-label="Filtrar por especialidad"
              value={doctorFilters.specialty}
              onChange={(e) =>
                setDoctorFilters({ specialty: e.target.value, study: "" })
              }
            >
              <option value="">Todas las especialidades</option>
              {specialties.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            {doctorFilters.specialty === "Imágenes" && (
              <select
                aria-label="Filtrar por estudio"
                value={doctorFilters.study}
                onChange={(e) =>
                  setDoctorFilters({ ...doctorFilters, study: e.target.value })
                }
              >
                <option value="">Todos los estudios</option>
                {studies.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
          <select
            aria-label="Filtrar médicos"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Todos los médicos</option>
            <option>Mayor disponibilidad</option>
          </select>
        </div>
        <div className="doctor-list">
          <p className="directory-count" role="status">
            {matching.length}{" "}
            {matching.length === 1
              ? "profesional encontrado"
              : "profesionales encontrados"}
          </p>
          {matching.map((d) => (
            <article className="doctor-card card" key={d.id}>
              <div className="doctor-initials" aria-hidden="true">
                {initials(d.name)}
              </div>
              <div>
                <h2>{d.name}</h2>
                <p className="doctor-specialty">{d.study || d.specialty}</p>
                <div className="published-schedules">
                  {d.byPhone ? (
                    <p>Al llamado, previo agendamiento</p>
                  ) : d.id === "alicia-ovelar" ? (
                    <p>Lunes a viernes · {scheduleLabel(d.schedules[0])}</p>
                  ) : (
                    d.schedules.map((s, i) => (
                      <p key={i}>
                        {weekdays[s.weekday]} · {scheduleLabel(s)}
                      </p>
                    ))
                  )}
                </div>
                <div className="badges">
                  <span>
                    <CalendarDays size={13} />
                    {d.byPhone
                      ? "Agendamiento por llamada"
                      : `${dayCount(d)} ${dayCount(d) === 1 ? "día" : "días"} de atención por semana`}
                  </span>
                  <span>
                    <MapPin size={13} />
                    {clinic.name}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => {
                  setBooking({
                    ...booking,
                    specialty: d.specialty,
                    study: d.study || "",
                    doctor: null,
                    date: "",
                    time: "",
                  });
                  setCalendar(d);
                  const current = new Date();
                  const firstMonth = availableDates(
                    d,
                    current.getFullYear(),
                    current.getMonth(),
                  ).length
                    ? current
                    : new Date(
                        current.getFullYear(),
                        current.getMonth() + 1,
                        1,
                      );
                  setYear(firstMonth.getFullYear());
                  setMonth(firstMonth.getMonth());
                  setDay(null);
                  setTime("");
                  setTab("date");
                }}
              >
                {d.byPhone ? "Consultar agendamiento" : "Ver horarios"}
              </Button>
            </article>
          ))}
          {!matching.length && (
            <div className="card empty-state" role="status">
              <h2>No se encontraron médicos</h2>
              <p>
                Prueba otro nombre o restablece los filtros para ver el catálogo
                completo.
              </p>
              <Button
                secondary
                onClick={() => {
                  setSearch("");
                  setFilter("Todos los médicos");
                  setDoctorFilters({ specialty: "", study: "" });
                }}
              >
                Limpiar búsqueda y filtros
              </Button>
            </div>
          )}
        </div>
        <button className="text-link" onClick={() => navigate("schedule")}>
          Agendar con datos del paciente
        </button>
      </div>
      {calendar && (
        <div className="modal-backdrop" onClick={() => setCalendar(null)}>
          <section
            className="calendar-modal card"
            role="dialog"
            aria-modal="true"
            aria-label="Seleccionar fecha y horario"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close icon-button"
              aria-label="Cerrar calendario"
              onClick={() => setCalendar(null)}
            >
              <X size={18} />
            </button>
            {calendar.byPhone ? (
              <div className="phone-booking">
                <h2>{calendar.study}</h2>
                <p>{calendar.name}</p>
                <p>Al llamado, previo agendamiento.</p>
                <a className="button" href={clinic.phoneLink}>
                  Llamar al {clinic.phone}
                </a>
                <p>
                  {clinic.name} · {clinic.city}
                </p>
                <small>{clinic.notice}</small>
              </div>
            ) : (
              <>
                <div className="calendar-tabs">
                  <button
                    aria-pressed={tab === "date"}
                    className={tab === "date" ? "active" : ""}
                    onClick={() => setTab("date")}
                  >
                    Fecha
                  </button>
                  <button
                    aria-pressed={tab === "time"}
                    className={tab === "time" ? "active" : ""}
                    disabled={!day}
                    onClick={() => setTab("time")}
                  >
                    Horario
                  </button>
                </div>
                <p className="calendar-doctor">{calendar.name}</p>
                {tab === "date" ? (
                  <>
                    <div className="month-nav">
                      <button
                        aria-label="Mes anterior"
                        disabled={
                          year === new Date().getFullYear() &&
                          month === new Date().getMonth()
                        }
                        onClick={() => changeMonth(-1)}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <b>{monthName}</b>
                      <button
                        aria-label="Mes siguiente"
                        onClick={() => changeMonth(1)}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    <div className="calendar-grid">
                      {["L", "M", "X", "J", "V", "S", "D"].map((s, i) => (
                        <small key={i}>{s}</small>
                      ))}
                      {Array.from(
                        { length: (new Date(year, month, 1).getDay() + 6) % 7 },
                        (_, i) => (
                          <span key={`empty${i}`} />
                        ),
                      )}
                      {Array.from(
                        { length: new Date(year, month + 1, 0).getDate() },
                        (_, i) => i + 1,
                      ).map((n) => (
                        <button
                          key={n}
                          disabled={!dates.includes(n)}
                          aria-label={`${n} de ${monthName}`}
                          aria-pressed={day === n}
                          className={`${dates.includes(n) ? "available" : ""} ${day === n ? "chosen" : ""}`}
                          onClick={() => {
                            setDay(n);
                            setTime("");
                            setTab("time");
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    {!dates.length && (
                      <p>No hay días de atención en este mes.</p>
                    )}
                    <small className="calendar-note">
                      Las fechas en verde corresponden a los días de atención
                      publicados.
                    </small>
                  </>
                ) : (
                  <>
                    <div className="month-nav">
                      <b>
                        {day} de {monthName}
                      </b>
                    </div>
                    <div className="time-grid">
                      {windows.map(scheduleLabel).map((t) => (
                        <button
                          className={time === t ? "chosen" : ""}
                          key={t}
                          aria-pressed={time === t}
                          onClick={() => setTime(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <p className="appointment-note">
                      {windows.some((s) => s.end)
                        ? "Selecciona una franja de atención. La hora exacta se confirma con la sede."
                        : "Horario de atención publicado por la sede."}
                    </p>
                    <Button
                      disabled={!windows.some((s) => scheduleLabel(s) === time)}
                      onClick={() => {
                        setBooking({
                          ...booking,
                          doctor: calendar,
                          date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                          time,
                        });
                        setCalendar(null);
                        navigate(
                          validPatient(booking) ? "review" : "schedule",
                          { preserveBooking: true },
                        );
                      }}
                    >
                      Seleccionar horario
                    </Button>
                  </>
                )}
                <p className="appointment-note">{clinic.notice}</p>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
export function Review({ booking, navigate, confirmBooking }) {
  return (
    <div className="review-page medical-background">
      <Logo />
      <h1 tabIndex={-1}>Confirma los datos de tu consulta</h1>
      <p className="flow-progress">3. Confirmación · Consulta simulada</p>
      <div className="review-card card">
        <section className="review-patient">
          <h3>Paciente</h3>
          <p>
            {booking.name} · {booking.patient}
          </p>
          <button
            className="text-link"
            onClick={() => navigate("schedule", { preserveBooking: true })}
          >
            Editar datos del paciente
          </button>
        </section>
        <div className="review-top">
          <section>
            <h3>Especialidad</h3>
            <p>
              {booking.specialty}
              {booking.study || booking.doctor?.study
                ? ` · ${booking.study || booking.doctor.study}`
                : ""}
            </p>
          </section>
          <section>
            <h3>Doctor</h3>
            <p>{booking.doctor?.name}</p>
          </section>
        </div>
        <div className="review-details">
          <section>
            <h3>Fecha</h3>
            <p>
              {new Intl.DateTimeFormat("es").format(
                new Date(`${booking.date}T12:00:00`),
              )}
            </p>
          </section>
          <section>
            <h3>Horario</h3>
            <p>{booking.time}</p>
          </section>
          <section>
            <h3>Centro</h3>
            <p>
              {clinic.name}
              <br />
              {clinic.city}
            </p>
          </section>
        </div>
        <p className="appointment-note">
          {booking.time.includes("–")
            ? "Franja de atención seleccionada. Confirma la hora exacta con la sede."
            : "Horario de atención seleccionado."}{" "}
          {clinic.notice}
        </p>
        <Button
          disabled={!validSelection(booking) || !validPatient(booking)}
          onClick={confirmBooking}
        >
          {booking.editingId
            ? "Confirmar reprogramación"
            : "Confirmar agendamiento"}
        </Button>
        <button
          className="text-link"
          onClick={() =>
            navigate("doctors", {
              specialty: booking.specialty,
              study: booking.study,
            })
          }
        >
          Volver
        </button>
      </div>
    </div>
  );
}
export function Success({ navigate, lastAppointment }) {
  return (
    <div className="success-page medical-background">
      <div className="success-surface">
        <div className="success-banner">
          <Logo />
        </div>
        <div className="success-card card">
          <span className="success-check">
            <Check size={48} />
          </span>
          <h1 tabIndex={-1}>
            ¡Consulta agendada
            <br />
            con éxito!
          </h1>
          <p>Confirmación de demostración · {lastAppointment.id}</p>
          <p>
            {lastAppointment.doctor.name}
            <br />
            {dateLabel(lastAppointment.date)} · {lastAppointment.time}
          </p>
          <p>No se envió una reserva real a la sede.</p>
          <Button onClick={() => navigate("appointments")}>
            Ver mis citas
          </Button>
        </div>
        <div className="success-nav">
          <button onClick={() => navigate("home")}>Inicio</button>
          <button onClick={() => navigate("appointments")}>Mis citas</button>
          <button
            className="add"
            aria-label="Agendar otra consulta"
            onClick={() => navigate("schedule")}
          >
            +
          </button>
          <button onClick={() => navigate("notices")}>Avisos</button>
          <button onClick={() => navigate("dashboard")}>Menú</button>
        </div>
      </div>
    </div>
  );
}
