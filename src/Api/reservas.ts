import { pedir, ErroHttp } from "./https";
import type { Reserva, ReservaPayLoad } from "../types";

const RECURSO = '/Reserva';

export async function listarReservas(): Promise<Reserva[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<Reserva[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }
}

export async function listarReservasPeloHospede(hospedeId: number): Promise<Reserva[]> {
    try {
        return await pedir<Reserva[]>(`${RECURSO}/hospede/${hospedeId}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e
    }
}

export async function listarRelatorioFaturamento(dataInicio?: string, dataFim?: string): Promise<any> {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    try {
        return await pedir<any[]>(`${RECURSO}/relatorio/faturamento${params.toString()}`)
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        } throw e;
    }
}

export async function listarRelatorioReservasPeriodo(dataInicio?: string, dataFim?: string, hospedeId?: string, tipoDeQuartoId?: string): Promise<any> {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);
    if (hospedeId) params.append('hospedeId', hospedeId);
    if (tipoDeQuartoId) params.append('tipoDeQuartoId', tipoDeQuartoId);
    try {
        return await pedir<any[]>(`${RECURSO}/relatorio/periodo?${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        } throw e;
    }

}

export function criarReserva(payload: ReservaPayLoad): Promise<Reserva> {
    console.log(payload);
    return pedir<Reserva>(RECURSO, { metodo: 'POST', corpo: (payload) });
}

export function atualizarReserva(id: string, payload: ReservaPayLoad): Promise<Reserva> {
    return pedir<Reserva>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}

export function excluirReserva(id: string): Promise<Reserva> {
    return pedir<Reserva>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}
