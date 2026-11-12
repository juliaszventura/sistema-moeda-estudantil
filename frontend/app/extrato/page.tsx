"use client";

import PaginaExtrato from "../componentes/PaginaExtrato";
import { useSessaoExigida } from "../lib/sessao";

export default function ExtratoPage() {
  const sessao = useSessaoExigida("ALUNO");
  if (!sessao) return null;
  return (
      <PaginaExtrato
          caminho={`/alunos/${sessao.id}/extrato`}
          titulo="Meu extrato"
          subtitulo="Saldo de moedas, recebimentos e trocas."
          vazioTexto="As moedas recebidas e as trocas feitas aparecerão aqui."
          acaoHref="/vantagens"
          acaoRotulo="Ver catálogo de vantagens"
          ativo="extrato"
      />
  );
}
