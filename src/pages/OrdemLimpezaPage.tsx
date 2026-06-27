import { useEffect, useState } from "react";
import { type OrdemLimpeza, type Funcionario, type Quarto, OrdemLimpezaPayLoad } from "../types";
import { listarFuncionarios } from "@/Api/funcionarios"
import { listarQuartos } from "@/Api/quartos";
import { listarOrdemLimpeza, atualizarOrdemLimpeza, excluirOrdemLimpeza } from "@/Api/ordemlimpeza";
import styles from './Page.module.css'
import OrdemLimpezaForm from "../components/OrdemLimpezaForm";

function OrdemLimpezaPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [ordenslimpeza, setOrdensLimpeza] = useState<OrdemLimpeza[]>([])
  const [feedback, setFeedback] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [selecionado, setSelecionado] = useState<OrdemLimpeza | null>(null)

  useEffect(() => {
    async function loadOrdensLimpeza() {
      try {
        const [loadedFuncionarios, loadedQuartos, loadedOrdensLimpeza] = await Promise.all([
          listarFuncionarios(),
          listarQuartos(),
          listarOrdemLimpeza()
        ])
        setQuartos(loadedQuartos)
        setFuncionarios(loadedFuncionarios)
        setOrdensLimpeza(loadedOrdensLimpeza)
      } catch (err) {
        setError(`Erro ao carregar reservas: ${(err as Error).message}`)
      }
    }
    loadOrdensLimpeza();
  }, [])

  async function handleDeletar() {
    if (!selecionado) return setError('Selecione uma ordem de limpeza para deletar.')
    try {
      await excluirOrdemLimpeza(String(selecionado.id))
      setOrdensLimpeza(prev => prev.filter(o => o.id !== selecionado.id))
      setSelecionado(null)
      setFeedback('Ordem de limpeza deletada com sucesso.')
      setError('')
    } catch (err) {
      setError(`Erro ao deletar: ${(err as Error).message}`)
      setFeedback('')
    }
  }

  async function handlerAlterar(payload: OrdemLimpezaPayLoad) {
    if (!selecionado) return setError('Selecione uma Ordem de Limpeza para Alterar');
    try {
      const atualizado = await atualizarOrdemLimpeza(String(selecionado.id), payload)
      setOrdensLimpeza(prev => prev.map(o => o.id === selecionado.id ? atualizado : o))
      setSelecionado(null)
      setFeedback("Ordem de Limpeza alterada com Sucesso")
      setError("")
    } catch (err) {
      setError(`Erro ao alterar: ${(err as Error).message}`)
      setFeedback('')
    }


  }

  return (
    <div>
      <h1>Ordem de Limpeza</h1>
      <p>Cadastre as ordens de limpezas vinculando aos funcionários e quartos já cadastrados.</p>

      {feedback && <div className={styles.feedback}>{feedback}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className="p-2">

        <div className="container bg-[#FFF3E3]/70 p-4 rounded-2 mb-5">
          <label htmlFor="" className="form-label"><h2>Últimas Ordens de Limpeza</h2></label>
          <hr />
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped caption-top">
              <caption>
                Lista de Ordem de Limpeza
              </caption>
              <thead className="table-dark">
                <tr className="text-center">
                  <th>Quarto</th>
                  <th>Funcionário</th>
                  <th>Status</th>
                  <th>Inicio</th>
                  <th>Fim</th>
                  <th>Obsv.</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {ordenslimpeza.length === 0 ? (
                  <tr></tr>
                ) : (
                  ordenslimpeza.slice(-10).map((ordemlimpeza) => (
                    <tr key={ordemlimpeza.id} onClick={() => setSelecionado(ordemlimpeza)} className={selecionado?.id === ordemlimpeza.id ? 'table-warning' : ''}
                      style={{ cursor: 'pointer' }}>
                      <td>Quarto {quartos.find(q => q.id === ordemlimpeza.quartoId)?.numero}º</td>
                      <td>{funcionarios.find(f => f.id === ordemlimpeza.funcionarioId)?.nome}</td>
                      <td>{ordemlimpeza.status}</td>
                      <td>{new Date(ordemlimpeza.inicio).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</td>
                      <td>{new Date(ordemlimpeza.fim).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</td>
                      <td>{ordemlimpeza.observacao}</td>
                    </tr>
                  ))

                )}
              </tbody>
            </table>
          </div>
          <div className="">
            <div className="d-flex justify-content-end gap-1">
              <button className="btn btn-dark" type="submit" onClick={handleDeletar}>Deletar</button>
              <button className="btn btn-dark" type="button" onClick={() => setSelecionado(null)}>Cancelar Seleção</button>
            </div>
          </div>
        </div>
        <OrdemLimpezaForm funcionarios={funcionarios} quartos={quartos} onAlterar={handlerAlterar} selecionado={selecionado} />

      </div>
    </div>
  )
}

export default OrdemLimpezaPage