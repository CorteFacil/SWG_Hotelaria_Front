import { pedir, ErroHttp } from "./https";
import type { OrdemLimpeza, OrdemLimpezaPayLoad } from "../types";

const RECURSO = '/ordemlimpeza';

export async function listarOrdemLimpeza(): Promise<OrdemLimpeza[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<OrdemLimpeza[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}

export function obterOrdemLimpeza(id: number): Promise<OrdemLimpeza> {
    return pedir<OrdemLimpeza>(`${RECURSO}/${id}`);
}

export function criarOrdemLimpeza(payload: OrdemLimpezaPayLoad): Promise<OrdemLimpeza> {
    console.log(payload);
    return pedir<OrdemLimpeza>(RECURSO, { metodo: 'POST', corpo: (payload) });
}

export function atualizarOrdemLimpeza(id: string, payload: OrdemLimpezaPayLoad): Promise<OrdemLimpeza> {
    return pedir<OrdemLimpeza>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}

export function excluirOrdemLimpeza(id: string): Promise<OrdemLimpeza> {
    return pedir<OrdemLimpeza>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}