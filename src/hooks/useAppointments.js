import { useState, useEffect } from 'react'

const STORAGE_KEY = 'citas_v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveToStorage(citas) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(citas))
  } catch {
    // LocalStorage lleno o bloqueado — silencioso en producción
  }
}

export function useAppointments() {
  const [citas, setCitas] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(citas)
  }, [citas])

  function addCita(cita) {
    const nueva = { ...cita, id: crypto.randomUUID(), creadoEn: new Date().toISOString() }
    setCitas(prev => [nueva, ...prev])
    return nueva.id
  }

  function deleteCita(id) {
    setCitas(prev => prev.filter(c => c.id !== id))
  }

  function updateCita(id, updated) {
    setCitas(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)))
  }

  return { citas, addCita, deleteCita, updateCita }
}
