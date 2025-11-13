// src/app/page.tsx

"use client";
import React, { useState } from "react";
import InsumoForm from "./_components/InsumoForm";
import InsumoTable from "./_components/InsumoTable";

import ReceitaForm from "./_components/ReceitaForm";

export default function HomePage() {
  const [refreshInsumos, setRefreshInsumos] = useState<(() => void) | null>(
    null
  );

  const handleListRefreshRegistration = (fetchFn: () => void) => {
    setRefreshInsumos(() => fetchFn);
  };

  const handleInsumoCreated = () => {
    if (refreshInsumos) {
      refreshInsumos();
    } else {
      console.error(
        "A função de recarga da tabela ainda não foi registrada. Tente atualizar a página."
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-700">
        Mini-Gestor de Receitas e Estoque
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <InsumoForm onInsumoCreated={handleInsumoCreated} />

          <ReceitaForm />
        </div>

        <div className="md:col-span-2">
          <InsumoTable onRefresh={handleListRefreshRegistration} />
        </div>
      </div>
    </div>
  );
}
