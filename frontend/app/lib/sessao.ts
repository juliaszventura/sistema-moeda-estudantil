"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";

export type Perfil = "ALUNO" | "PROFESSOR" | "EMPRESA";
export type Sessao = { id: string; perfil: Perfil; nome: string };

const CHAVE = "moeda-estudantil-sessao";
const ouvintes = new Set<() => void>();

function lerBruto(): string | null {
  try {
    return window.localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  window.addEventListener("storage", ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
    window.removeEventListener("storage", ouvinte);
  };
}

function notificar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function salvarSessao(sessao: Sessao) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(sessao));
  } catch {
    return;
  }
  notificar();
}

export function encerrarSessao() {
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    return;
  }
  notificar();
}

function interpretar(bruto: string | null): Sessao | null {
  if (!bruto) return null;
  try {
    const dados = JSON.parse(bruto) as Sessao;
    if (dados && dados.id && dados.perfil && dados.nome) return dados;
  } catch {
    return null;
  }
  return null;
}

export function useSessao(): { sessao: Sessao | null; pronto: boolean } {
  const bruto = useSyncExternalStore(assinar, lerBruto, () => null);
  const pronto = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const sessao = useMemo(() => interpretar(bruto), [bruto]);
  return { sessao, pronto };
}

export function useSessaoExigida(perfil: Perfil): Sessao | null {
  const router = useRouter();
  const { sessao, pronto } = useSessao();
  const autorizado = sessao && sessao.perfil === perfil ? sessao : null;

  useEffect(() => {
    if (pronto && !autorizado) router.replace("/login");
  }, [pronto, autorizado, router]);

  return autorizado;
}

export function useSessaoLogada(): Sessao | null {
  const router = useRouter();
  const { sessao, pronto } = useSessao();

  useEffect(() => {
    if (pronto && !sessao) router.replace("/login");
  }, [pronto, sessao, router]);

  return sessao;
}

export const rotuloPerfil: Record<Perfil, string> = {
  ALUNO: "Aluno",
  PROFESSOR: "Professor",
  EMPRESA: "Empresa parceira",
};
