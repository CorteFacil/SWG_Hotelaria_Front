import { useState, type SyntheticEvent } from 'react'
import type { Quarto, Funcionario } from '../types'
import root from 'react-shadow';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?inline';


interface OrdemLimpezaFormProps {
    funcionarios: Funcionario[]
    quartos: Quarto[]
    onSubmit: (data: {
        status: string
        observacao?: string
        inicioOrdem: string
        fimOrdem: string
        funcionarioId: number
        quartoId: number
    }) => void
}

function OrdemLimpezaForm({ funcionarios, quartos, onSubmit} : OrdemLimpezaFormProps) {
    const [inicioOrdem, setInicioOrdem] = useState('')
    const [fimOrdem, setFimOrdem] = useState('')
    const [observacao, setObservacao] = useState('')
    const [status, setStatus] = useState('')
    const [funcionarioId, setFuncionarioId] = useState('')
    const [quartoId, setQuartoId] = useState('')

    function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit({
            inicioOrdem,
            fimOrdem,
            observacao,
            status,
            funcionarioId: Number(funcionarioId),
            quartoId: Number(quartoId)
        })
    }

    return (
    <root.div>
    <style>{bootstrapCss}</style>
    <form onSubmit={handleSubmit} className="container bg-light p-4">
    <h2>Cadastro de Ordem de Limpeza</h2>
    <br/>
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
                    <option key={map.id} value={map.id}>{map.numero}</option>
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
                <input value={status} onChange={(e) => setStatus(e.target.value)} type="radio" name="status" id="concluido"/>
                <label htmlFor="concluido" className="form-check-label">Concluido</label>
            </div>
            <div className="form-check-inline">
                <input value={status} onChange={(e) => setStatus(e.target.value)} type="radio" name="status" id="andamento"/>
                <label htmlFor="andamento" className="form-check-label">Andamento</label>
            </div>
            <div className="form-check-inline">
                <input value={status} onChange={(e) => setStatus(e.target.value)} type="radio" name="status" id="nao-concluido"/>
                <label htmlFor="nao-concluido" className="form-check-label">Não Concluido</label>
            </div>
        </div>
        <hr/>
        <div className="col-md-6">
            <label htmlFor="observacao" className="form-label">Observação</label>
            <textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} name="observacao" id="observacao" className="form-control" rows={5}></textarea>    
        </div>
        <div className="col-md-3">
            <label htmlFor="data-fim" className="form-label">Início</label>
            <input value={inicioOrdem} onChange={(e) => setInicioOrdem(e.target.value)} type="time" className="form-control" min="2026-04-21" id=""/>
        </div>
        <div className="col-md-3">
            <label htmlFor="data-fim" className="form-label">Fim</label>
            <input value={fimOrdem} onChange={(e) => setFimOrdem(e.target.value)} type="time" className="form-control" id=""/>
        </div>
        <div className="col mb-3">
            <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-dark" type="submit">Salvar</button>
                <button className="btn btn-dark" type="submit">Cancelar</button>
                <button className="btn btn-dark" type="submit">Limpar</button>
            </div>
        </div>
    </div>
    </form>
    </root.div>
    )

}

export default OrdemLimpezaForm