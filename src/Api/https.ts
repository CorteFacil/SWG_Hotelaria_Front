
const BASE_URL = 'http://localhost:3333';

if (!BASE_URL) {
    throw new Error(
        'Vite_Api_Url não definido'
    );
}

/** Erro de HTTP que carrega o status, para quem chama poder reagir (ex.: 404). */
export class ErroHttp extends Error {
    status: number;
    tipo?: string;

    constructor(status: number, mensage: string, tipo?: string) {
        super(mensage);
        this.name = 'ErrorHttp';
        this.status = status;
        this.tipo = tipo
    }
}


type OpcoesPedido = {
    metodo?: 'GET' | 'POST' | 'DELETE' | 'PUT';
    corpo?: unknown
    sinal?: AbortSignal;
};



/**
 * Faz uma requisição ao backend e devolve o JSON já tipado.
 * Centraliza headers, serialização e tratamento de erro num só lugar.
 */
export async function pedir<T>(caminho: string, opcoes: OpcoesPedido = {}): Promise<T> {
    const { metodo = 'GET', corpo, sinal } = opcoes;

    const respostas = await fetch(`${BASE_URL}${caminho}`, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
        signal: sinal,
    });
    console.log(respostas)
    if (!respostas.ok) {
        const corpo = await respostas.json().catch(() => null);
        throw new ErroHttp(respostas.status, corpo?.message ?? `Falha Http ${respostas.status} em ${caminho}`);
    }
    console.log(respostas.status);
    if (respostas.status === 204) {
        return undefined as T;
    }
    console.log(respostas);
    return (await respostas.json()) as T;

}