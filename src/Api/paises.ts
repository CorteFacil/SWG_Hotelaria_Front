import { pedir, ErroHttp } from "./https";
import type { Pais } from "../types";

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