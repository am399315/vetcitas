// Sanitiza texto eliminando caracteres HTML peligrosos
export function sanitizeText(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

// Reglas de validación por campo
const RULES = {
  paciente: {
    min: 2,
    max: 60,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    label: 'Nombre del paciente',
  },
  propietario: {
    min: 2,
    max: 60,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    label: 'Nombre del propietario',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    label: 'Correo electrónico',
  },
  fecha: { label: 'Fecha' },
  hora: { label: 'Hora' },
  sintomas: { min: 5, max: 300, label: 'Síntomas' },
}

export function validateAppointment(fields) {
  const errors = {}

  for (const [key, rule] of Object.entries(RULES)) {
    const raw = (fields[key] ?? '').trim()

    if (!raw) {
      errors[key] = `${rule.label} es obligatorio.`
      continue
    }

    if (rule.min && raw.length < rule.min)
      errors[key] = `${rule.label} debe tener al menos ${rule.min} caracteres.`
    else if (rule.max && raw.length > rule.max)
      errors[key] = `${rule.label} no puede superar ${rule.max} caracteres.`
    else if (rule.pattern && !rule.pattern.test(raw))
      errors[key] = `${rule.label} contiene caracteres no válidos.`
  }

  // Fecha no puede ser anterior a hoy
  if (!errors.fecha) {
    const today = new Date().toISOString().split('T')[0]
    if (fields.fecha < today) errors.fecha = 'La fecha no puede ser en el pasado.'
  }

  return errors
}
