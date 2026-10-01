import React, { useState, useEffect, useRef } from "react";

import { Shell, Help } from "./components/UI";
import { Home, Dashboard } from "./pages/Portal";
import { Schedule, Doctors, Review, Success } from "./pages/Booking";
import "./styles.css";
import { specialties, validSelection } from "./data/clinic";
import { parseRoute, routeHash } from "./data/navigation";
import {
  Appointments,
  Specialties,
  Profile,
  Preferences,
  Exams,
  Notices,
} from "./pages/Account";
import {
  demoNotice,
  createDemoAppointments,
  confirmDemoAppointment,
  cancelDemoAppointment,
  validPatient,
} from "./data/demo";
export default function App() {
  const [route, setRoute] = useState(() => parseRoute(location.hash));
  const [directoryVisit, setDirectoryVisit] = useState(0);
  const page = route.page;
  const [appointments, setAppointments] = useState(createDemoAppointments);
  const [profile, setProfile] = useState({ name: "Usuario invitado" });
  const [preferences, setPreferences] = useState([true, true]);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(""), 5000);
    return () => clearTimeout(timer);
  }, [feedback]);
  const notify = (message) => setFeedback(message);
  const [collapsed, setCollapsed] = useState(
    () => window.matchMedia("(max-width: 760px)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => {
      setCollapsed(true);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const [search, setSearch] = useState("");
  const [booking, setBooking] = useState({
    specialty: specialties[0],
    name: "",
    document: "",
    birth: "",
    patient: "Nuevo paciente",
    study: "",
    reason: "",
    consent: false,
    doctor: null,
    date: "",
    time: "",
  });
  function navigate(next, filters = {}) {
    if (next === "schedule" && !filters.preserveBooking)
      setBooking((current) => ({
        ...current,
        editingId: null,
        doctor: null,
        date: "",
        time: "",
      }));
    if (
      ["dashboard", "appointments", "history", "home"].includes(next) ||
      (next === "doctors" && !filters.specialty)
    )
      setBooking((current) => ({ ...current, editingId: null }));
    const hash = routeHash(next, filters);
    setRoute(parseRoute(hash));
    if (next === "doctors") {
      setSearch("");
      setDirectoryVisit((v) => v + 1);
    }
    location.hash = hash;
    window.scrollTo(0, 0);
  }
  function setDoctorFilters(filters) {
    const hash = routeHash("doctors", filters);
    history.replaceState(null, "", hash);
    setRoute(parseRoute(hash));
    setBooking((current) => ({ ...current, doctor: null, date: "", time: "" }));
  }
  useEffect(() => {
    function sync() {
      const next = parseRoute(location.hash);
      setRoute(next);
      if (next.page === "doctors") {
        setSearch("");
        setDirectoryVisit((v) => v + 1);
      }
    }
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const activePage =
    page === "success" && !lastAppointment
      ? "appointments"
      : page === "review" && !validSelection(booking)
        ? "doctors"
        : page === "review" && !validPatient(booking)
          ? "schedule"
          : page;
  useEffect(() => {
    if (activePage === page) return;
    const hash = routeHash(activePage, route);
    history.replaceState(null, "", hash);
    setRoute(parseRoute(hash));
  }, [activePage, page, route.specialty, route.study]);
  function confirmBooking() {
    if (!validSelection(booking) || !validPatient(booking)) return;
    const id =
      booking.editingId ||
      `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    setAppointments((current) => confirmDemoAppointment(current, booking, id));
    setLastAppointment({ ...booking, id });
    setBooking((current) => ({
      ...current,
      editingId: null,
      doctor: null,
      date: "",
      time: "",
    }));
    navigate("success");
  }
  function reschedule(appointment) {
    setBooking({
      ...appointment,
      editingId: appointment.id,
      doctor: null,
      date: "",
      time: "",
    });
    navigate("doctors", {
      specialty: appointment.specialty,
      study: appointment.study,
    });
    notify(
      "Selecciona una nueva fecha. La cita actual se mantiene hasta confirmar el cambio.",
    );
  }
  const previousPage = useRef(activePage);
  useEffect(() => {
    if (previousPage.current !== activePage) {
      document.querySelector("#root h1")?.focus({ preventScroll: true });
      previousPage.current = activePage;
    }
  }, [activePage]);
  let content =
    activePage === "home" ? (
      <Home navigate={navigate} setProfile={setProfile} />
    ) : activePage === "dashboard" ? (
      <Dashboard
        {...{
          navigate,
          appointments,
          profile,
          preferences,
          setPreferences,
          notify,
        }}
      />
    ) : activePage === "schedule" ? (
      <Schedule {...{ booking, setBooking, navigate }} />
    ) : activePage === "doctors" ? (
      <Doctors
        key={directoryVisit}
        doctorFilters={route}
        {...{
          booking,
          setBooking,
          navigate,
          search,
          setDoctorFilters,
          setSearch,
        }}
      />
    ) : activePage === "review" ? (
      <Review {...{ booking, navigate, confirmBooking }} />
    ) : activePage === "success" ? (
      <Success {...{ navigate, lastAppointment }} />
    ) : ["appointments", "history"].includes(activePage) ? (
      <Appointments
        key={activePage}
        {...{ appointments, navigate, reschedule }}
        history={activePage === "history"}
        cancelAppointment={(id) => {
          setAppointments((current) => cancelDemoAppointment(current, id));
          notify(
            "Cita cancelada en la demostración. Puedes verla en el registro.",
          );
        }}
      />
    ) : activePage === "specialties" ? (
      <Specialties navigate={navigate} />
    ) : activePage === "profile" ? (
      <Profile {...{ profile, setProfile, notify }} />
    ) : activePage === "preferences" ? (
      <Preferences {...{ preferences, setPreferences, notify }} />
    ) : activePage === "exams" ? (
      <Exams navigate={navigate} />
    ) : (
      <Notices {...{ appointments, preferences, navigate }} />
    );
  return (
    <>
      {!["schedule", "review", "success"].includes(activePage) ? (
        <Shell
          {...{
            page: activePage,
            navigate,
            collapsed,
            setCollapsed,
            search,
            setSearch,
            profile,
          }}
        >
          {content}
        </Shell>
      ) : (
        content
      )}
      {page !== "success" && <Help />}
      <div className="demo-banner">{demoNotice}</div>
      {feedback && (
        <div className="toast" role="status">
          <span>{feedback}</span>
          <button aria-label="Cerrar mensaje" onClick={() => setFeedback("")}>
            ×
          </button>
        </div>
      )}
    </>
  );
}
