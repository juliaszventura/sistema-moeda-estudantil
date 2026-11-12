"use client";

import PaginaExtrato from "../../componentes/PaginaExtrato";
import { useSessaoExigida } from "../../lib/sessao";

export default function ExtratoProfessorPage() {
  const sessao = useSessaoExigida("PROFESSOR");
  if (!sessao) return null;
  return (
      <PaginaExtrato
          caminho={`/professores/${sessao.id}/extrato`}
          titulo="Extrato do professor"
          subtitulo="Saldo de moedas e envios realizados aos alunos."
          vazioTexto="Os envios de moedas aos alunos aparecerão aqui."
          acaoHref="/professor/enviar"
          acaoRotulo="Enviar moedas"
          ativo="extrato"
      />
  );
}
