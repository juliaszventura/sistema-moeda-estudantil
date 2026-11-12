"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Cabecalho from "../componentes/Cabecalho";
import CartaoSaldo from "../componentes/CartaoSaldo";
import Icone from "../componentes/Icone";
import Toast from "../componentes/Toast";
import { api, formatarDataHora } from "../lib/api";
import { useSessaoExigida } from "../lib/sessao";

type Vantagem = {
  id: string;
  empresaNome: string;
  nome: string;
  descricao: string;
  custoMoedas: number;
  foto: string;
};
type Extrato = { saldoMoedas: number };
type Resgate = {
  codigo: string;
  vantagem: string;
  empresa: string;
  custoMoedas: number;
  saldoRestante: number;
  dataHora: string;
};

function CartaoCupom({ resgate }: { resgate: Resgate }) {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!copiado) return;
    const temporizador = window.setTimeout(() => setCopiado(false), 2000);
    return () => window.clearTimeout(temporizador);
  }, [copiado]);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(resgate.codigo);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
      <div role="status" className="relative overflow-hidden rounded-2xl border-2 border-dashed border-marca-300 bg-marca-50">
        <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-dashed border-marca-300 bg-white" />
        <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-dashed border-marca-300 bg-white" />
        <div className="flex flex-col gap-5 px-8 py-6 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-marca-600">
              <Icone nome="cupom" className="h-4 w-4" />
              Resgate concluído
            </p>
            <p className="text-lg font-bold text-slate-900">{resgate.vantagem}</p>
            <p className="text-sm text-slate-600">{resgate.empresa}</p>
            <p className="mt-2 text-xs text-slate-500">
              {formatarDataHora(resgate.dataHora)} · Saldo restante:{" "}
              <strong className="text-marca-700">{resgate.saldoRestante} moedas</strong>
            </p>
            <p className="text-xs text-slate-500">Enviamos o cupom por e-mail.</p>
          </div>
          <div className="flex flex-col items-start gap-3 border-t-2 border-dashed border-marca-200 pt-5 md:items-center md:border-l-2 md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-xs font-medium text-slate-500">Código do cupom</p>
            <p className="font-mono text-3xl font-bold tracking-widest text-marca-700">{resgate.codigo}</p>
            <button
                type="button"
                onClick={() => void copiar()}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    copiado
                        ? "bg-emerald-600 text-white"
                        : "bg-marca-600 text-white hover:bg-marca-700 active:scale-[0.98]"
                }`}
            >
              <Icone nome={copiado ? "ok" : "copiar"} className="h-4 w-4" />
              {copiado ? "Copiado!" : "Copiar código"}
            </button>
          </div>
        </div>
      </div>
  );
}

export default function VantagensPage() {
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const sessao = useSessaoExigida("ALUNO");
  const alunoId = sessao?.id;
  const [saldo, setSaldo] = useState<number | null>(null);
  const [resgate, setResgate] = useState<Resgate | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    if (!alunoId) return;
    let ativo = true;
    Promise.all([api<Vantagem[]>("/vantagens"), api<Extrato>(`/alunos/${alunoId}/extrato`)])
        .then(([v, e]) => {
          if (!ativo) return;
          setVantagens(v);
          setSaldo(e.saldoMoedas);
        })
        .catch((e: Error) => {
          if (ativo) setErro(e.message);
        })
        .finally(() => {
          if (ativo) setCarregando(false);
        });
    return () => {
      ativo = false;
    };
  }, [alunoId]);

  async function resgatar(vantagem: Vantagem) {
    if (!alunoId) return;
    if (!window.confirm(`Resgatar "${vantagem.nome}" por ${vantagem.custoMoedas} moedas?`)) return;
    setErro("");
    setResgate(null);
    setOcupado(true);
    try {
      const resultado = await api<Resgate>(`/alunos/${alunoId}/resgates`, {
        method: "POST",
        body: JSON.stringify({ vantagemId: vantagem.id }),
      });
      setResgate(resultado);
      setSaldo(resultado.saldoRestante);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  if (!sessao) return null;

  return (
      <div className="flex-1">
        <Cabecalho ativo="vantagens" />
        <Toast tipo="erro" mensagem={erro} onFechar={() => setErro("")} />
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
              <Icone nome="vantagem" className="h-5 w-5" />
            </span>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Catálogo de vantagens</h1>
                <p className="text-sm text-slate-500">Troque suas moedas por produtos e descontos.</p>
              </div>
            </div>

            <div className="max-w-sm">
              <CartaoSaldo rotulo="Meu saldo" saldo={saldo} />
            </div>

            {resgate && <CartaoCupom key={resgate.codigo} resgate={resgate} />}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Vantagens disponíveis</h2>
              <span className="rounded-full bg-marca-50 px-3 py-1 text-xs font-semibold text-marca-700">
              {vantagens.length}
            </span>
            </div>

            {carregando ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                  Carregando vantagens...
                </div>
            ) : vantagens.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                <Icone nome="vantagem" className="h-6 w-6" />
              </span>
                  <p className="font-medium text-slate-700">Nenhuma vantagem cadastrada</p>
                  <p className="text-sm text-slate-500">As empresas parceiras ainda não cadastraram vantagens.</p>
                </div>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {vantagens.map((vantagem) => (
                      <li
                          key={vantagem.id}
                          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-marca-300 hover:shadow-md"
                      >
                        <div className="relative">
                          <Image
                              src={vantagem.foto}
                              alt={vantagem.nome}
                              width={600}
                              height={360}
                              unoptimized
                              className="h-44 w-full object-cover"
                          />
                          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ouro-100 px-3 py-1 text-sm font-bold text-ouro-700 shadow-sm ring-1 ring-ouro-500/40">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ouro-500 text-white">
                              <Icone nome="moeda" className="h-3 w-3" />
                            </span>
                            {vantagem.custoMoedas} moedas
                          </span>
                          <span className="absolute bottom-3 left-3 max-w-[70%] truncate rounded-md bg-slate-900/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                            {vantagem.empresaNome}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 p-4">
                          <p className="font-semibold text-slate-900">{vantagem.nome}</p>
                          <p className="flex-1 text-sm text-slate-500">{vantagem.descricao}</p>
                          <button
                              type="button"
                              disabled={ocupado}
                              onClick={() => void resgatar(vantagem)}
                              className="mt-3 self-end rounded-full bg-marca-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700 active:scale-[0.98] disabled:opacity-60"
                          >
                            Resgatar
                          </button>
                        </div>
                      </li>
                  ))}
                </ul>
            )}
          </section>
        </main>
      </div>
  );
}
