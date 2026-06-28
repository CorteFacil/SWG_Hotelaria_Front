import { pedir, ErroHttp } from "./https";
import type { Pais, PaisPayLoad } from "../types";

const RECURSO = '/pais';

export async function listarPaises(): Promise<Pais[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<Pais[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}

export function criarPais(payload: PaisPayLoad): Promise<Pais> {
    console.log(payload);
    return pedir<Pais>(RECURSO, { metodo: 'POST', corpo: (payload) });
}

export function atualizarPais(id: string, payload: PaisPayLoad): Promise<Pais> {
    return pedir<Pais>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}

export function excluirPais(id: string): Promise<Pais> {
    return pedir<Pais>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}