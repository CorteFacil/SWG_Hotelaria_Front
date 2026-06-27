import { pedir, ErroHttp } from "./https";

const RECURSO1 = '/estadia/relatorio/lucroPorEstadia';
const RECURSO2 = '/estadia/relatorio/procedenciaGeografica';

interface RelatorioLucro {
    estadias: any[],
    somaTotal: number;
}


export async function listarRelatorioLucroEstadia(dataInicio: string, dataFim: string): Promise<RelatorioLucro | null> {
    try {
        return await pedir<RelatorioLucro>(`${RECURSO1}/${dataInicio}/${dataFim}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return null;
        }
        throw e;
    }

}


export async function listarRelatorioProcedencia(): Promise<any[]> {
    try {
        return await pedir<any[]>(`${RECURSO2}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}




//   getRelatorioLucroEstadia: (dataInicio: string, dataFim: string): Promise<any> => request(`/estadia/relatorio/lucroPorEstadia/${dataInicio}/${dataFim}`),
//   getRelatorioProcedencia: (): Promise<any> => request('/estadia/relatorio/procedenciaGeografica'),