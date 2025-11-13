"use client";
import React, { useState } from "react";
import { InsumoRequestDTO, createInsumo } from "@/services/InsumoService";

interface InsumoFormProps {
  onInsumoCreated: () => void;
}

export default function InsumoForm({ onInsumoCreated }: InsumoFormProps) {
  const [formData, setFormData] = useState<InsumoRequestDTO>({
    nome: "",
    unidadeMedida: "",
    estoqueAtual: 0,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Converte o estoque para número, se for o campo correto
      [name]: name === "estoqueAtual" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (
      !formData.nome ||
      !formData.unidadeMedida ||
      formData.estoqueAtual <= 0
    ) {
      setMessage({
        type: "error",
        text: "Preencha todos os campos corretamente.",
      });
      setLoading(false);
      return;
    }

    try {
      await createInsumo(formData);
      setMessage({ type: "success", text: "Insumo cadastrado com sucesso!" });

      setFormData({ nome: "", unidadeMedida: "", estoqueAtual: 0 });

      onInsumoCreated();
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error.message);
      setMessage({
        type: "error",
        text: `Falha no cadastro: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100 container mx-auto ">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
        1. Cadastro de Novo Insumo
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
            Nome do Insumo
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="unidadeMedida"
            className="block text-sm font-medium text-gray-700"
          >
            Unidade de Medida (Ex: Kg, L, Un)
          </label>
          <input
            type="text"
            name="unidadeMedida"
            id="unidadeMedida"
            value={formData.unidadeMedida}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="estoqueAtual"
            className="block text-sm font-medium text-gray-700"
          >
            Estoque Inicial
          </label>
          <input
            type="number"
            name="estoqueAtual"
            id="estoqueAtual"
            value={formData.estoqueAtual}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-900  transition duration-150"
        >
          {loading ? "Cadastrando..." : "Cadastrar Insumo"}
        </button>
      </form>
    </div>
  );
}
