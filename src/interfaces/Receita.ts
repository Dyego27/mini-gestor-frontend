export interface IngredienteRequestDTO {
  insumoId: number;
  quantidadeNecessaria: number;
}

export interface ReceitaRequestDTO {
  nome: string;
  modoPreparo: string;
  ingredientes: IngredienteRequestDTO[];
}
