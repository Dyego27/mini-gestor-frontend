import { Insumo } from "@/interfaces/Insumo";

const API_BASE_URL = "/api/v1/insumos";

export async function getInsumos(): Promise<Insumo[]> {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Erro ${response.status}: Falha ao buscar a lista de insumos.`
    );
  }

  return response.json();
}

export interface InsumoRequestDTO {
  nome: string;
  unidadeMedida: string;

  estoqueAtual: number;
}

export async function createInsumo(data: InsumoRequestDTO): Promise<Insumo> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 201) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(`Erro ao cadastrar insumo: ${errorData.message}`);
  }

  return response.json(); // Retorna o objeto Insumo criado
}
