import { useAppointments } from './hooks/useAppointments'
import AppointmentForm from './components/AppointmentForm'
import AppointmentList from './components/AppointmentList'

export default function App() {
  const { citas, addCita, deleteCita } = useAppointments()

  const proximas = citas.filter(c => c.fecha >= new Date().toISOString().split('T')[0]).length

  return (
    <div className="app">
      {/* Orbes de fondo animados */}
      <div className="bg-orb orb-1" aria-hidden="true" />
      <div className="bg-orb orb-2" aria-hidden="true" />
      <div className="bg-orb orb-3" aria-hidden="true" />

      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-logo" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
                <line x1="8" y1="14" x2="8" y2="14"/>
                <line x1="12" y1="14" x2="12" y2="14"/>
                <line x1="16" y1="14" x2="16" y2="14"/>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-name">VetCitas</span>
              <span className="brand-sub">Sistema de Gestión de Citas</span>
            </div>
          </div>

          <nav className="header-stats" aria-label="Estadísticas">
            <div className="stat-pill">
              <span className="stat-pill-num">{citas.length}</span>
              <span className="stat-pill-label">Total</span>
            </div>
            <div className="stat-pill stat-pill-accent">
              <span className="stat-pill-num">{proximas}</span>
              <span className="stat-pill-label">Próximas</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="layout">
          <AppointmentForm onAdd={addCita} />
          <AppointmentList citas={citas} onDelete={deleteCita} />
        </div>
      </main>

      <footer className="app-footer">
        <p>VetCitas &copy; {new Date().getFullYear()} &mdash; Hecho con React &amp; Vite</p>
      </footer>
    </div>
  )
}
