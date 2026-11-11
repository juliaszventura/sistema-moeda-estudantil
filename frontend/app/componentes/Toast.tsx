"use client";

import { useEffect, useEffectEvent } from "react";
import Icone from "./Icone";

const DURACAO = 5000;

export default function Toast({
    tipo,
    mensagem,
    onFechar,
}: {
    tipo: "erro" | "sucesso";
    mensagem: string;
    onFechar: () => void;
}) {
    const fechar = useEffectEvent(onFechar);

    useEffect(() => {
        if (!mensagem) return;
        const temporizador = window.setTimeout(() => fechar(), DURACAO);
        return () => window.clearTimeout(temporizador);
    }, [mensagem]);

    if (!mensagem) return null;

    const erro = tipo === "erro";

    return (
        <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-end sm:left-auto sm:right-6 sm:top-6">
            <div
                role={erro ? "alert" : "status"}
                className={`toast-entrada pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-lg ${
                    erro ? "border-red-200" : "border-emerald-200"
                }`}
            >
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        erro ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                    }`}
                >
                    <Icone nome={erro ? "alerta" : "ok"} className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-sm font-semibold text-slate-900">{erro ? "Algo deu errado" : "Tudo certo"}</p>
                    <p className="text-sm text-slate-600">{mensagem}</p>
                </div>
                <button
                    type="button"
                    onClick={onFechar}
                    aria-label="Fechar aviso"
                    className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                    <Icone nome="fechar" className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
