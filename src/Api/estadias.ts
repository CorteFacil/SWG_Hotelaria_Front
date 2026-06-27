import { pedir, ErroHttp } from "./https";
import type { Estadia, EstadiaPayLoad } from "../types";

const RECURSO = '/Estadia';

export async function listarEstadias(): Promise<Estadia[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<Estadia[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}

export function obterEstadia(id: number): Promise<Estadia> {
    return pedir<Estadia>(`${RECURSO}/${id}`);
}

export function criarEstadia(payload: EstadiaPayLoad): Promise<Estadia> {
    console.log(payload);
    return pedir<Estadia>(RECURSO, { metodo: 'POST', corpo: (payload) });
}

export function atualizarEstadia(id: string, payload: EstadiaPayLoad): Promise<Estadia> {
    return pedir<Estadia>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}

export function excluirEstadia(id: string): Promise<Estadia> {
    return pedir<Estadia>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}
