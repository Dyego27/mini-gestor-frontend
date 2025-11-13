import { ReceitaRequestDTO } from "../interfaces/Receita";

const API_BASE_URL = "/api/v1/receitas";

export async function createReceita(data: ReceitaRequestDTO): Promise<any> {
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
    throw new Error(`Erro ao cadastrar receita: ${errorData.message}`);
  }

  return response.json();
}
