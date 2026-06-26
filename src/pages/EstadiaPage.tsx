import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Estadia, Reserva, Funcionario, Quarto } from '../types'
import EstadiaForm from '../components/EstadiaForm'
import styles from './Page.module.css'

export default function EstadiaPage() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [estadias, setEstadias] = useState<Estadia[]>([])

  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [
        loadedReservas,
        loadedFuncionarios,
        loadedQuartos,
        loadedEstadias
      ] = await Promise.all([
        api.getReservas(),
        api.getFuncionarios(),
        api.getQuartos(),
        api.getEstadias()
      ])

      setReservas(loadedReservas)
      setFuncionarios(loadedFuncionarios)
      setQuartos(loadedQuartos)
      setEstadias(loadedEstadias)
    } catch (err) {
      setError(`Erro ao carregar dados: ${(err as Error).message}`)
    }
  }

  async function handleCreateEstadia(data: Omit<Estadia, 'id'>) {
    try {
      const created = await api.createEstadia(data)
      setEstadias((prev) => [...prev, created])
      setFeedback('Estadia cadastrada com sucesso.')
      setError('')
    } catch (err) {
      setError(`Erro ao cadastrar estadia: ${(err as Error).message}`)
      setFeedback('')
    }
  }

  return (
    <body className="d-flex flex-column min-vh-100 bg-dark-subtle">
      <h1>Estadias</h1>
      <p>Cadastre novas estadias e visualize os registros recentes.</p>

      {feedback && <div className={styles.feedback}>{feedback}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.pageGrid}>
        <EstadiaForm
          reservas={reservas}
          funcionarios={funcionarios}
          quartos={quartos}
          error={error}
          onSubmit={handleCreateEstadia}
          onCancel={() => {}}
        />

        <section className="bg-light p-4">
          <h2>Últimas Estadias</h2>

          {estadias.length === 0 ? (
            <p>Nenhuma estadia cadastrada.</p>
          ) : (
            <ul>
              {estadias
                .slice(-10)
                .reverse()
                .map((estadia) => (
                  <li key={estadia.id}>
                    Reserva #{estadia.reserva?.id} •
                    Quarto {estadia.quarto?.numero} •
                    Check-in: {estadia.checkIn} •
                    Check-out: {estadia.checkOut}
                  </li>
                ))}
            </ul>
          )}
        </section>
      </div>
    </body>
  )
}