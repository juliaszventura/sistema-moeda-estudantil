"use client";

import { useEffect, useState } from "react";
import CampoLeitura from "../componentes/CampoLeitura";
import { api } from "../lib/api";
import { Sessao } from "../lib/sessao";

type Professor = { nome: string; departamento: string; instituicao: string };

export default function PerfilProfessor({ sessao, aoErro }: { sessao: Sessao; aoErro: (mensagem: string) => void }) {
  const [professor, setProfessor] = useState<Professor | null>(null);

  useEffect(() => {
    let ativo = true;
    api<Professor>(`/professores/${sessao.id}`)
        .then((dados) => {
          if (ativo) setProfessor(dados);
        })
        .catch((e: Error) => {
          if (ativo) aoErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, [sessao.id, aoErro]);

  return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">Dados do professor</h2>
        <p className="mb-5 text-sm text-slate-500">Estes dados são enviados pela instituição e não podem ser editados aqui.</p>
        <div className="grid gap-4 md:grid-cols-3">
          <CampoLeitura rotulo="Nome" valor={professor?.nome ?? ""} />
          <CampoLeitura rotulo="Departamento" valor={professor?.departamento ?? ""} />
          <CampoLeitura rotulo="Instituição" valor={professor?.instituicao ?? ""} />
        </div>
      </section>
  );
}
