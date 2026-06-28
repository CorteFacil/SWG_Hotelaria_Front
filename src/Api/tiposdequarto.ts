import { pedir, ErroHttp } from "./https";
import type { TipoDeQuarto, TipoDeQuartoPayLoad } from "../types";

const RECURSO = '/tipo-de-quarto';

export async function listarTipoDeQuarto(): Promise<TipoDeQuarto[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<TipoDeQuarto[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}

export function criarTipoDeQuarto(payload: TipoDeQuartoPayLoad): Promise<TipoDeQuarto> {
    console.log(payload);
    return pedir<TipoDeQuarto>(RECURSO, { metodo: 'POST', corpo: (payload) });
}

export function atualizarTipoDeQuarto(id: string, payload: TipoDeQuartoPayLoad): Promise<TipoDeQuarto> {
    return pedir<TipoDeQuarto>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}

export function excluirTipoDeQuarto(id: string): Promise<TipoDeQuarto> {
    return pedir<TipoDeQuarto>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}
