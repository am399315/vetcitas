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
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateAppointment(form)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    onAdd({
      paciente: sanitizeText(form.paciente),
      propietario: sanitizeText(form.propietario),
      email: sanitizeText(form.email),
      fecha: form.fecha,
      hora: form.hora,
      sintomas: sanitizeText(form.sintomas),
    })

    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3500)
  }

  const today = new Date().toISOString().split('T')[0]

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

      {submitted && (
        <div className="toast-success" role="alert">
          <span className="toast-icon">✓</span>
          <span>¡Cita registrada exitosamente!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Field id="paciente" label="🐾 Paciente" error={errors.paciente}>
            <input
              id="paciente" name="paciente" type="text"
              value={form.paciente} onChange={handleChange}
              placeholder="Ej: Max" maxLength={60}
              aria-describedby={errors.paciente ? 'paciente-error' : undefined}
              className={errors.paciente ? 'input-error' : ''}
            />
          </Field>

          <Field id="propietario" label="👤 Propietario" error={errors.propietario}>
            <input
              id="propietario" name="propietario" type="text"
              value={form.propietario} onChange={handleChange}
              placeholder="Ej: Carlos García" maxLength={60}
              aria-describedby={errors.propietario ? 'propietario-error' : undefined}
              className={errors.propietario ? 'input-error' : ''}
            />
          </Field>

          <Field id="email" label="✉️ Correo electrónico" error={errors.email}>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="correo@ejemplo.com" maxLength={100}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={errors.email ? 'input-error' : ''}
            />
          </Field>

          <Field id="fecha" label="📅 Fecha" error={errors.fecha}>
            <input
              id="fecha" name="fecha" type="date"
              value={form.fecha} onChange={handleChange} min={today}
              aria-describedby={errors.fecha ? 'fecha-error' : undefined}
              className={errors.fecha ? 'input-error' : ''}
            />
          </Field>

          <Field id="hora" label="🕐 Hora" error={errors.hora}>
            <input
              id="hora" name="hora" type="time"
              value={form.hora} onChange={handleChange}
              aria-describedby={errors.hora ? 'hora-error' : undefined}
              className={errors.hora ? 'input-error' : ''}
            />
          </Field>
        </div>

        <Field id="sintomas" label="📝 Síntomas / Motivo" error={errors.sintomas}>
          <textarea
            id="sintomas" name="sintomas"
            value={form.sintomas} onChange={handleChange}
            placeholder="Describe los síntomas o motivo de la consulta..."
            maxLength={300} rows={4}
            aria-describedby={errors.sintomas ? 'sintomas-error' : undefined}
            className={errors.sintomas ? 'input-error' : ''}
          />
          <span className="char-count">{form.sintomas.length}/300</span>
        </Field>

        <button type="submit" className="btn-submit">
          Agregar Cita
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </form>
    </section>
  )
}
