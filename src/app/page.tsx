"use client";
import React, { useState, useEffect } from "react";
import { Insumo } from "../interfaces/Insumo";
import { getInsumos } from "../services/InsumoService";

export default function HomePage() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsumos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInsumos();
      setInsumos(data);
    } catch (err) {
      console.error("Erro de API:", err);
      // Mensagem clara em caso de falha na comunicação
      setError(
        "Não foi possível carregar os insumos. Verifique se o Back-end está rodando (porta 8080)."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsumos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-700">
        Mini-Gestor de Receitas e Estoque
      </h1>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Painel para a lista de Insumos */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Estoque Atual de Insumos
          </h2>

          <button
            onClick={fetchInsumos}
            className="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md disabled:bg-indigo-300"
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar Lista"}
          </button>

          {/* Exibição do status */}
          {error && (
            <p className="text-red-700 bg-red-100 p-3 rounded-lg border border-red-300">
              {error}
            </p>
          )}
          {loading && !error && (
            <p className="text-gray-500">Carregando dados...</p>
          )}

          {/* Tabela de Insumos */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Unidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Estoque
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {insumos.map((insumo) => (
                    <tr key={insumo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {insumo.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {insumo.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {insumo.unidadeMedida}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-bold">
                        {insumo.estoqueAtual.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {insumos.length === 0 && !loading && !error && (
            <p className="text-gray-500 mt-4">Nenhum insumo cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
