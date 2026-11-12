"use client";

import { FormEvent, useState } from "react";
import Icone from "./Icone";
import { api, estiloCampo } from "../lib/api";

export default function CartaoSenha({
  usuarioId,
  aoSucesso,
  aoErro,
}: {
  usuarioId: string;
  aoSucesso: (mensagem: string) => void;
  aoErro: (mensagem: string) => void;
}) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    if (nova !== confirmacao) {
      aoErro("A confirmação da nova senha não confere.");
      return;
    }
    setOcupado(true);
    try {
      await api<void>("/auth/senha", {
        method: "PUT",
        body: JSON.stringify({ usuarioId, senhaAtual: atual, novaSenha: nova }),
      });
      setAtual("");
      setNova("");
      setConfirmacao("");
      aoSucesso("Senha alterada com sucesso!");
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
            <Icone nome="editar" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Alterar senha</h2>
            <p className="text-sm text-slate-500">Informe a senha atual e escolha uma nova.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="senha-atual" className="mb-1.5 block text-sm font-medium text-slate-700">
              Senha atual
            </label>
            <input
                id="senha-atual"
                type="password"
                autoComplete="current-password"
                className={estiloCampo}
                value={atual}
                onChange={(e) => setAtual(e.target.value)}
                required
            />
          </div>
          <div>
            <label htmlFor="senha-nova" className="mb-1.5 block text-sm font-medium text-slate-700">
              Nova senha
            </label>
            <input
                id="senha-nova"
                type="password"
                autoComplete="new-password"
                minLength={6}
                maxLength={72}
                placeholder="Mínimo de 6 caracteres"
                className={estiloCampo}
                value={nova}
                onChange={(e) => setNova(e.target.value)}
                required
            />
          </div>
          <div>
            <label htmlFor="senha-confirmacao" className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirmar nova senha
            </label>
            <input
                id="senha-confirmacao"
                type="password"
                autoComplete="new-password"
                className={estiloCampo}
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                required
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
              type="submit"
              disabled={ocupado}
              className="rounded-full bg-marca-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700 active:scale-[0.98] disabled:opacity-60"
          >
            {ocupado ? "Salvando..." : "Alterar senha"}
          </button>
        </div>
      </form>
  );
}
