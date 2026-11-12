"use client";

import { FormEvent, useEffect, useState } from "react";
import Cabecalho from "../../componentes/Cabecalho";
import CartaoSaldo from "../../componentes/CartaoSaldo";
import Icone from "../../componentes/Icone";
import Toast from "../../componentes/Toast";
import { api, estiloCampo, formatarDataHora } from "../../lib/api";
import { useSessaoExigida } from "../../lib/sessao";

type AlunoResumo = { id: string; nome: string };
type Professor = { saldoMoedas: number; departamento: string; instituicao: string };
type Envio = { aluno: string; valor: number; saldoRestante: number; dataHora: string };

export default function EnviarMoedasPage() {
  const sessao = useSessaoExigida("PROFESSOR");
  const professorId = sessao?.id;
  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [saldo, setSaldo] = useState<number | null>(null);
  const [alunoId, setAlunoId] = useState("");
  const [valor, setValor] = useState("");
  const [motivo, setMotivo] = useState("");
  const [envio, setEnvio] = useState<Envio | null>(null);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    if (!professorId) return;
    let ativo = true;
    Promise.all([api<AlunoResumo[]>("/alunos"), api<Professor>(`/professores/${professorId}`)])
        .then(([a, p]) => {
          if (!ativo) return;
          setAlunos(a);
          setSaldo(p.saldoMoedas);
        })
        .catch((e: Error) => {
          if (ativo) setErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, [professorId]);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    if (!professorId) return;
    setErro("");
    setEnvio(null);
    setOcupado(true);
    try {
      const resultado = await api<Envio>(`/professores/${professorId}/envios`, {
        method: "POST",
        body: JSON.stringify({ alunoId, valor: Number(valor), motivo }),
      });
      setEnvio(resultado);
      setSaldo(resultado.saldoRestante);
      setValor("");
      setMotivo("");
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  if (!sessao) return null;

  return (
      <div className="flex-1">
        <Cabecalho ativo="enviar" />
        <Toast tipo="erro" mensagem={erro} onFechar={() => setErro("")} />
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                <Icone nome="moedas" className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Enviar moedas</h1>
                <p className="text-sm text-slate-500">Reconheça um aluno e informe o motivo. Ele será avisado por e-mail.</p>
              </div>
            </div>

            <form onSubmit={(e) => void enviar(e)} className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 md:row-span-3 flex flex-col gap-4">
                <div>
                  <label htmlFor="aluno" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Aluno
                  </label>
                  <select
                      id="aluno"
                      className={estiloCampo}
                      value={alunoId}
                      onChange={(e) => setAlunoId(e.target.value)}
                      required
                  >
                    <option value="">Selecione o aluno</option>
                    {alunos.map((aluno) => (
                        <option key={aluno.id} value={aluno.id}>
                          {aluno.nome}
                        </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="valor" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Quantidade de moedas
                  </label>
                  <input
                      id="valor"
                      type="number"
                      min={1}
                      max={100000}
                      className={estiloCampo}
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      required
                  />
                </div>
                <div>
                  <label htmlFor="motivo" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Motivo
                  </label>
                  <textarea
                      id="motivo"
                      rows={3}
                      maxLength={500}
                      className={estiloCampo}
                      placeholder="Ex.: Participação excelente no seminário"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      required
                  />
                </div>
                <button
                    type="submit"
                    disabled={ocupado}
                    className="self-start rounded-full bg-marca-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700 active:scale-[0.98] disabled:opacity-60"
                >
                  {ocupado ? "Enviando..." : "Enviar moedas"}
                </button>
              </div>
              <div className="md:row-span-3">
                <CartaoSaldo rotulo="Meu saldo" saldo={saldo} />
              </div>
            </form>

            {envio && (
                <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Icone nome="ok" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-emerald-900">
                      {envio.valor} moedas enviadas para {envio.aluno}
                    </p>
                    <p className="text-sm text-emerald-800">
                      {formatarDataHora(envio.dataHora)} · Saldo restante: {envio.saldoRestante} moedas
                    </p>
                  </div>
                </div>
            )}
          </section>
        </main>
      </div>
  );
}
