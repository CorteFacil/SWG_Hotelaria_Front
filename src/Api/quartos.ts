import { pedir, ErroHttp } from "./https";
import type { Quarto, QuartoPayLoad } from "../types";

const RECURSO = '/quarto';

export async function listarQuartos(): Promise<Quarto[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<Quarto[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}

export function criarQuarto(payload: QuartoPayLoad): Promise<Quarto> {
    console.log(payload);
    return pedir<Quarto>(RECURSO, { metodo: 'POST', corpo: (payload) });
}

export function atualizarQuarto(id: number, payload: QuartoPayLoad): Promise<Quarto> {
    return pedir<Quarto>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}


export function excluirQuarto(id: number): Promise<Quarto> {
    return pedir<Quarto>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}