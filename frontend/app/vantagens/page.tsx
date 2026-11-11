"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Aviso from "../componentes/Aviso";
import Cabecalho from "../componentes/Cabecalho";
import Icone from "../componentes/Icone";
import { api, estiloCampo, formatarDataHora } from "../lib/api";

type Vantagem = {
  id: string;
  empresaNome: string;
  nome: string;
  descricao: string;
  custoMoedas: number;
  foto: string;
};
type AlunoResumo = { id: string; nome: string };
type Extrato = { saldoMoedas: number };
type Resgate = {
  codigo: string;
  vantagem: string;
  empresa: string;
  custoMoedas: number;
  saldoRestante: number;
  dataHora: string;
};

export default function VantagensPage() {
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [alunoId, setAlunoId] = useState("");
  const [saldo, setSaldo] = useState<number | null>(null);
  const [resgate, setResgate] = useState<Resgate | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let ativo = true;
    Promise.all([api<Vantagem[]>("/vantagens"), api<AlunoResumo[]>("/alunos")])
      .then(([v, a]) => {
        if (!ativo) return;
        setVantagens(v);
        setAlunos(a);
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
  }, []);

  async function escolherAluno(id: string) {
    setAlunoId(id);
    setResgate(null);
    setErro("");
    setSaldo(null);
    if (!id) return;
    try {
      const extrato = await api<Extrato>(`/alunos/${id}/extrato`);
      setSaldo(extrato.saldoMoedas);
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function resgatar(vantagem: Vantagem) {
    if (!alunoId) {
      setErro("Selecione o aluno que vai resgatar a vantagem.");
      return;
    }
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

  return (
    <div className="min-h-screen">
      <Cabecalho ativo="vantagens" />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <Icone nome="vantagem" className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Catálogo de vantagens</h1>
              <p className="text-sm text-slate-500">Escolha quem vai resgatar e troque moedas por vantagens.</p>
            </div>
            <Link
              href="/vantagens/gerenciar"
              className="ml-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              Gerenciar vantagens (empresas)
            </Link>
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
              <p className="mb-1.5 text-sm font-medium text-slate-700">Saldo</p>
              <p className="rounded-xl bg-violet-50 px-3.5 py-2.5 text-sm font-semibold text-violet-700">
                {saldo === null ? "—" : `${saldo} moedas`}
              </p>
            </div>
          </div>

          {erro && <Aviso tipo="erro">{erro}</Aviso>}
          {resgate && (
            <Aviso tipo="sucesso">
              Resgate de &quot;{resgate.vantagem}&quot; ({resgate.empresa}) concluído em{" "}
              {formatarDataHora(resgate.dataHora)}. Código do cupom: <strong>{resgate.codigo}</strong>. Enviamos o
              cupom por e-mail.
            </Aviso>
          )}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Vantagens disponíveis</h2>
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              {vantagens.length}
            </span>
          </div>

          {carregando ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Carregando vantagens...
            </div>
          ) : vantagens.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Icone nome="vantagem" className="h-6 w-6" />
              </span>
              <p className="font-medium text-slate-700">Nenhuma vantagem cadastrada</p>
              <p className="text-sm text-slate-500">As empresas parceiras cadastram as vantagens em Gerenciar vantagens.</p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {vantagens.map((vantagem) => (
                <li
                  key={vantagem.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-violet-200 hover:shadow-md"
                >
                  <Image
                    src={vantagem.foto}
                    alt={vantagem.nome}
                    width={600}
                    height={360}
                    unoptimized
                    className="h-44 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <p className="text-xs font-medium text-violet-700">{vantagem.empresaNome}</p>
                    <p className="font-semibold text-slate-900">{vantagem.nome}</p>
                    <p className="flex-1 text-sm text-slate-500">{vantagem.descricao}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
                        {vantagem.custoMoedas} moedas
                      </span>
                      <button
                        type="button"
                        disabled={ocupado}
                        onClick={() => void resgatar(vantagem)}
                        className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98] disabled:opacity-60"
                      >
                        Resgatar
                      </button>
                    </div>
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
