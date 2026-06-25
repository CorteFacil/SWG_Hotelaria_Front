import root from 'react-shadow';
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?inline';

export default function AdminFuncionarioPage(){
  return (
    <root.div>
    <style>{bootstrapCss}</style>    
    <body className="d-flex flex-column min-vh-100 bg-dark-subtle">
      <form className="container bg-light p-4 md-2">
        <h2>Cadastro de Funcionário</h2>
        <br />
        <div className="row g-3 bg-secondary bg-opacity-10">
          <div className="col-md-4">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control" required id="nome" name="nome"/>
              <div className="invalid-feedback">Campo obrigatório</div>
            </div>
          <div className="col-md-4">
            <label className="form-label">Telefone</label>
            <input type="tel" className="form-control" placeholder="(99) 99999-9999" required id="telefone" name="telefone"/>
              <div className="invalid-feedback">Campo obrigatório</div>
            </div>
          <div className="col-md-4">
            <label className="form-label">Nascimento</label>
            <input type="date" className="form-control" id="nascimento" name="nascimento"/>
            </div>
          <div className="col-12">
            <label className="form-label">CPF</label>
          <input type="text" className="form-control" required placeholder="999.999.999-99" id="cpf" name="cpf"/>
            <div className="invalid-feedback">Campo obrigatório</div>
          </div>
        <div className="col-12">
          <label className="form-label">Email</label>
        <input type="email" className="form-control" required placeholder="seu@gmail.com" id="email" name="email"/>
          <div className="invalid-feedback">Campo obrigatório</div>
        </div>
        <div className="col-md-4">
          <label className="form-label">Cidade</label>
          <select className="form-select" id="cidade" name="cidade">
            <option>Selecione</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Bairro</label>
        <select className="form-select" id="bairro" name="bairro">
          <option>Selecione</option>
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label"> Rua</label>
      <input type="text" className="form-control" id="rua" name="rua"/>
      </div>
      <div className="col-md-12">
        <label>Cargo</label>
      <select className="form-select" id="cargo" name="cargo">
        <option value="funcionario">Funcionário</option>
        <option value="gerente">Gerente</option>
      </select>
    </div><div className="col-md-6">
        <label>Login</label>
        <input type="text" className="form-control" id="login" name="login"/>
      </div><div className="col-md-6">
        <label>Senha</label>
        <input type="password" className="form-control" id="senha" name="senha" placeholder="Mínimo 8 caracteres"/>
      </div><div className="col mb-3">
        <div className="d-flex justify-content-end gap-3">
          <button className="btn btn-dark">Salvar</button>
          <button className="btn btn-dark">Cancelar</button>
          <button className="btn btn-dark">Limpar</button>
        </div>
      </div>
    </div>
</form>
</body>
</root.div>
  )
}
