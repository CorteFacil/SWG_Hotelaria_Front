import { useEffect, useState } from 'react'
import type { Estado, Pais } from '../types'
import EstadoForm from '../components/EstadoForm'
import styles from './Page.module.css'
import { criarEstado, listarEstados } from '@/Api/estados'
import { listarPaises } from '@/Api/paises'

export default function EstadoPage() {
  const [estados, setEstados] = useState<Estado[]>([])
  const [paises, setPaises] = useState<Pais[]>([])
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadEstados()
  }, [])

  async function loadEstados() {
    try {
      const [loadedEstados, loadedPaises] = await Promise.all([
        listarEstados(),
        listarPaises()
      ])

      setEstados(loadedEstados)
      setPaises(loadedPaises)
    } catch (err) {
      setError(`Erro ao carregar estados: ${(err as Error).message}`)
    }
  }

  async function handleCreateEstado(data: Omit<Estado, 'id'>) {
    try {
      const created = await criarEstado(data)

      setEstados(prev => [...prev, created])

      setFeedback('Estado cadastrado com sucesso.')
      setError('')
    } catch (err) {
      setError(`Erro ao salvar estado: ${(err as Error).message}`)
      setFeedback('')
    }
  }

  return (
    <body className="d-flex flex-column min-vh-100 bg-dark-subtle">

      <h1>Estados</h1>

      <p>
        Cadastre novos estados e visualize os registros existentes.
      </p>

      {feedback && <div className={styles.feedback}>{feedback}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.pageGrid}>

        <EstadoForm
          paises={paises}
          onSubmit={handleCreateEstado} onCancel={function (): void {
            throw new Error('Function not implemented.')
          }} />

        <section className="bg-light p-4">

          <h2>Estados cadastrados</h2>

          <ul>
            {estados.length === 0 ? (
              <li>Nenhum estado encontrado.</li>
            ) : (
              estados.map((estado) => (
                <li key={estado.id}>
                  {estado.nomeEstado} ({estado.siglaUf}) - {estado.regiaoGeografica}
                </li>
              ))
            )}
          </ul>

        </section>

      </div>

    </body>
  )
}