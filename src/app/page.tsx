"use client";

import InsumoForm from "./_components/InsumoForm";
import InsumoTable from "./_components/InsumoTable";

export default function HomePage() {
  return (
    <main>
      <InsumoTable />
      <InsumoForm />
    </main>
  );
}
