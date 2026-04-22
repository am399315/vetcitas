import { useState, useMemo } from 'react'
import AppointmentCard from './AppointmentCard'

export default function AppointmentList({ citas, onDelete }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('reciente')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return citas
      .filter(c =>
        c.paciente.toLowerCase().includes(q) ||
        c.propietario.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sortBy === 'fecha') return a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
        return new Date(b.creadoEn) - new Date(a.creadoEn)
      })
  }, [citas, search, sortBy])

  return (
    <section className="list-section glass-card">
      <div className="list-heading">
        <div className="list-title-row">
          <h2>Citas Registradas</h2>
          <span className="count-badge">{citas.length}</span>
        </div>

        <div className="list-controls">
          <div className="search-wrapper">
            <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, propietario..."
              className="search-input"
              aria-label="Buscar citas"
              maxLength={60}
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="sort-select"
            aria-label="Ordenar citas"
          >
            <option value="reciente">Más reciente</option>
            <option value="fecha">Por fecha</option>
          </select>
        </div>
      </div>

      {citas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden="true">🐾</div>
          <h3>Sin citas aún</h3>
          <p>Usa el formulario para registrar tu primera cita.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration" aria-hidden="true">🔍</div>
          <h3>Sin resultados</h3>
          <p>No hay citas que coincidan con <strong>"{search}"</strong></p>
        </div>
      ) : (
        <div className="citas-grid">
          {filtered.map(cita => (
            <AppointmentCard key={cita.id} cita={cita} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  )
}
