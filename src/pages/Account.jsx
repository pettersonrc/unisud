import { useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  UserRound,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/UI";
import { specialties, doctors, clinic } from "../data/clinic";
import { dateLabel } from "../data/demo";

export function Appointments({
  appointments,
  navigate,
  cancelAppointment,
  reschedule,
  history = false,
}) {
  const [filter, setFilter] = useState(history ? "all" : "scheduled");
  const [cancelId, setCancelId] = useState(null);
  const visible = appointments
    .filter((a) => filter === "all" || a.status === filter)
    .sort((a, b) =>
      history ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
    );
  const labels = {
    scheduled: "Agendada · simulación",
    completed: "Realizada · ejemplo",
    cancelled: "Cancelada · simulación",
  };
  return (
    <>
      <div className="page-heading">
        <h1 tabIndex={-1}>{history ? "Registro de consultas" : "Mis citas"}</h1>
        <Button onClick={() => navigate("schedule")}>Agendar consulta</Button>
      </div>
      <p className="page-intro">
        {history
          ? "Revisa tus consultas y su estado."
          : "Consulta, reprograma o cancela tus citas de demostración."}
      </p>
      <div className="account-toolbar">
        <label>
          Estado{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="scheduled">Agendadas</option>
            <option value="completed">Realizadas</option>
            <option value="cancelled">Canceladas</option>
            <option value="all">Todas las consultas</option>
          </select>
        </label>
        <span role="status">
          {visible.length} {visible.length === 1 ? "consulta" : "consultas"}
        </span>
      </div>
      <div className="appointment-list">
        {visible.map((a) => (
          <article className="appointment-row" key={a.id}>
            <div className="appointment-date">
              <CalendarDays size={22} />
              <b>{dateLabel(a.date)}</b>
              <span>{a.time}</span>
            </div>
            <div>
              <span className={`status-label ${a.status}`}>
                {labels[a.status]}
              </span>
              <h2>{a.doctor.name}</h2>
              <p>
                {a.study || a.specialty} · {clinic.name}
              </p>
              <small>
                {a.name} · {a.id}
                {a.sample ? " · Datos de ejemplo" : ""}
              </small>
              <details>
                <summary>Ver datos de la consulta</summary>
                <p>Motivo: {a.reason}</p>
                <p>Paciente: {a.name}</p>
                <p>{clinic.notice}</p>
              </details>
            </div>
            {a.status === "scheduled" && (
              <div className="appointment-actions">
                {cancelId === a.id ? (
                  <div className="cancel-confirm">
                    <p>¿Cancelar esta cita simulada?</p>
                    <Button
                      onClick={() => {
                        cancelAppointment(a.id);
                        setCancelId(null);
                      }}
                    >
                      Sí, cancelar
                    </Button>
                    <Button secondary onClick={() => setCancelId(null)}>
                      Conservar cita
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button secondary onClick={() => reschedule(a)}>
                      Reprogramar
                    </Button>
                    <button
                      className="text-link"
                      onClick={() => setCancelId(a.id)}
                    >
                      Cancelar cita
                    </button>
                  </>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="account-empty">
          <CalendarDays />
          <h2>No hay consultas en este estado</h2>
          <p>Puedes agendar una nueva consulta o cambiar el filtro.</p>
          <Button onClick={() => navigate("schedule")}>Agendar consulta</Button>
        </div>
      )}
    </>
  );
}

export function Specialties({ navigate }) {
  return (
    <>
      <h1 tabIndex={-1}>Especialidades</h1>
      <p className="page-intro">
        Explora las especialidades y los horarios de los profesionales del
        catálogo proporcionado.
      </p>
      <div className="specialty-list">
        {specialties.map((s) => (
          <button
            className="specialty-row"
            key={s}
            onClick={() => navigate("doctors", { specialty: s })}
          >
            <div>
              <h2>{s}</h2>
              <p>
                {doctors.filter((d) => d.specialty === s).length} profesionales
                {s === "Imágenes" ? " · Ecografía y ecocardiogramas" : ""}
              </p>
            </div>
            <ChevronRight size={20} />
          </button>
        ))}
      </div>
      <p className="appointment-note">{clinic.notice}</p>
    </>
  );
}

export function Profile({ profile, setProfile, notify }) {
  const [name, setName] = useState(profile.name);
  return (
    <>
      <h1 tabIndex={-1}>Mi perfil</h1>
      <div className="account-form card">
        <UserRound />
        <h2>Perfil de demostración</h2>
        <p>
          Este nombre personaliza el portal durante la sesión. No crea una
          cuenta institucional.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) {
              notify("Ingresa un nombre para mostrar.");
              return;
            }
            setProfile({ name: name.trim() });
            notify("Perfil de demostración actualizado.");
          }}
        >
          <label>
            Nombre para mostrar
            <input
              required
              maxLength={60}
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <Button>Guardar cambios</Button>
        </form>
      </div>
    </>
  );
}

export function Preferences({ preferences, setPreferences, notify }) {
  return (
    <>
      <h1 tabIndex={-1}>Preferencias</h1>
      <div className="account-form card">
        <h2>Notificaciones de consultas</h2>
        <p>
          Preferencias simuladas para esta sesión. No se enviarán correos ni
          mensajes.
        </p>
        {["Recordatorios de consulta", "Confirmación de consultas"].map(
          (label, i) => (
            <div className="preference-row" key={label}>
              <span>{label}</span>
              <button
                role="switch"
                aria-label={label}
                aria-checked={preferences[i]}
                className={`switch ${preferences[i] ? "on" : ""}`}
                onClick={() => {
                  setPreferences(preferences.map((v, j) => (i === j ? !v : v)));
                  notify("Preferencia actualizada en la demostración.");
                }}
              >
                <i />
              </button>
            </div>
          ),
        )}
      </div>
    </>
  );
}

export function Exams({ navigate }) {
  return (
    <>
      <h1 tabIndex={-1}>Mis exámenes</h1>
      <div className="account-empty">
        <ClipboardList />
        <h2>No hay resultados disponibles</h2>
        <p>
          La demostración permite explorar estudios de imágenes. Los resultados
          clínicos no están conectados a este prototipo.
        </p>
        <Button onClick={() => navigate("doctors", { specialty: "Imágenes" })}>
          Ver estudios de imágenes
        </Button>
      </div>
    </>
  );
}

export function Notices({ appointments, preferences, navigate }) {
  const next = appointments
    .filter((a) => a.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  return (
    <>
      <h1 tabIndex={-1}>Avisos</h1>
      <div className="notice-list">
        <section>
          <h2>Tu próxima consulta</h2>
          {next ? (
            <>
              <p>
                {next.doctor.name} · {dateLabel(next.date)} · {next.time}
              </p>
              <button
                className="text-link"
                onClick={() => navigate("appointments")}
              >
                Ver mis citas
              </button>
            </>
          ) : (
            <p>No tienes citas agendadas en la demostración.</p>
          )}
        </section>
        <section>
          <h2>Recordatorios</h2>
          <p>
            {preferences[0]
              ? "Los recordatorios están activados en esta sesión."
              : "Los recordatorios están desactivados en esta sesión."}{" "}
            No se envían mensajes reales.
          </p>
          <button className="text-link" onClick={() => navigate("preferences")}>
            Cambiar preferencias
          </button>
        </section>
        <section>
          <h2>Horarios de atención</h2>
          <p>{clinic.notice}</p>
        </section>
      </div>
    </>
  );
}
