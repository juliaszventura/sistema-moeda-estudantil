"use client";

import { FormEvent, useEffect, useState } from "react";
import CampoLeitura from "../componentes/CampoLeitura";
import Icone from "../componentes/Icone";
import { api, estiloCampo } from "../lib/api";
import { Sessao, salvarSessao } from "../lib/sessao";

type Opcao = { id: string; nome: string };
type Aluno = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  login: string;
  instituicaoId: string;
  cursoId: string;
};

function formatarCpf(cpf: string): string {
  const d = cpf.replace(/\D/g, "");
  return d.length === 11 ? `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}` : cpf;
}

function FormAluno({
  inicial,
  aoSucesso,
  aoErro,
}: {
  inicial: Aluno;
  aoSucesso: (mensagem: string) => void;
  aoErro: (mensagem: string) => void;
}) {
  const [nome, setNome] = useState(inicial.nome);
  const [email, setEmail] = useState(inicial.email);
  const [rg, setRg] = useState(inicial.rg);
  const [endereco, setEndereco] = useState(inicial.endereco);
  const [instituicaoId, setInstituicaoId] = useState(inicial.instituicaoId);
  const [cursoId, setCursoId] = useState(inicial.cursoId);
  const [instituicoes, setInstituicoes] = useState<Opcao[]>([]);
  const [cursos, setCursos] = useState<Opcao[]>([]);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    let ativo = true;
    api<Opcao[]>("/instituicoes")
        .then((dados) => {
          if (ativo) setInstituicoes(dados);
        })
        .catch((e: Error) => {
          if (ativo) aoErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, [aoErro]);

  useEffect(() => {
    if (!instituicaoId) return;
    let ativo = true;
    api<Opcao[]>(`/instituicoes/${instituicaoId}/cursos`)
        .then((dados) => {
          if (ativo) setCursos(dados);
        })
        .catch((e: Error) => {
          if (ativo) aoErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, [instituicaoId, aoErro]);

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    setOcupado(true);
    try {
      const atualizado = await api<Aluno>(`/alunos/${inicial.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nome,
          email,
          cpf: inicial.cpf.replace(/\D/g, ""),
          rg,
          endereco,
          login: inicial.login,
          senha: "",
          instituicaoId,
          cursoId,
        }),
      });
      salvarSessao({ id: atualizado.id, perfil: "ALUNO", nome: atualizado.nome });
      aoSucesso("Dados atualizados com sucesso!");
    } catch (e) {
      aoErro((e as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  const cursosDisponiveis = instituicaoId ? cursos : [];

  return (
      <form onSubmit={(e) => void salvar(e)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
            <Icone nome="aluno" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Dados do aluno</h2>
            <p className="text-sm text-slate-500">CPF e login não podem ser alterados.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-slate-700">
              Nome completo
            </label>
            <input id="nome" className={estiloCampo} value={nome} onChange={(e) => setNome(e.target.value)} required />
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
          <CampoLeitura rotulo="CPF" valor={formatarCpf(inicial.cpf)} />
          <div>
            <label htmlFor="rg" className="mb-1.5 block text-sm font-medium text-slate-700">
              RG
            </label>
            <input id="rg" className={estiloCampo} value={rg} onChange={(e) => setRg(e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="endereco" className="mb-1.5 block text-sm font-medium text-slate-700">
              Endereço
            </label>
            <input
                id="endereco"
                className={estiloCampo}
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
            />
          </div>
          <div>
            <label htmlFor="instituicao" className="mb-1.5 block text-sm font-medium text-slate-700">
              Instituição de ensino
            </label>
            <select
                id="instituicao"
                className={estiloCampo}
                value={instituicaoId}
                onChange={(e) => {
                  setInstituicaoId(e.target.value);
                  setCursoId("");
                }}
                required
            >
              <option value="">Selecione uma instituição</option>
              {instituicoes.map((instituicao) => (
                  <option key={instituicao.id} value={instituicao.id}>
                    {instituicao.nome}
                  </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="curso" className="mb-1.5 block text-sm font-medium text-slate-700">
              Curso
            </label>
            <select
                id="curso"
                className={estiloCampo}
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                disabled={!instituicaoId}
                required
            >
              <option value="">Selecione um curso</option>
              {cursosDisponiveis.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
              ))}
            </select>
          </div>
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

export default function PerfilAluno({
  sessao,
  aoSucesso,
  aoErro,
}: {
  sessao: Sessao;
  aoSucesso: (mensagem: string) => void;
  aoErro: (mensagem: string) => void;
}) {
  const [aluno, setAluno] = useState<Aluno | null>(null);

  useEffect(() => {
    let ativo = true;
    api<Aluno>(`/alunos/${sessao.id}`)
        .then((dados) => {
          if (ativo) setAluno(dados);
        })
        .catch((e: Error) => {
          if (ativo) aoErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, [sessao.id, aoErro]);

  if (!aluno) return null;
  return <FormAluno inicial={aluno} aoSucesso={aoSucesso} aoErro={aoErro} />;
}
