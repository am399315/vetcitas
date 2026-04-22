import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useAppointments() {
  const [citas, setCitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCitas = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .order('creado_en', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      setError(`Error: ${error.message} (código: ${error.code})`)
    } else setCitas(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchCitas() }, [fetchCitas])

  async function addCita(cita) {
    const { data, error } = await supabase
      .from('citas')
      .insert([{ ...cita, creado_en: new Date().toISOString() }])
      .select()
      .single()

    if (error) throw new Error('No se pudo guardar la cita.')
    setCitas(prev => [data, ...prev])
    return data.id
  }

  async function deleteCita(id) {
    const { error } = await supabase.from('citas').delete().eq('id', id)
    if (error) throw new Error('No se pudo eliminar la cita.')
    setCitas(prev => prev.filter(c => c.id !== id))
  }

  return { citas, loading, error, addCita, deleteCita, refetch: fetchCitas }
}
