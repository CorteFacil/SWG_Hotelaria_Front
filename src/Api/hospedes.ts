import { pedir, ErroHttp } from "./https";
import type { Hospede, HospedePayLoad } from "../types";

const RECURSO = '/hospede';

export async function listarHospedes(): Promise<Hospede[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<Hospede[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}


export function criarHospede(payload: HospedePayLoad): Promise<Hospede> {
    console.log(payload);
    return pedir<Hospede>(RECURSO, { metodo: 'POST', corpo: (payload) });
}

export function atualizarHospede(id: string, payload: HospedePayLoad): Promise<Hospede> {
    return pedir<Hospede>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}


export function excluirHospede(id: string): Promise<Hospede> {
    return pedir<Hospede>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}