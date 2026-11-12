"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icone from "./Icone";
import { encerrarSessao, Perfil, rotuloPerfil, useSessao } from "../lib/sessao";

type LinkMenu = { href: string; rotulo: string; chave: string };

const visitante: LinkMenu[] = [
    { href: "/", rotulo: "Início", chave: "inicio" },
    { href: "/alunos", rotulo: "Cadastrar aluno", chave: "alunos" },
    { href: "/empresas", rotulo: "Cadastrar empresa", chave: "empresas" },
];

const porPerfil: Record<Perfil, LinkMenu[]> = {
    ALUNO: [
        { href: "/", rotulo: "Início", chave: "inicio" },
        { href: "/vantagens", rotulo: "Vantagens", chave: "vantagens" },
        { href: "/extrato", rotulo: "Extrato", chave: "extrato" },
    ],
    PROFESSOR: [
        { href: "/", rotulo: "Início", chave: "inicio" },
        { href: "/professor/enviar", rotulo: "Enviar moedas", chave: "enviar" },
        { href: "/professor/extrato", rotulo: "Extrato", chave: "extrato" },
    ],
    EMPRESA: [
        { href: "/", rotulo: "Início", chave: "inicio" },
        { href: "/vantagens/gerenciar", rotulo: "Minhas vantagens", chave: "gerenciar" },
    ],
};

export default function Cabecalho({ ativo }: { ativo: string }) {
    const router = useRouter();
    const { sessao } = useSessao();
    const links = sessao ? porPerfil[sessao.perfil] : visitante;

    function sair() {
        encerrarSessao();
        router.push("/login");
    }

    return (
        <header className="border-b border-slate-100 bg-white">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 py-4">
                <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-600 text-white shadow-sm">
            <Icone nome="moedas" className="h-5 w-5" />
          </span>
                    <span className="text-base font-bold text-slate-900">Moeda Estudantil</span>
                </Link>
                <nav className="ml-auto flex flex-wrap items-center gap-1 text-sm font-medium">
                    {links.map((link) => (
                        <Link
                            key={link.chave}
                            href={link.href}
                            className={
                                link.chave === ativo
                                    ? "rounded-lg bg-marca-50 px-3 py-1.5 text-marca-700"
                                    : "rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-50 hover:text-marca-700"
                            }
                        >
                            {link.rotulo}
                        </Link>
                    ))}
                    {sessao ? (
                        <>
                            <span className="ml-2 hidden flex-col items-end leading-tight sm:flex">
                                <span className="max-w-40 truncate text-sm font-semibold text-slate-900">{sessao.nome}</span>
                                <span className="text-xs text-slate-500">{rotuloPerfil[sessao.perfil]}</span>
                            </span>
                            <button
                                type="button"
                                onClick={sair}
                                className="ml-2 rounded-full border border-slate-200 px-4 py-1.5 text-slate-700 transition hover:border-marca-300 hover:bg-marca-50 hover:text-marca-700"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className={
                                ativo === "login"
                                    ? "ml-2 rounded-full bg-marca-700 px-4 py-1.5 text-white"
                                    : "ml-2 rounded-full bg-marca-600 px-4 py-1.5 text-white transition hover:bg-marca-700"
                            }
                        >
                            Entrar
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
