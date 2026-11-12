"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cabecalho from "./Cabecalho";
import CartaoSaldo from "./CartaoSaldo";
import Icone from "./Icone";
import ListaTransacoes, { Transacao } from "./ListaTransacoes";
import Toast from "./Toast";
import { api } from "../lib/api";

type Extrato = { nome: string; saldoMoedas: number; transacoes: Transacao[] };

export default function PaginaExtrato({
  caminho,
  titulo,
  subtitulo,
  vazioTexto,
  acaoHref,
  acaoRotulo,
  ativo,
}: {
  caminho: string;
  titulo: string;
  subtitulo: string;
  vazioTexto: string;
  acaoHref: string;
  acaoRotulo: string;
  ativo: string;
}) {
  const [extrato, setExtrato] = useState<Extrato | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativoEfeito = true;
    api<Extrato>(caminho)
        .then((dados) => {
          if (ativoEfeito) setExtrato(dados);
        })
        .catch((e: Error) => {
          if (ativoEfeito) setErro(e.message);
        });
    return () => {
      ativoEfeito = false;
    };
  }, [caminho]);

  return (
      <div className="flex-1">
        <Cabecalho ativo={ativo} />
        <Toast tipo="erro" mensagem={erro} onFechar={() => setErro("")} />
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                <Icone nome="extrato" className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">{titulo}</h1>
                <p className="text-sm text-slate-500">{subtitulo}</p>
              </div>
            </div>
            <div className="max-w-sm">
              <CartaoSaldo rotulo="Saldo atual" saldo={extrato ? extrato.saldoMoedas : null} />
            </div>
          </section>

          {extrato && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Transações de {extrato.nome}</h2>
                  <span className="rounded-full bg-marca-50 px-3 py-1 text-xs font-semibold text-marca-700">
                    {extrato.transacoes.length}
                  </span>
                </div>
                <ListaTransacoes
                    transacoes={extrato.transacoes}
                    vazio={
                      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                          <Icone nome="extrato" className="h-6 w-6" />
                        </span>
                        <p className="font-medium text-slate-700">Nenhuma transação ainda</p>
                        <p className="text-sm text-slate-500">{vazioTexto}</p>
                        <Link
                            href={acaoHref}
                            className="mt-3 inline-flex items-center gap-2 rounded-full bg-marca-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700"
                        >
                          {acaoRotulo}
                          <Icone nome="seta" className="h-4 w-4" />
                        </Link>
                      </div>
                    }
                />
              </section>
          )}
        </main>
      </div>
  );
}
