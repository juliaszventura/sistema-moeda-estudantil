"use client";
import { FormEvent, useEffect, useState } from "react";
import Aviso from "../componentes/Aviso";
import Cabecalho from "../componentes/Cabecalho";
import Icone from "../componentes/Icone";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
  instituicaoNome: string;
  cursoId: string;
  cursoNome: string;
};
type Form = {
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  login: string;
  senha: string;
  instituicaoId: string;
  cursoId: string;
};
type CampoTexto = "nome" | "email" | "cpf" | "rg" | "endereco" | "login" | "senha";

const vazio: Form = {
  nome: "",
  email: "",
  cpf: "",
  rg: "",
  endereco: "",
  login: "",
  senha: "",
  instituicaoId: "",
  cursoId: "",
};

const estiloCampo =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-marca-400 focus:ring-4 focus:ring-marca-100 disabled:bg-slate-50 disabled:text-slate-400";

function mascararCpf(valor: string): string {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Verifique se o back-end está iniciado.");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
        err.erro || err.mensagem || err.message || err.detail || `Erro HTTP ${res.status}`,
    );
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [instituicoes, setInstituicoes] = useState<Opcao[]>([]);
  const [cursos, setCursos] = useState<Opcao[]>([]);
  const [form, setForm] = useState<Form>(vazio);
  const [editId, setEditId] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [busy, setBusy] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [versao, setVersao] = useState(0);

  const carregar = () => setVersao((v) => v + 1);

  useEffect(() => {
    let ativo = true;
    Promise.all([api<Aluno[]>("/alunos"), api<Opcao[]>("/instituicoes")])
        .then(([a, i]) => {
          if (!ativo) return;
          setAlunos(a);
          setInstituicoes(i);
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
  }, [versao]);

  useEffect(() => {
    if (!form.instituicaoId) return;
    let ativo = true;
    api<Opcao[]>(`/instituicoes/${form.instituicaoId}/cursos`)
        .then((c) => {
          if (ativo) setCursos(c);
        })
        .catch((e: Error) => {
          if (ativo) setErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, [form.instituicaoId]);

  const cursosDisponiveis = form.instituicaoId ? cursos : [];

  const mudar = (campo: keyof Form, valor: string) => {
    setForm((f) =>
        campo === "instituicaoId"
            ? { ...f, instituicaoId: valor, cursoId: "" }
            : { ...f, [campo]: valor },
    );
    setErro("");
    setSucesso("");
  };

  const cancelar = () => {
    setEditId(null);
    setForm(vazio);
    setErro("");
    setSucesso("");
  };

  const editar = (a: Aluno) => {
    setEditId(a.id);
    setForm({
      nome: a.nome,
      email: a.email,
      cpf: mascararCpf(a.cpf),
      rg: a.rg,
      endereco: a.endereco,
      login: a.login,
      senha: "",
      instituicaoId: a.instituicaoId,
      cursoId: a.cursoId,
    });
    setErro("");
    setSucesso("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErro("");
    setSucesso("");
    try {
      const payload = { ...form, cpf: form.cpf.replace(/\D/g, "") };
      await api<Aluno>(editId ? `/alunos/${editId}` : "/alunos", {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      const msg = editId ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!";
      cancelar();
      setSucesso(msg);
      carregar();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function excluir(a: Aluno) {
    if (!window.confirm(`Excluir o aluno ${a.nome}?`)) return;
    setBusy(true);
    setErro("");
    setSucesso("");
    try {
      await api<void>(`/alunos/${a.id}`, { method: "DELETE" });
      if (editId === a.id) cancelar();
      setSucesso("Aluno excluído com sucesso!");
      carregar();
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const campos: {
    nome: CampoTexto;
    rotulo: string;
    placeholder: string;
    largura: string;
  }[] = [
    { nome: "nome", rotulo: "Nome completo", placeholder: "Nome do aluno", largura: "lg:col-span-2" },
    { nome: "email", rotulo: "E-mail", placeholder: "aluno@email.com", largura: "lg:col-span-2" },
    { nome: "cpf", rotulo: "CPF", placeholder: "000.000.000-00", largura: "" },
    { nome: "rg", rotulo: "RG", placeholder: "Número do RG", largura: "" },
    { nome: "endereco", rotulo: "Endereço", placeholder: "Rua, número, bairro e cidade", largura: "lg:col-span-2" },
    { nome: "login", rotulo: "Login", placeholder: "nome de usuário", largura: "" },
    {
      nome: "senha",
      rotulo: editId ? "Nova senha (opcional)" : "Senha",
      placeholder: "Mínimo de 6 caracteres",
      largura: "",
    },
  ];

  return (
      <div className="flex-1">
        <Cabecalho ativo="alunos" />

        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <form
              onSubmit={salvar}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
              <Icone nome={editId ? "editar" : "aluno"} className="h-5 w-5" />
            </span>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editId ? "Editar aluno" : "Novo aluno"}
                </h2>
                <p className="text-sm text-slate-500">
                  Preencha os dados para {editId ? "atualizar o cadastro." : "cadastrar um aluno."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {campos.map((campo) => (
                  <div key={campo.nome} className={campo.largura}>
                    <label
                        htmlFor={campo.nome}
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                      {campo.rotulo}
                    </label>
                    <input
                        id={campo.nome}
                        className={estiloCampo}
                        type={
                          campo.nome === "senha"
                              ? "password"
                              : campo.nome === "email"
                                  ? "email"
                                  : "text"
                        }
                        placeholder={campo.placeholder}
                        maxLength={campo.nome === "cpf" ? 14 : campo.nome === "senha" ? 72 : undefined}
                        minLength={
                          campo.nome === "cpf"
                              ? 14
                              : campo.nome === "senha" && !editId
                                  ? 6
                                  : undefined
                        }
                        inputMode={campo.nome === "cpf" ? "numeric" : undefined}
                        required={campo.nome !== "senha" || !editId}
                        value={form[campo.nome]}
                        onChange={(e) =>
                            mudar(campo.nome, campo.nome === "cpf" ? mascararCpf(e.target.value) : e.target.value)
                        }
                    />
                  </div>
              ))}

              <div className="lg:col-span-2">
                <label htmlFor="instituicao" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Instituição de ensino
                </label>
                <select
                    id="instituicao"
                    required
                    className={estiloCampo}
                    value={form.instituicaoId}
                    onChange={(e) => mudar("instituicaoId", e.target.value)}
                >
                  <option value="">Selecione uma instituição</option>
                  {instituicoes.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nome}
                      </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="curso" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Curso
                </label>
                <select
                    id="curso"
                    required
                    disabled={!form.instituicaoId}
                    className={estiloCampo}
                    value={form.cursoId}
                    onChange={(e) => mudar("cursoId", e.target.value)}
                >
                  <option value="">Selecione um curso</option>
                  {cursosDisponiveis.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                  ))}
                </select>
              </div>
            </div>

            {erro && (
                <div className="mt-5">
                  <Aviso tipo="erro">{erro}</Aviso>
                </div>
            )}
            {sucesso && (
                <div className="mt-5">
                  <Aviso tipo="sucesso">{sucesso}</Aviso>
                </div>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {editId && (
                  <button
                      type="button"
                      onClick={cancelar}
                      className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-marca-300 hover:bg-marca-50 hover:text-marca-700"
                  >
                    Cancelar edição
                  </button>
              )}
              <button
                  disabled={busy}
                  type="submit"
                  className="rounded-full bg-marca-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700 active:scale-[0.98] disabled:opacity-60"
              >
                {busy ? "Salvando..." : editId ? "Salvar alterações" : "Cadastrar aluno"}
              </button>
            </div>
          </form>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Alunos cadastrados</h2>
              <span className="rounded-full bg-marca-50 px-3 py-1 text-xs font-semibold text-marca-700">
              {alunos.length}
            </span>
            </div>

            {carregando ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                  Carregando alunos...
                </div>
            ) : alunos.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                <Icone nome="usuarios" className="h-6 w-6" />
              </span>
                  <p className="font-medium text-slate-700">Nenhum aluno cadastrado</p>
                  <p className="text-sm text-slate-500">Use o formulário acima para cadastrar o primeiro.</p>
                  <button
                      type="button"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        document.querySelector<HTMLInputElement>("main form input")?.focus({ preventScroll: true });
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-marca-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700"
                  >
                    <Icone nome="mais" className="h-4 w-4" />
                    Cadastrar o primeiro aluno
                  </button>
                </div>
            ) : (
                <ul className="grid gap-4 md:grid-cols-2">
                  {alunos.map((a) => (
                      <li
                          key={a.id}
                          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-marca-300 hover:shadow-md"
                      >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-marca-50 text-sm font-bold text-marca-600">
                    {a.nome.slice(0, 2).toUpperCase()}
                  </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900">{a.nome}</p>
                          <p className="truncate text-sm text-slate-500">{a.email}</p>
                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                            <Icone nome="instituicao" className="h-3.5 w-3.5 shrink-0 text-marca-600" />
                            <span className="truncate">
                        {a.instituicaoNome} • {a.cursoNome}
                      </span>
                          </p>
                          <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                        CPF {mascararCpf(a.cpf)}
                      </span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                        @{a.login}
                      </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                              aria-label={`Editar ${a.nome}`}
                              title="Editar"
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-marca-300 hover:bg-marca-50 hover:text-marca-700"
                              onClick={() => editar(a)}
                          >
                            <Icone nome="editar" className="h-4 w-4" />
                          </button>
                          <button
                              disabled={busy}
                              aria-label={`Excluir ${a.nome}`}
                              title="Excluir"
                              className="rounded-lg border border-slate-200 p-2 text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-60"
                              onClick={() => void excluir(a)}
                          >
                            <Icone nome="excluir" className="h-4 w-4" />
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