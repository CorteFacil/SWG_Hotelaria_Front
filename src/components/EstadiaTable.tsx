import type { Estadia } from "../types";

interface EstadiaTableProps {
  estadias: Estadia[];
  onEdit: (estadia: Estadia) => void;
  onDelete: (id: number) => void;
}

export default function EstadiaTable({
  estadias,
  onEdit,
  onDelete,
}: EstadiaTableProps) {
  if (estadias.length === 0) {
    return (
      <div className="alert alert-secondary">
        Nenhuma estadia cadastrada.
      </div>
    );
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>ID</th>
          <th>Hóspede</th>
          <th>Quarto</th>
          <th>Funcionário</th>
          <th>Check-in</th>
          <th>Check-out</th>
          <th>Valor</th>
          <th>Status Quarto</th>
          <th width="180">Ações</th>
        </tr>
      </thead>

      <tbody>
        {estadias.map((estadia) => (
          <tr key={estadia.id}>
            <td>{estadia.id}</td>

            <td>{estadia.reserva?.hospede?.nome ?? "-"}</td>

            <td>{estadia.quarto?.numero ?? "-"}</td>

            <td>{estadia.funcionario?.nome ?? "-"}</td>

            <td>{estadia.checkIn}</td>

            <td>{estadia.checkOut}</td>

            <td>
              {Number(estadia.valorTotalEstadia).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </td>

            <td>
              {estadia.quarto?.status_quarto ?? "-"}
            </td>

            <td>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onEdit(estadia)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(estadia.id)}
                >
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}