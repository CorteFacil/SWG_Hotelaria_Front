import { pedir, ErroHttp } from "./https";
import type { Estado, EstadoPayLoad } from "../types";

const RECURSO = '/estado';

export async function listarEstados(): Promise<Estado[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<Estado[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}

export function obterEstado(id: number): Promise<Estado> {
    return pedir<Estado>(`${RECURSO}/${id}`);
}

export function criarEstado(payload: EstadoPayLoad): Promise<Estado> {
    console.log(payload);
    return pedir<Estado>(RECURSO, { metodo: 'POST', corpo: (payload) });
}

export function atualizarEstado(id: string, payload: EstadoPayLoad): Promise<Estado> {
    return pedir<Estado>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}

export function excluirEstado(id: string): Promise<Estado> {
    return pedir<Estado>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}
