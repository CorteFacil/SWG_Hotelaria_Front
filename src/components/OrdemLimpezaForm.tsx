import { FormEvent, useEffect, useState, type SyntheticEvent } from 'react'
import type { Quarto, Funcionario, OrdemLimpezaPayLoad, OrdemLimpeza } from '../types'
import { criarOrdemLimpeza } from '@/Api/ordemlimpeza'


interface OrdemLimpezaFormProps {
    funcionarios: Funcionario[]
    quartos: Quarto[]
    selecionado?: OrdemLimpeza | null
    onAlterar?: (payload: OrdemLimpezaPayLoad) => void
}

function OrdemLimpezaForm({ funcionarios, quartos, selecionado, onAlterar }: OrdemLimpezaFormProps) {
    const [inicio, setInicioOrdem] = useState('')
    const [fim, setFimOrdem] = useState('')
    const [observacao, setObservacao] = useState('')
    const [status, setStatus] = useState('')
    const [funcionarioId, setFuncionarioId] = useState('')
    const [quartoId, setQuartoId] = useState('')
    const [erro, setErro] = useState('')

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        try {
            const payload: OrdemLimpezaPayLoad = {
                inicio,
                fim,
                observacao,
                status,
                funcionarioId: Number(funcionarioId),
                quartoId: Number(quartoId)
            }
            if (selecionado) {
                await onAlterar?.(payload);
            } else {
                await criarOrdemLimpeza(payload);
            }
            setErro('')
        } catch (err) {
            setErro((err as Error).message)
        }
    }

    useEffect(() => {
        if (selecionado) {
            setStatus(selecionado.status)
            setObservacao(selecionado.observacao ?? '')
            setInicioOrdem(new Date(selecionado.inicio).toISOString().slice(0, 16))
            setFimOrdem(new Date(selecionado.fim).toISOString().slice(0, 16))
            setFuncionarioId(String(selecionado.funcionarioId))
            setQuartoId(String(selecionado.quartoId))
        }
    }, [selecionado])

    function limpar() {
        setInicioOrdem('')
        setFimOrdem('')
        setObservacao('')
        setStatus('')
        setFuncionarioId('')
        setQuartoId('')
        setErro('')
    }

    return (
        <form className="container bg-[#FFF3E3]/70 p-4 rounded-2" onSubmit={handleSubmit}>
            <h2>Cadastro de Ordem de Limpeza</h2>
            {erro && (
                <div className="alert alert-danger" role="alert">{erro}</div>
            )}
            <br />
            <div className="row g-3 bg-secondary bg-opacity-10">
                <div className="col-md-6">
                    <label className="form-label">Quarto</label>
                    <select
                        value={quartoId}
                        onChange={(e) => setQuartoId(e.target.value)} required
                        className="form-select"
                        name="quarto"
                        id="quarto">
                        <option value="">Selecione</option>
                        {quartos.map((map) => (
                            <option key={map.id} value={map.id}>Quarto {map.numero}º</option>
                        ))}
                    </select>
                    <div className="invalid-feedback">Campo obrigatório</div>
                </div>
                <div className="col-md-6">
                    <label className="form-label">Funcionário</label>
                    <select value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value)} required className="form-select" name="funcionario" id="funcionario">
                        <option value="">Selecione</option>
                        {funcionarios.map((funcionario) => (
                            <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-8">
                    <label htmlFor="status" className="form-label"><b>Status:</b></label>
                    <div className="form-check-inline offset-md-1">
                        <input value="Concluido" onChange={(e) => setStatus(e.target.value)} type="radio" name="status" id="Concluido" checked={status === "Concluido"} />
                        <label htmlFor="concluido" className="form-check-label">Concluido</label>
                    </div>
                    <div className="form-check-inline">
                        <input value="Andamento" checked={status === "Andamento"} onChange={(e) => setStatus(e.target.value)} type="radio" name="status" id="andamento" />
                        <label htmlFor="andamento" className="form-check-label">Andamento</label>
                    </div>
                    <div className="form-check-inline">
                        <input value="Não Concluido" checked={status === "Não Concluido"} onChange={(e) => setStatus(e.target.value)} type="radio" name="status" id="nao-concluido" />
                        <label htmlFor="nao-concluido" className="form-check-label">Não Concluido</label>
                    </div>
                </div>
                <hr />
                <div className="col-md-6">
                    <label htmlFor="observacao" className="form-label">Observação</label>
                    <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} name="observacao" id="observacao" className="form-control" rows={5}></textarea>
                </div>
                <div className="col-md-3">
                    <label htmlFor="data-fim" className="form-label">Início</label>
                    <input value={inicio} onChange={(e) => setInicioOrdem(e.target.value)} type="datetime-local" className="form-control" min="2026-04-21" id="" />
                </div>
                <div className="col-md-3">
                    <label htmlFor="data-fim" className="form-label">Fim</label>
                    <input value={fim} onChange={(e) => setFimOrdem(e.target.value)} type="datetime-local" className="form-control" id="" />
                </div>
                <div className="col mb-3">
                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-dark" type="submit">Salvar</button>
                        <button className="btn btn-dark" onClick={limpar}>Limpar</button>
                    </div>
                </div>
            </div>
        </form>
    )

}

export default OrdemLimpezaForm