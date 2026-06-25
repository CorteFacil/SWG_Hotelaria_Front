import { useEffect, useState } from "react";
import { type OrdemLimpeza, type Funcionario, type Quarto } from "../types";
import { api } from "../api";
import styles from './Page.module.css'
import OrdemLimpezaForm from "../components/OrdemLimpezaForm";
import root from 'react-shadow';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?inline';


function OrdemLimpezaPage() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
    const [quartos, setQuartos] = useState<Quarto[]>([])
    const [ordenslimpeza, setOrdensLimpeza] = useState<OrdemLimpeza[]>([])
    const [feedback, setFeedback] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        loadOrdemLimpezaData()
    }, [])

    async function loadOrdemLimpezaData() {
        try {
            const [loadedFuncionarios, loadedQuartos, loadedOrdensLimpeza] = await Promise.all([
                api.getFuncionarios(),
                api.getQuartos(),
                api.getOrdensLimpezas(),
            ])
            setQuartos(loadedQuartos)
            setFuncionarios(loadedFuncionarios)
            setOrdensLimpeza(loadedOrdensLimpeza)
        } catch (err) {
            setError(`Erro ao carregar reservas: ${(err as Error).message}`)
        }
    }

    async function handleCreateOrdemLimpeza(data: Omit<OrdemLimpeza, 'id'>) {
        try {
          const created = await api.createOrdemLimpeza(data)
          setOrdensLimpeza((prev) => [...prev, created])
          setFeedback('Reserva cadastrada com sucesso.')
          setError('')
        } catch (err) {
          setError(`Erro ao salvar reserva: ${(err as Error).message}`)
          setFeedback('')
        }
      }

      return (
      <root.div>
      <style>{bootstrapCss}</style>
         <div>
      <h1>Ordem de Limpeza</h1>
      <p>Cadastre as ordens de limpezas vinculando aos funcionários e quartos já cadastrados.</p>

      {feedback && <div className={styles.feedback}>{feedback}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.pageGrid}>
        <OrdemLimpezaForm funcionarios={funcionarios} quartos={quartos} onSubmit={handleCreateOrdemLimpeza} />

        <section className={styles.listCard}>
          <h2>Últimas reservas</h2>
          <ul>
            {ordenslimpeza.length === 0 ? (
              <li>Nenhuma reserva encontrada.</li>
            ) : (
              ordenslimpeza.slice(-10).map((ordemlimpeza) => (
                <li key={ordemlimpeza.id}>
                  {ordemlimpeza.quartoId} | {ordemlimpeza.funcionarioId} | {ordemlimpeza.status} | {ordemlimpeza.inicioOrdem} | {ordemlimpeza.fimOrdem} | {ordemlimpeza.observacao}
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  </root.div>
  )
}

export default OrdemLimpezaPage