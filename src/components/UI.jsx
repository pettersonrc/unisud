import React, { useEffect, useRef } from "react";
import { clinic } from "../data/clinic";
import {
  Menu,
  Bell,
  UserRound,
  ChevronDown,
  Home,
  Users,
  Stethoscope,
  CalendarDays,
  Settings,
  ClipboardList,
  MessageCircle,
  History,
} from "lucide-react";
export function Logo() {
  return (
    <div className="logo">
      <strong>unisud</strong>
      <span>Universidad Sudamericana</span>
    </div>
  );
}
export function Button({
  children,
  secondary = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`button ${secondary ? "secondary" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function Shell({
  children,
  page,
  navigate,
  collapsed,
  setCollapsed,
  search,
  setSearch,
  profile,
}) {
  const menuButton = useRef(null);
  const sidebar = useRef(null);
  useEffect(() => {
    if (
      page === "home" ||
      collapsed ||
      !window.matchMedia("(max-width: 760px)").matches
    )
      return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar.current?.querySelector("button:not(:disabled)")?.focus();
    function keydown(e) {
      if (e.key === "Escape") {
        setCollapsed(true);
        menuButton.current?.focus();
      }
      if (e.key === "Tab") {
        const targets = [
          menuButton.current,
          ...sidebar.current.querySelectorAll("button:not(:disabled)"),
        ];
        const first = targets[0],
          last = targets[targets.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
    };
  }, [collapsed, setCollapsed, page]);
  function selectPage(next) {
    navigate(next);
    if (window.matchMedia("(max-width: 760px)").matches) {
      setCollapsed(true);
      menuButton.current?.focus();
    }
  }
  const items = [
    [Home, "Dashboard", "dashboard"],
    [CalendarDays, "Mis citas", "appointments"],
    [History, "Registro de consultas", "history"],
    [Stethoscope, "Médicos", "doctors"],
    [Users, "Especialidades", "specialties"],
    [ClipboardList, "Mis exámenes", "exams"],
    [Bell, "Avisos", "notices"],
    [Settings, "Preferencias", "preferences"],
    [UserRound, "Mi perfil", "profile"],
  ];
  return (
    <div className="portal">
      <header>
        <button
          className="icon-button menu-toggle"
          ref={menuButton}
          aria-controls="portal-navigation"
          aria-expanded={!collapsed}
          aria-label="Alternar menú"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={20} />
        </button>
        <button className="brand-button" onClick={() => navigate("home")}>
          <Logo />
        </button>
        {page === "doctors" ? (
          <input
            className="header-search"
            aria-label="Buscar médicos disponibles"
            placeholder="Buscar médicos disponibles"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        ) : (
          <nav className="top-nav">
            <button
              className={page === "home" ? "active" : ""}
              aria-current={page === "home" ? "page" : undefined}
              onClick={() => navigate("home")}
            >
              Inicio
            </button>
            <button onClick={() => navigate("dashboard")}>Portal</button>
            <button onClick={() => navigate("specialties")}>
              Especialidades
            </button>
            <button onClick={() => navigate("appointments")}>Mis citas</button>
            <a href={clinic.phoneLink}>Contacto</a>
          </nav>
        )}
        <div className="profile">
          <button
            className="bell icon-button"
            aria-label="Ver avisos"
            onClick={() => selectPage("notices")}
          >
            <Bell size={20} />
          </button>
          <button
            className="profile-button"
            aria-label="Abrir mi perfil"
            onClick={() => selectPage("profile")}
          >
            <UserRound size={28} />
            <div>
              <b>{profile.name}</b>
              <small>Portal de consultas</small>
            </div>
            <ChevronDown size={14} />
          </button>
        </div>
      </header>
      <div className="portal-body">
        {!collapsed && (
          <button
            className="nav-overlay"
            aria-label="Cerrar menú"
            tabIndex={-1}
            onClick={() => {
              setCollapsed(true);
              menuButton.current?.focus();
            }}
          />
        )}
        <aside
          id="portal-navigation"
          ref={sidebar}
          aria-label="Navegación principal"
          className={collapsed ? "collapsed" : ""}
        >
          <div>
            {items.map(([Icon, label, destination]) => (
              <button
                key={label}
                aria-label={label}
                className={`nav-item ${page === destination ? "active" : ""}`}
                onClick={() => selectPage(destination)}
                aria-current={page === destination ? "page" : undefined}
                title={label}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="sidebar-profile">
            <UserRound size={22} />
            <span>
              {profile.name}
              <small>Perfil de demostración</small>
            </span>
          </div>
        </aside>
        <main id="main-content">
          <div className="page-content">{children}</div>
        </main>
      </div>
    </div>
  );
}
export function Help() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        className="help"
        aria-label="Información de contacto"
        aria-expanded={open}
        aria-controls="contact-panel"
        onClick={() => setOpen(!open)}
      >
        <MessageCircle size={26} />
      </button>
      {open && (
        <div
          className="help-panel"
          id="contact-panel"
          role="region"
          aria-label="Contacto"
        >
          <b>Contacto</b>
          <p>
            {clinic.name} · {clinic.city}
          </p>
          <p>
            <a href={clinic.phoneLink}>{clinic.phone}</a>
          </p>
          <p>{clinic.notice}</p>
          <button onClick={() => setOpen(false)}>Cerrar</button>
        </div>
      )}
    </>
  );
}
