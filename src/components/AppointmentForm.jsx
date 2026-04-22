import { useState } from 'react'
import { validateAppointment, sanitizeText } from '../utils/validators'

const EMPTY_FORM = {
  paciente: '',
  propietario: '',
  email: '',
  fecha: '',
  hora: '',
  sintomas: '',
}

function Field({ id, label, error, children }) {
  return (
    <div className={`field-group ${error ? 'field-group--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <span id={`${id}-error`} className="error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default function AppointmentForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateAppointment(form)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    setStatus('loading')
    try {
      await onAdd({
        paciente: sanitizeText(form.paciente),
        propietario: sanitizeText(form.propietario),
        email: sanitizeText(form.email),
        fecha: form.fecha,
        hora: form.hora,
        sintomas: sanitizeText(form.sintomas),
      })
      setForm(EMPTY_FORM)
      setErrors({})
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3500)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const isSaving = status === 'loading'

  return (
    <section className="form-card glass-card">
      <div className="form-heading">
        <div className="form-heading-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <div>
          <h2>Nueva Cita</h2>
          <p className="form-subtitle">Completa los datos del paciente</p>
        </div>
      </div>

      {status === 'success' && (
        <div className="toast-success" role="alert">
          <span className="toast-icon">✓</span>
          <span>¡Cita guardada en la base de datos!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="toast-error" role="alert">
          <span className="toast-icon toast-icon--error">✕</span>
          <span>Error al guardar. Revisa tu conexión.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Field id="paciente" label="🐾 Paciente" error={errors.paciente}>
            <input
              id="paciente" name="paciente" type="text"
              value={form.paciente} onChange={handleChange}
              placeholder="Ej: Max" maxLength={60} disabled={isSaving}
              className={errors.paciente ? 'input-error' : ''}
            />
          </Field>

          <Field id="propietario" label="👤 Propietario" error={errors.propietario}>
            <input
              id="propietario" name="propietario" type="text"
              value={form.propietario} onChange={handleChange}
              placeholder="Ej: Carlos García" maxLength={60} disabled={isSaving}
              className={errors.propietario ? 'input-error' : ''}
            />
          </Field>

          <Field id="email" label="✉️ Correo electrónico" error={errors.email}>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="correo@ejemplo.com" maxLength={100} disabled={isSaving}
              className={errors.email ? 'input-error' : ''}
            />
          </Field>

          <Field id="fecha" label="📅 Fecha" error={errors.fecha}>
            <input
              id="fecha" name="fecha" type="date"
              value={form.fecha} onChange={handleChange}
              min={today} disabled={isSaving}
              className={errors.fecha ? 'input-error' : ''}
            />
          </Field>

          <Field id="hora" label="🕐 Hora" error={errors.hora}>
            <input
              id="hora" name="hora" type="time"
              value={form.hora} onChange={handleChange} disabled={isSaving}
              className={errors.hora ? 'input-error' : ''}
            />
          </Field>
        </div>

        <Field id="sintomas" label="📝 Síntomas / Motivo" error={errors.sintomas}>
          <textarea
            id="sintomas" name="sintomas"
            value={form.sintomas} onChange={handleChange}
            placeholder="Describe los síntomas o motivo de la consulta..."
            maxLength={300} rows={4} disabled={isSaving}
            className={errors.sintomas ? 'input-error' : ''}
          />
          <span className="char-count">{form.sintomas.length}/300</span>
        </Field>

        <button type="submit" className="btn-submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Guardando...
            </>
          ) : (
            <>
              Agregar Cita
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </>
          )}
        </button>
      </form>
    </section>
  )
}
