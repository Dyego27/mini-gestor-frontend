"use client";
import React, { useState, useEffect } from "react";
import {
  ReceitaRequestDTO,
  IngredienteRequestDTO,
} from "../../interfaces/Receita";
import { createReceita } from "../../services/ReceitaService";
import { getInsumos } from "@/services/InsumoService";
import { Insumo } from "@/interfaces/Insumo";

interface IngredienteFormState extends IngredienteRequestDTO {}

export default function ReceitaForm() {
  const [nome, setNome] = useState("");
  const [modoPreparo, setModoPreparo] = useState("");
  const [ingredientes, setIngredientes] = useState<IngredienteFormState[]>([
    { insumoId: 0, quantidadeNecessaria: 0 },
  ]);

  const [insumosDisponiveis, setInsumosDisponiveis] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadInsumos = async () => {
      try {
        const data = await getInsumos();
        setInsumosDisponiveis(data);
      } catch (error) {
        console.error("Não foi possível carregar a lista de insumos:", error);
        setMessage({
          type: "error",
          text: "Não foi possível carregar os insumos para seleção.",
        });
      }
    };
    loadInsumos();
  }, []);

  const handleIngredienteChange = (
    index: number,
    name: keyof IngredienteFormState,
    value: string | number
  ) => {
    const newIngredientes = ingredientes.map((ingrediente, i) => {
      if (i === index) {
        return {
          ...ingrediente,
          [name]:
            name === "insumoId"
              ? parseInt(value as string)
              : parseFloat(value as string),
        };
      }
      return ingrediente;
    });
    setIngredientes(newIngredientes);
  };

  const addIngrediente = () => {
    setIngredientes([
      ...ingredientes,
      { insumoId: 0, quantidadeNecessaria: 0 },
    ]);
  };

  const removeIngrediente = (index: number) => {
    if (ingredientes.length > 1) {
      setIngredientes(ingredientes.filter((_, i) => i !== index));
    } else {
      setMessage({
        type: "error",
        text: "É necessário pelo menos um ingrediente.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const validIngredientes = ingredientes.filter(
      (i) => i.insumoId > 0 && i.quantidadeNecessaria > 0
    );

    if (!nome || !modoPreparo || validIngredientes.length === 0) {
      setMessage({
        type: "error",
        text: "Preencha o nome, modo de preparo e pelo menos um ingrediente válido.",
      });
      setLoading(false);
      return;
    }

    const receitaDTO: ReceitaRequestDTO = {
      nome,
      modoPreparo,
      ingredientes: validIngredientes,
    };

    try {
      await createReceita(receitaDTO);
      setMessage({ type: "success", text: "Receita cadastrada com sucesso!" });

      setNome("");
      setModoPreparo("");
      setIngredientes([{ insumoId: 0, quantidadeNecessaria: 0 }]);
    } catch (error: any) {
      console.error("Erro ao cadastrar receita:", error.message);
      setMessage({
        type: "error",
        text: `Falha no cadastro: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
        2. Cadastro de Nova Receita
      </h2>

      {message && (
        <div
          className={`p-3 mb-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome da Receita
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Ex: Bolo de Chocolate"
          />
        </div>

        <div>
          <label
            htmlFor="modoPreparo"
            className="block text-sm font-medium text-gray-700"
          >
            Modo de Preparo (Resumo)
          </label>
          <textarea
            id="modoPreparo"
            value={modoPreparo}
            onChange={(e) => setModoPreparo(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Misture os secos, adicione os molhados, asse..."
          />
        </div>

        <h3 className="text-lg font-medium pt-2 text-gray-700 border-t mt-4">
          Ingredientes
        </h3>
        {ingredientes.map((ingrediente, index) => {
          const insumo = insumosDisponiveis.find(
            (i) => i.id === ingrediente.insumoId
          );
          const unidade = insumo ? insumo.unidadeMedida : "Unidade";

          return (
            <div
              key={index}
              className="flex space-x-2 items-end bg-gray-50 p-3 rounded-md"
            >
              {/* Select de Insumos */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600">
                  Insumo
                </label>
                <select
                  value={ingrediente.insumoId}
                  onChange={(e) =>
                    handleIngredienteChange(index, "insumoId", e.target.value)
                  }
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value={0} disabled>
                    Selecione o Insumo
                  </option>
                  {insumosDisponiveis.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nome} ({i.unidadeMedida})
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo de Quantidade */}
              <div className="w-1/3">
                <label className="block text-xs font-medium text-gray-600">
                  Quantidade ({unidade})
                </label>
                <input
                  type="number"
                  value={ingrediente.quantidadeNecessaria}
                  onChange={(e) =>
                    handleIngredienteChange(
                      index,
                      "quantidadeNecessaria",
                      e.target.value
                    )
                  }
                  min="0.01"
                  step="0.01"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>

              {/* Botão de Remover */}
              <button
                type="button"
                onClick={() => removeIngrediente(index)}
                className="h-10 px-2 text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition duration-150"
                disabled={ingredientes.length === 1}
              >
                X
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addIngrediente}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition duration-150"
        >
          + Adicionar Ingrediente
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition duration-150 mt-4"
        >
          {loading ? "Cadastrando Receita..." : "Cadastrar Receita"}
        </button>
      </form>
    </div>
  );
}
