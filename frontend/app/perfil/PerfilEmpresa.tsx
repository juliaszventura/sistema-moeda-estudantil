"use client";

import { FormEvent, useEffect, useState } from "react";
import CampoLeitura from "../componentes/CampoLeitura";
import Icone from "../componentes/Icone";
import { api, estiloCampo } from "../lib/api";
import { Sessao, salvarSessao } from "../lib/sessao";

type Empresa = { id: string; razaoSocial: string; email: string; cnpj: string; login: string };

function FormEmpresa({
  inicial,
  aoSucesso,
  aoErro,
}: {
  inicial: Empresa;
  aoSucesso: (mensagem: string) => void;
  aoErro: (mensagem: string) => void;
}) {
  const [razaoSocial, setRazaoSocial] = useState(inicial.razaoSocial);
  const [email, setEmail] = useState(inicial.email);
  const [ocupado, setOcupado] = useState(false);

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    setOcupado(true);
    try {
      const atualizada = await api<Empresa>(`/empresas-parceiras/${inicial.id}`, {
        method: "PUT",
        body: JSON.stringify({ razaoSocial, email, cnpj: inicial.cnpj }),
      });
      salvarSessao({ id: atualizada.id, perfil: "EMPRESA", nome: atualizada.razaoSocial });
      aoSucesso("Dados atualizados com sucesso!");
    } catch (e) {
      aoErro((e as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  return (
      <form onSubmit={(e) => void salvar(e)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
            <Icone nome="empresa" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Dados da empresa</h2>
            <p className="text-sm text-slate-500">CNPJ e login não podem ser alterados.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="razao" className="mb-1.5 block text-sm font-medium text-slate-700">
              Razão social
            </label>
            <input
                id="razao"
                className={estiloCampo}
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
                id="email"
                type="email"
                className={estiloCampo}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <CampoLeitura rotulo="CNPJ" valor={inicial.cnpj} />
          <CampoLeitura rotulo="Login" valor={inicial.login} />
        </div>
        <div className="mt-6 flex justify-end">
          <button
              type="submit"
              disabled={ocupado}
              className="rounded-full bg-marca-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700 active:scale-[0.98] disabled:opacity-60"
          >
            {ocupado ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
  );
}

export default function PerfilEmpresa({
  sessao,
  aoSucesso,
  aoErro,
}: {
  sessao: Sessao;
  aoSucesso: (mensagem: string) => void;
  aoErro: (mensagem: string) => void;
}) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);

  useEffect(() => {
    let ativo = true;
    api<Empresa>(`/empresas-parceiras/${sessao.id}`)
        .then((dados) => {
          if (ativo) setEmpresa(dados);
        })
        .catch((e: Error) => {
          if (ativo) aoErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, [sessao.id, aoErro]);

  if (!empresa) return null;
  return <FormEmpresa inicial={empresa} aoSucesso={aoSucesso} aoErro={aoErro} />;
}
