import type { ReactNode } from "react";
import Icone from "./Icone";

export type Transacao = {
  id: string;
  tipo: "ENVIO" | "RESGATE";
  valor: number;
  credito: boolean;
  descricao: string;
  contraparte: string;
  codigo: string | null;
  dataHora: string;
};
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

export default function ListaTransacoes({
  transacoes,
  vazio,
}: {
  transacoes: Transacao[];
  vazio: ReactNode;
}) {
  if (transacoes.length === 0) return <>{vazio}</>;
  return (
      <div className="flex flex-col gap-6">
                      {agruparPorDia(transacoes).map((grupo) => (
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
                                        {transacao.tipo === "RESGATE" ? "Resgate" : transacao.credito ? "Recebimento" : "Envio"} ·{" "}
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
  );
}
