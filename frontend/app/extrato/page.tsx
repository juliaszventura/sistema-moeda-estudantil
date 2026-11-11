"use client";

import { useEffect, useState } from "react";
import Aviso from "../componentes/Aviso";
import Cabecalho from "../componentes/Cabecalho";
import Icone from "../componentes/Icone";
import { api, estiloCampo, formatarDataHora } from "../lib/api";

type AlunoResumo = { id: string; nome: string };
type Transacao = {
  id: string;
  tipo: "ENVIO" | "RESGATE";
  valor: number;
  credito: boolean;
  descricao: string;
  contraparte: string;
  codigo: string | null;
  dataHora: string;
};
type Extrato = { nome: string; saldoMoedas: number; transacoes: Transacao[] };

export default function ExtratoPage() {
  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [alunoId, setAlunoId] = useState("");
  const [extrato, setExtrato] = useState<Extrato | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    api<AlunoResumo[]>("/alunos")
      .then((dados) => {
        if (ativo) setAlunos(dados);
      })
      .catch((e: Error) => {
        if (ativo) setErro(e.message);
      });
    return () => {
      ativo = false;
    };
  }, []);

  async function escolherAluno(id: string) {
    setAlunoId(id);
    setErro("");
    setExtrato(null);
    if (!id) return;
    try {
      setExtrato(await api<Extrato>(`/alunos/${id}/extrato`));
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  return (
    <div className="min-h-screen">
      <Cabecalho ativo="extrato" />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Icone nome="extrato" className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Extrato do aluno</h1>
              <p className="text-sm text-slate-500">Saldo de moedas, recebimentos e trocas.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label htmlFor="aluno" className="mb-1.5 block text-sm font-medium text-slate-700">
                Aluno
              </label>
              <select
                id="aluno"
                className={estiloCampo}
                value={alunoId}
                onChange={(e) => void escolherAluno(e.target.value)}
              >
                <option value="">Selecione o aluno</option>
                {alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <p className="mb-1.5 text-sm font-medium text-slate-700">Saldo atual</p>
              <p className="rounded-xl bg-violet-50 px-3.5 py-2.5 text-sm font-semibold text-violet-700">
                {extrato ? `${extrato.saldoMoedas} moedas` : "—"}
              </p>
            </div>
          </div>
          {erro && (
            <div className="mt-5">
              <Aviso tipo="erro">{erro}</Aviso>
            </div>
          )}
        </section>

        {extrato && (
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Transações de {extrato.nome}</h2>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                {extrato.transacoes.length}
              </span>
            </div>
            {extrato.transacoes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500">
                Nenhuma transação ainda.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {extrato.transacoes.map((transacao) => (
                  <li
                    key={transacao.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <span
                      className={
                        transacao.credito
                          ? "rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
                          : "rounded-md bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700"
                      }
                    >
                      {transacao.tipo === "ENVIO" ? "Recebimento" : "Resgate"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{transacao.descricao}</p>
                      <p className="truncate text-sm text-slate-500">
                        {transacao.credito ? "De" : "Para"} {transacao.contraparte} ·{" "}
                        {formatarDataHora(transacao.dataHora)}
                        {transacao.codigo ? ` · Código ${transacao.codigo}` : ""}
                      </p>
                    </div>
                    <p className={transacao.credito ? "font-semibold text-emerald-700" : "font-semibold text-red-600"}>
                      {transacao.credito ? "+" : "−"}
                      {transacao.valor}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
