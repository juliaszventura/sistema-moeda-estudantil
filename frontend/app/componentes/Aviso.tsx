import type { ReactNode } from "react";
import Icone from "./Icone";

export default function Aviso({ tipo, children }: { tipo: "erro" | "sucesso"; children: ReactNode }) {
  const erro = tipo === "erro";
  return (
    <p
      role={erro ? "alert" : "status"}
      className={
        erro
          ? "flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
          : "flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700"
      }
    >
      <Icone nome={erro ? "alerta" : "ok"} className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
