"use client";

import Link from "next/link";
import Cabecalho from "./componentes/Cabecalho";
import Icone, { NomeIcone } from "./componentes/Icone";
import { Perfil, useSessao } from "./lib/sessao";

type Modulo = { href: string; icone: NomeIcone; titulo: string; descricao: string };

const visitante: Modulo[] = [
  { href: "/login", icone: "usuarios", titulo: "Entrar", descricao: "Acesse como aluno, professor ou empresa parceira." },
  { href: "/alunos", icone: "aluno", titulo: "Cadastrar aluno", descricao: "Crie sua conta de aluno escolhendo a instituição de ensino e o curso." },
  { href: "/empresas", icone: "empresa", titulo: "Cadastrar empresa parceira", descricao: "Cadastre sua empresa para oferecer vantagens aos alunos." },
];

const porPerfil: Record<Perfil, Modulo[]> = {
  ALUNO: [
    { href: "/vantagens", icone: "vantagem", titulo: "Vantagens", descricao: "Veja o catálogo e troque suas moedas por produtos e descontos." },
    { href: "/extrato", icone: "extrato", titulo: "Extrato", descricao: "Acompanhe o saldo, os recebimentos e as trocas realizadas." },
  ],
  PROFESSOR: [
    { href: "/professor/enviar", icone: "moedas", titulo: "Enviar moedas", descricao: "Reconheça um aluno com moedas e informe o motivo." },
    { href: "/professor/extrato", icone: "extrato", titulo: "Extrato", descricao: "Consulte seu saldo e os envios realizados aos alunos." },
  ],
  EMPRESA: [
    { href: "/vantagens/gerenciar", icone: "vantagem", titulo: "Minhas vantagens", descricao: "Cadastre, edite e exclua as vantagens oferecidas aos alunos." },
  ],
};

export default function Inicio() {
  const { sessao } = useSessao();
  const modulos = sessao ? porPerfil[sessao.perfil] : visitante;

  return (
      <div className="flex-1">
        <Cabecalho ativo="inicio" />
        <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <div className="flex flex-col gap-3 rounded-2xl border border-marca-200 bg-gradient-to-br from-white to-marca-50 p-8 sm:p-10">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {sessao ? (
                  <>
                    Olá, <span className="text-marca-600">{sessao.nome}</span>
                  </>
              ) : (
                  <>
                    Reconheça o mérito, <span className="text-marca-600">troque por vantagens</span>
                  </>
              )}
            </h1>
            <p className="w-full text-base text-slate-600">
              Professores distribuem moedas aos alunos como reconhecimento, e os alunos as trocam por produtos e descontos oferecidos por empresas parceiras.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {modulos.map((modulo) => (
                <Link
                    key={modulo.href}
                    href={modulo.href}
                    className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-marca-300 hover:shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                    <Icone nome={modulo.icone} className="h-6 w-6" />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-lg font-semibold text-slate-900">{modulo.titulo}</span>
                    <span className="text-sm text-slate-500">{modulo.descricao}</span>
                    <span className="mt-2 flex items-center gap-1 text-sm font-medium text-marca-700">
                      Abrir
                      <Icone nome="seta" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
            ))}
          </div>
        </main>
      </div>
  );
}
