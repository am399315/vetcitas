import { useState } from 'react'

const AVATAR_GRADIENTS = [
  ['#6366f1', '#8b5cf6'],
  ['#06b6d4', '#6366f1'],
  ['#10b981', '#06b6d4'],
  ['#f59e0b', '#ef4444'],
  ['#ec4899', '#8b5cf6'],
  ['#14b8a6', '#3b82f6'],
]

function getGradient(name) {
  const i = name.charCodeAt(0) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[i]
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

function isUpcoming(fecha) {
  return fecha >= new Date().toISOString().split('T')[0]
}

export default function AppointmentCard({ cita, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [g1, g2] = getGradient(cita.paciente)
  const upcoming = isUpcoming(cita.fecha)

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return }
    setDeleting(true)
    try {
      await onDelete(cita.id)
    } catch {
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <article
      className={`cita-card ${deleting ? 'cita-card--removing' : ''}`}
      aria-label={`Cita de ${cita.paciente}`}
    >
      <div className="cita-card-glow" style={{ background: `radial-gradient(circle at 0% 0%, ${g1}22, transparent 70%)` }} aria-hidden="true" />

      <div className="cita-top">
        <div className="cita-avatar" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }} aria-hidden="true">
          {cita.paciente.charAt(0).toUpperCase()}
        </div>
        <div className="cita-title-block">
          <h3 className="cita-paciente">{cita.paciente}</h3>
          <p className="cita-propietario">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            {cita.propietario}
          </p>
        </div>
        <div className="cita-top-right">
          <span className={`status-chip ${upcoming ? 'status-upcoming' : 'status-past'}`}>
            {upcoming ? 'Próxima' : 'Pasada'}
          </span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`btn-delete ${confirming ? 'btn-delete-confirm' : ''}`}
            aria-label={confirming ? 'Confirmar eliminación' : `Eliminar cita de ${cita.paciente}`}
            onBlur={() => !deleting && setConfirming(false)}
          >
            {deleting ? <span className="spinner spinner-sm" aria-hidden="true" /> : confirming ? '¿Seguro?' : '✕'}
          </button>
        </div>
      </div>

      <div className="cita-chips">
        <span className="chip chip-date">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {formatDate(cita.fecha)}
        </span>
        <span className="chip chip-time">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {cita.hora}
        </span>
      </div>

      <div className="chip chip-email">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        {cita.email}
      </div>

      <div className="cita-sintomas-block">
        <span className="sintomas-label">Motivo</span>
        <p className="sintomas-text">{cita.sintomas}</p>
      </div>
    </article>
  )
}
