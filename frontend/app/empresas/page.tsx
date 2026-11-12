"use client";

import { FormEvent, useState } from "react";
import Aviso from "../componentes/Aviso";
import Cabecalho from "../componentes/Cabecalho";
import Icone from "../componentes/Icone";

const API = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/empresas-parceiras`
    : "http://localhost:8080/api/empresas-parceiras";

type Campo = "razaoSocial" | "email" | "cnpj" | "login" | "senha";

const vazio: Record<Campo, string> = {
    razaoSocial: "",
    email: "",
    cnpj: "",
    login: "",
    senha: "",
};

const campos: {
    nome: Campo;
    rotulo: string;
    tipo: string;
    placeholder: string;
    largura: string;
    soCadastro?: boolean;
}[] = [
    { nome: "razaoSocial", rotulo: "Razão social", tipo: "text", placeholder: "Restaurante Exemplo LTDA", largura: "lg:col-span-2" },
    { nome: "email", rotulo: "E-mail", tipo: "email", placeholder: "contato@empresa.com", largura: "lg:col-span-2" },
    { nome: "cnpj", rotulo: "CNPJ", tipo: "text", placeholder: "00.000.000/0000-00", largura: "" },
    { nome: "login", rotulo: "Login", tipo: "text", placeholder: "nome de usuário", largura: "", soCadastro: true },
    { nome: "senha", rotulo: "Senha", tipo: "password", placeholder: "Mínimo de 6 caracteres", largura: "", soCadastro: true },
];

const estiloCampo =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-marca-400 focus:ring-4 focus:ring-marca-100";

async function mensagemDeErro(resposta: Response): Promise<string> {
    const dados = await resposta.json().catch(() => ({}));
    return dados.erro ?? `Erro ao salvar (HTTP ${resposta.status}).`;
}

function mascararCnpj(valor: string): string {
    const d = valor.replace(/\D/g, "").slice(0, 14);
    return d
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

const SEM_CONEXAO = "Não foi possível conectar ao servidor. Verifique se o back-end está iniciado.";

export default function EmpresasPage() {
    const [form, setForm] = useState(vazio);
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [ocupado, setOcupado] = useState(false);

    function cancelar() {
        setForm(vazio);
        setEditandoId(null);
        setErro("");
    }

    async function enviar(e: FormEvent) {
        e.preventDefault();
        setErro("");
        setSucesso("");
        setOcupado(true);

        const corpo = editandoId
            ? { razaoSocial: form.razaoSocial, email: form.email, cnpj: form.cnpj }
            : form;

        try {
            const resposta = await fetch(editandoId ? `${API}/${editandoId}` : API, {
                method: editandoId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo),
            });

            if (!resposta.ok) {
                setErro(await mensagemDeErro(resposta));
                return;
            }

            const mensagem = editandoId
                ? "Empresa atualizada com sucesso!"
                : "Empresa cadastrada com sucesso!";
            cancelar();
            setSucesso(mensagem);
        } catch {
            setErro(SEM_CONEXAO);
        } finally {
            setOcupado(false);
        }
    }

    return (
        <div className="flex-1">
            <Cabecalho ativo="empresas" />

            <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
                <form
                    onSubmit={enviar}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
              <Icone nome={editandoId ? "editar" : "empresa"} className="h-5 w-5" />
            </span>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {editandoId ? "Editar empresa" : "Nova empresa"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {editandoId
                                    ? "Altere os dados e salve."
                                    : "Preencha os dados para cadastrar uma empresa parceira."}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {campos
                            .filter((campo) => !(campo.soCadastro && editandoId))
                            .map((campo) => (
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
                                        type={campo.tipo}
                                        placeholder={campo.placeholder}
                                        maxLength={
                                            campo.tipo === "password" ? 72 : campo.nome === "cnpj" ? 18 : undefined
                                        }
                                        minLength={
                                            campo.tipo === "password" ? 6 : campo.nome === "cnpj" ? 18 : undefined
                                        }
                                        inputMode={campo.nome === "cnpj" ? "numeric" : undefined}
                                        value={form[campo.nome]}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                [campo.nome]:
                                                    campo.nome === "cnpj" ? mascararCnpj(e.target.value) : e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            ))}
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
                        {editandoId && (
                            <button
                                type="button"
                                onClick={cancelar}
                                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-marca-300 hover:bg-marca-50 hover:text-marca-700"
                            >
                                Cancelar edição
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={ocupado}
                            className="rounded-full bg-marca-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700 active:scale-[0.98] disabled:opacity-60"
                        >
                            {ocupado ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar empresa"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}