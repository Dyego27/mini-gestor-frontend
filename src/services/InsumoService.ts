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
