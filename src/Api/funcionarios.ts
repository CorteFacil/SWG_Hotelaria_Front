import { pedir, ErroHttp } from "./https";
import type { Funcionario, FuncionarioPayLoad } from "../types";

const RECURSO = '/funcionario';

export async function listarFuncionarios(): Promise<Funcionario[]> {
    const params = new URLSearchParams();
    try {
        return await pedir<Funcionario[]>(`${RECURSO}${params.toString()}`);
    } catch (e) {
        if (e instanceof ErroHttp && e.status === 404) {
            return [];
        }
        throw e;
    }

}


export function obterFuncionario(id: number): Promise<Funcionario> {
    return pedir<Funcionario>(`${RECURSO}/${id}`);
}

export function criarFuncionario(payload: FuncionarioPayLoad): Promise<Funcionario> {
    console.log(payload);
    return pedir<Funcionario>(RECURSO, { metodo: 'POST', corpo: payload });
}

export function atualizarFuncionario(id: string, payload: FuncionarioPayLoad): Promise<Funcionario> {
    return pedir<Funcionario>(`${RECURSO}/${id}`, { metodo: 'PUT', corpo: payload })

}

export function excluirFuncionario(id: string): Promise<Funcionario> {
    return pedir<Funcionario>(`${RECURSO}/${id}`, { metodo: "DELETE" })
}