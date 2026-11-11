"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cabecalho from "../componentes/Cabecalho";
import CartaoSaldo from "../componentes/CartaoSaldo";
import Icone from "../componentes/Icone";
import Toast from "../componentes/Toast";
import { api, estiloCampo } from "../lib/api";

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
type GrupoDia = { chave: string; rotulo: string; transacoes: Transacao[] };

function chaveDia(data: Date): string {
  return `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;
}

function rotuloDia(data: Date): string {
  const hoje = new Date();
  const ontem = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1);
  if (chaveDia(data) === chaveDia(hoje)) return "Hoje";
  if (chaveDia(data) === chaveDia(ontem)) return "Ontem";
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function agruparPorDia(transacoes: Transacao[]): GrupoDia[] {
  const grupos = new Map<string, GrupoDia>();
  for (const transacao of transacoes) {
    const data = new Date(transacao.dataHora);
    const chave = chaveDia(data);
    const grupo = grupos.get(chave);
    if (grupo) {
      grupo.transacoes.push(transacao);
    } else {
      grupos.set(chave, { chave, rotulo: rotuloDia(data), transacoes: [transacao] });
    }
  }
  return [...grupos.values()];
}

function formatarHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

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
      <div className="flex-1">
        <Cabecalho ativo="extrato" />
        <Toast tipo="erro" mensagem={erro} onFechar={() => setErro("")} />
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
              <Icone nome="extrato" className="h-5 w-5" />
            </span>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Extrato do aluno</h1>
                <p className="text-sm text-slate-500">Saldo de moedas, recebimentos e trocas.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col justify-end md:col-span-2">
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
                {extrato.transacoes.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                        <Icone nome="extrato" className="h-6 w-6" />
                      </span>
                      <p className="font-medium text-slate-700">Nenhuma transação ainda</p>
                      <p className="text-sm text-slate-500">As moedas recebidas e as trocas feitas aparecerão aqui.</p>
                      <Link
                          href="/vantagens"
                          className="mt-3 inline-flex items-center gap-2 rounded-full bg-marca-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700"
                      >
                        Ver catálogo de vantagens
                        <Icone nome="seta" className="h-4 w-4" />
                      </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                      {agruparPorDia(extrato.transacoes).map((grupo) => (
                          <div key={grupo.chave}>
                            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              {grupo.rotulo}
                            </h3>
                            <ul className="flex flex-col gap-3">
                              {grupo.transacoes.map((transacao) => (
                                  <li
                                      key={transacao.id}
                                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                  >
                                    <span
                                        role="img"
                                        aria-label={transacao.credito ? "Entrada" : "Saída"}
                                        className={
                                          transacao.credito
                                              ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                                              : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marca-50 text-marca-600"
                                        }
                                    >
                                      <Icone nome={transacao.credito ? "setaCima" : "setaBaixo"} className="h-5 w-5" />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate font-medium text-slate-900">{transacao.descricao}</p>
                                      <p className="truncate text-sm text-slate-500">
                                        {transacao.tipo === "ENVIO" ? "Recebimento" : "Resgate"} ·{" "}
                                        {transacao.credito ? "De" : "Para"} {transacao.contraparte} ·{" "}
                                        {formatarHora(transacao.dataHora)}
                                        {transacao.codigo ? ` · Código ${transacao.codigo}` : ""}
                                      </p>
                                    </div>
                                    <p
                                        className={
                                          transacao.credito
                                              ? "shrink-0 font-semibold text-emerald-700"
                                              : "shrink-0 font-semibold text-marca-700"
                                        }
                                    >
                                      {transacao.credito ? "+" : "−"}
                                      {transacao.valor}
                                    </p>
                                  </li>
                              ))}
                            </ul>
                          </div>
                      ))}
                    </div>
                )}
              </section>
          )}
        </main>
      </div>
  );
}
