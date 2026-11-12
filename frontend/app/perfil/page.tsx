"use client";

import { useCallback, useState } from "react";
import Cabecalho from "../componentes/Cabecalho";
import CartaoSenha from "../componentes/CartaoSenha";
import Icone from "../componentes/Icone";
import Toast from "../componentes/Toast";
import { rotuloPerfil, useSessaoLogada } from "../lib/sessao";
import PerfilAluno from "./PerfilAluno";
import PerfilEmpresa from "./PerfilEmpresa";
import PerfilProfessor from "./PerfilProfessor";

export default function PerfilPage() {
  const sessao = useSessaoLogada();
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const falhar = useCallback((mensagem: string) => {
    setSucesso("");
    setErro(mensagem);
  }, []);

  const concluir = useCallback((mensagem: string) => {
    setErro("");
    setSucesso(mensagem);
  }, []);

  if (!sessao) return null;

  return (
      <div className="flex-1">
        <Cabecalho ativo="perfil" />
        <Toast tipo="erro" mensagem={erro} onFechar={() => setErro("")} />
        <Toast tipo="sucesso" mensagem={sucesso} onFechar={() => setSucesso("")} />
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
              <Icone nome="usuarios" className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Meu perfil</h1>
              <p className="text-sm text-slate-500">{rotuloPerfil[sessao.perfil]}</p>
            </div>
          </div>

          {sessao.perfil === "ALUNO" && <PerfilAluno sessao={sessao} aoSucesso={concluir} aoErro={falhar} />}
          {sessao.perfil === "EMPRESA" && <PerfilEmpresa sessao={sessao} aoSucesso={concluir} aoErro={falhar} />}
          {sessao.perfil === "PROFESSOR" && <PerfilProfessor sessao={sessao} aoErro={falhar} />}

          <CartaoSenha usuarioId={sessao.id} aoSucesso={concluir} aoErro={falhar} />
        </main>
      </div>
  );
}
