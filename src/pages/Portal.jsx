import { useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  History,
  FileClock,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { Logo, Button } from "../components/UI";
import { dateLabel } from "../data/demo";
export function Home({ navigate, setProfile }) {
  const [name, setName] = useState("");
  return (
    <div className="home">
      <div className="home-band" />
      <form
        className="login-card card"
        onSubmit={(e) => {
          e.preventDefault();
          setProfile({ name: name.trim() || "Usuario invitado" });
          navigate("dashboard");
        }}
      >
        <Logo />
        <h1 tabIndex={-1}>Portal de consultas</h1>
        <p>
          Explora el portal como invitado. Puedes usar un nombre de ejemplo; no
          necesitas contraseña.
        </p>
        <input
          aria-label="Nombre de usuario"
          placeholder="Nombre para la demostración (opcional)"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button>Entrar</Button>
        <Button type="button" secondary onClick={() => navigate("schedule")}>
          Agendar consulta
        </Button>
        <button
          type="button"
          className="text-link"
          onClick={() => navigate("dashboard")}
        >
          Volver al portal
        </button>
      </form>
      <div className="home-info">
        <section>
          <h3>Portal de la comunidad</h3>
          <p>Accede al portal de consultas de la Universidad Sudamericana.</p>
        </section>
        <section>
          <h3>Consultas</h3>
          <p>Encuentra profesionales y elige un horario para tu consulta.</p>
        </section>
      </div>
    </div>
  );
}
export function Dashboard({
  navigate,
  appointments,
  profile,
  preferences,
  setPreferences,
  notify,
}) {
  const [slide, setSlide] = useState(0);
  const next = appointments
    .filter((a) => a.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  return (
    <>
      <div className="page-heading">
        <h1 tabIndex={-1}>Dashboard</h1>
        <span className="outline-label">Portal de consultas</span>
      </div>
      <p className="page-intro">
        Hola, {profile.name}. Encuentra un profesional o revisa tus próximas
        consultas.
      </p>
      {next && (
        <div className="next-appointment">
          <CalendarCheck size={22} />
          <div>
            <b>Próxima cita · demostración</b>
            <span>
              {dateLabel(next.date)} · {next.time} · {next.doctor.name}
            </span>
          </div>
          <button
            className="text-link"
            onClick={() => navigate("appointments")}
          >
            Ver cita
          </button>
        </div>
      )}
      <div className="dashboard-top">
        <article className="card booking-card">
          <CalendarDays />
          <ShieldCheck className="watermark" />
          <h2>Agendamiento de consultas</h2>
          <p>
            Encuentra un profesional y selecciona el horario de tu próxima
            consulta.
          </p>
          <Button onClick={() => navigate("schedule")}>Agendar consulta</Button>
        </article>
        <div className="card-stack">
          <article className="card">
            <ClipboardList />
            <h2>Mis exámenes</h2>
            <p>Consulta tus exámenes y los registros de tus consultas.</p>
            <button className="text-link" onClick={() => navigate("exams")}>
              Ver mis exámenes
            </button>
          </article>
          <article className="card compact-card">
            <small>CONSULTAS</small>
            <h3>Agendamiento de consultas</h3>
            <button
              className="text-link"
              onClick={() => navigate("specialties")}
            >
              Explorar especialidades
            </button>
            <CalendarCheck className="watermark" />
          </article>
        </div>
        <div className="card-stack">
          <article className="card">
            <History />
            <h2>Historial</h2>
            <p>Revisa el historial de atención y tus consultas anteriores.</p>
            <button className="text-link" onClick={() => navigate("history")}>
              Ver registro
            </button>
          </article>
          <article className="card compact-card">
            <small>DOCUMENTOS</small>
            <h3>Agenda de consultas</h3>
            <button
              className="text-link"
              onClick={() => navigate("appointments")}
            >
              Consultar mis citas
            </button>
            <ShieldCheck className="watermark" />
          </article>
        </div>
      </div>
      <div className="dots">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className={slide === i ? "selected" : ""}
            aria-label={`Diapositiva ${i + 1}`}
            aria-pressed={slide === i}
            onClick={() => setSlide(i)}
          />
        ))}
      </div>
      {slide > 0 && (
        <p className="slide-caption">
          {slide === 1
            ? "Consulta la disponibilidad de los profesionales."
            : "Selecciona una fecha para tu próxima consulta."}
        </p>
      )}
      <div className="section-heading">
        <h2>Mis consultas</h2>
        <button className="text-link" onClick={() => navigate("doctors")}>
          Ver médicos disponibles
        </button>
      </div>
      <div className="dashboard-bottom">
        <section className="card preferences">
          <h3>Centro de consultas</h3>
          <div>
            Perfil{" "}
            <button className="text-link" onClick={() => navigate("profile")}>
              {profile.name}
            </button>
          </div>
          {["Recordatorios de consulta", "Confirmación de consultas"].map(
            (label, i) => (
              <div key={label}>
                {label}
                <button
                  role="switch"
                  aria-checked={preferences[i]}
                  aria-label={label}
                  className={`switch ${preferences[i] ? "on" : ""}`}
                  onClick={() => {
                    setPreferences(
                      preferences.map((v, j) => (j === i ? !v : v)),
                    );
                    notify("Preferencia actualizada en la demostración.");
                  }}
                >
                  <i />
                </button>
              </div>
            ),
          )}
        </section>
        <section className="card">
          <FileClock />
          <h3>Registro de consultas</h3>
          <p>Consulta los datos de tus citas.</p>
          <Button secondary onClick={() => navigate("history")}>
            Ver registro
          </Button>
        </section>
        <section className="card">
          <CalendarCheck />
          <h3>Mis citas</h3>
          <p>Revisa y gestiona tus citas agendadas.</p>
          <Button secondary onClick={() => navigate("appointments")}>
            Ver mis citas
          </Button>
        </section>
      </div>
    </>
  );
}
