import root from 'react-shadow';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?inline';

export default function AdminQuartoPage(){
  return (
    <root.div>
    <style>{bootstrapCss}</style>
      <form action="" className="container bg-light p-4">
        <label htmlFor="" className="form-label mb-4"><h2>Cadastro de Quarto</h2></label>
        <div className="row g-3 bg-secondary bg-opacity-10">
            <div className="col-md-4">
                <label htmlFor="nome" className="form-label">Numero do Quarto</label>
                <input type="text" name="numero-quarto" id="numero-quarto" className="form-control"/>
            </div>
            <div className="col-md-4">
                <label htmlFor="number" className="form-label">Andar</label>
                <input type="number" name="andar" id="andar" className="form-control"/>
            </div>
                <div className="col-md-4">
                <label htmlFor="number" className="form-label">Status</label>
                <select name="status" id="status" className="form-select">
                    <option value="">Selecione</option>
                </select>
            </div>
            <div className="col-md-12">
                <label htmlFor="number" className="form-label">Tipo de Quarto</label>
                <select name="tipo-quarto" id="tipo-quarto" className="form-select">
                    <option value="">Selecione</option>
                </select>
            </div>
            <div className="col mb-3">
                <div className="d-flex justify-content-end gap-1">
                    <button className="btn btn-dark" type="submit">Salvar</button>
                    <button className="btn btn-dark" type="submit">Cancelar</button>
                    <button className="btn btn-dark" type="button">Limpar</button>
                </div>
            </div>    
        </div>
    </form>
    </root.div>
  )
}
