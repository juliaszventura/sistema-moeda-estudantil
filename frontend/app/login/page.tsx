"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Cabecalho from "../componentes/Cabecalho";
import Icone from "../componentes/Icone";
import Toast from "../componentes/Toast";
import { api, estiloCampo } from "../lib/api";
import { Perfil, salvarSessao } from "../lib/sessao";

type Autenticado = { id: string; perfil: Perfil; nome: string };

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function entrar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    setOcupado(true);
    try {
      const resposta = await api<Autenticado>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ login, senha }),
      });
      salvarSessao(resposta);
      router.push("/");
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  return (
      <div className="flex-1">
        <Cabecalho ativo="login" />
        <Toast tipo="erro" mensagem={erro} onFechar={() => setErro("")} />
        <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
          <form
              onSubmit={(e) => void entrar(e)}
              className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                <Icone nome="usuarios" className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Entrar</h1>
                <p className="text-sm text-slate-500">Aluno, professor ou empresa parceira.</p>
              </div>
            </div>
            <div>
              <label htmlFor="login" className="mb-1.5 block text-sm font-medium text-slate-700">
                Login
              </label>
              <input
                  id="login"
                  className={estiloCampo}
                  autoComplete="username"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
              />
            </div>
            <div>
              <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <input
                  id="senha"
                  type="password"
                  className={estiloCampo}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
              />
            </div>
            <button
                type="submit"
                disabled={ocupado}
                className="rounded-full bg-marca-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700 active:scale-[0.98] disabled:opacity-60"
            >
              {ocupado ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500">
            Ainda não tem conta?{" "}
            <Link href="/alunos" className="font-medium text-marca-700 hover:underline">
              Cadastre-se como aluno
            </Link>{" "}
            ou{" "}
            <Link href="/empresas" className="font-medium text-marca-700 hover:underline">
              empresa parceira
            </Link>
            .
          </p>
        </main>
      </div>
  );
}
