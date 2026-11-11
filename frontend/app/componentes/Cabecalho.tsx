import Link from "next/link";
import Icone from "./Icone";

const links = [
    { href: "/", rotulo: "Início", chave: "inicio" },
    { href: "/alunos", rotulo: "Alunos", chave: "alunos" },
    { href: "/empresas", rotulo: "Empresas", chave: "empresas" },
    { href: "/vantagens", rotulo: "Vantagens", chave: "vantagens" },
    { href: "/extrato", rotulo: "Extrato", chave: "extrato" },
];

export default function Cabecalho({ ativo }: { ativo: string }) {
    return (
        <header className="border-b border-slate-100 bg-white">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
                <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-600 text-white shadow-sm">
            <Icone nome="moedas" className="h-5 w-5" />
          </span>
                    <span className="text-base font-bold text-slate-900">Moeda Estudantil</span>
                </Link>
                <nav className="ml-auto flex gap-1 text-sm font-medium">
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
                </nav>
            </div>
        </header>
    );
}