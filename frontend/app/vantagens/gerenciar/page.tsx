"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Cabecalho from "../../componentes/Cabecalho";
import Icone from "../../componentes/Icone";
import Toast from "../../componentes/Toast";
import { api, estiloCampo } from "../../lib/api";

type EmpresaResumo = { id: string; razaoSocial: string };
type Vantagem = {
  id: string;
  nome: string;
  descricao: string;
  custoMoedas: number;
  foto: string;
};
type Form = { nome: string; descricao: string; custoMoedas: string; foto: string };

const vazio: Form = { nome: "", descricao: "", custoMoedas: "", foto: "" };
const LADO_MAXIMO = 900;

function reduzirImagem(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    leitor.onload = () => {
      const imagem = new window.Image();
      imagem.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      imagem.onload = () => {
        const escala = Math.min(1, LADO_MAXIMO / Math.max(imagem.width, imagem.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(imagem.width * escala);
        canvas.height = Math.round(imagem.height * escala);
        const contexto = canvas.getContext("2d");
        if (!contexto) {
          reject(new Error("Não foi possível processar a imagem."));
          return;
        }
        contexto.drawImage(imagem, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      imagem.src = String(leitor.result);
    };
    leitor.readAsDataURL(arquivo);
  });
}

export default function GerenciarVantagensPage() {
  const [empresas, setEmpresas] = useState<EmpresaResumo[]>([]);
  const [empresaId, setEmpresaId] = useState("");
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [form, setForm] = useState<Form>(vazio);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;
    api<EmpresaResumo[]>("/empresas-parceiras")
        .then((dados) => {
          if (ativo) setEmpresas(dados);
        })
        .catch((e: Error) => {
          if (ativo) setErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!empresaId) return;
    let ativo = true;
    api<Vantagem[]>(`/empresas-parceiras/${empresaId}/vantagens`)
        .then((dados) => {
          if (ativo) setVantagens(dados);
        })
        .catch((e: Error) => {
          if (ativo) setErro(e.message);
        });
    return () => {
      ativo = false;
    };
  }, [empresaId, versao]);

  const visiveis = empresaId ? vantagens : [];

  function focarCampo(id: string) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(id)?.focus({ preventScroll: true });
  }

  function cancelar() {
    setForm(vazio);
    setEditandoId(null);
    setErro("");
  }

  function escolherEmpresa(id: string) {
    setEmpresaId(id);
    setVantagens([]);
    cancelar();
    setSucesso("");
  }

  async function escolherFoto(e: ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    setErro("");
    try {
      setForm((atual) => ({ ...atual, foto: "" }));
      const foto = await reduzirImagem(arquivo);
      setForm((atual) => ({ ...atual, foto }));
    } catch (erroFoto) {
      setErro((erroFoto as Error).message);
    }
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setOcupado(true);
    try {
      await api<Vantagem>(editandoId ? `/vantagens/${editandoId}` : `/empresas-parceiras/${empresaId}/vantagens`, {
        method: editandoId ? "PUT" : "POST",
        body: JSON.stringify({
          nome: form.nome,
          descricao: form.descricao,
          custoMoedas: Number(form.custoMoedas),
          foto: form.foto,
        }),
      });
      const mensagem = editandoId ? "Vantagem atualizada com sucesso!" : "Vantagem cadastrada com sucesso!";
      cancelar();
      setSucesso(mensagem);
      setVersao((v) => v + 1);
    } catch (erroApi) {
      setErro((erroApi as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  function editar(vantagem: Vantagem) {
    setEditandoId(vantagem.id);
    setErro("");
    setSucesso("");
    setForm({
      nome: vantagem.nome,
      descricao: vantagem.descricao,
      custoMoedas: String(vantagem.custoMoedas),
      foto: vantagem.foto,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluir(vantagem: Vantagem) {
    if (!window.confirm(`Excluir a vantagem ${vantagem.nome}?`)) return;
    setErro("");
    setSucesso("");
    setOcupado(true);
    try {
      await api<void>(`/vantagens/${vantagem.id}`, { method: "DELETE" });
      if (editandoId === vantagem.id) cancelar();
      setSucesso("Vantagem excluída com sucesso!");
      setVersao((v) => v + 1);
    } catch (erroApi) {
      setErro((erroApi as Error).message);
    } finally {
      setOcupado(false);
    }
  }

  return (
      <div className="flex-1">
        <Cabecalho ativo="vantagens" />
        <Toast tipo="erro" mensagem={erro} onFechar={() => setErro("")} />
        <Toast tipo="sucesso" mensagem={sucesso} onFechar={() => setSucesso("")} />
        <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
          <form onSubmit={enviar} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
              <Icone nome={editandoId ? "editar" : "vantagem"} className="h-5 w-5" />
            </span>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {editandoId ? "Editar vantagem" : "Nova vantagem"}
                </h1>
                <p className="text-sm text-slate-500">Escolha a empresa e cadastre o produto com foto e custo em moedas.</p>
              </div>
              <Link
                  href="/vantagens"
                  className="ml-auto rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-marca-300 hover:bg-marca-50 hover:text-marca-700"
              >
                Ver catálogo
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label htmlFor="empresa" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Empresa parceira
                </label>
                <select
                    id="empresa"
                    className={estiloCampo}
                    value={empresaId}
                    onChange={(e) => escolherEmpresa(e.target.value)}
                    disabled={Boolean(editandoId)}
                    required
                >
                  <option value="">Selecione a empresa</option>
                  {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.razaoSocial}
                      </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nome da vantagem
                </label>
                <input
                    id="nome"
                    className={estiloCampo}
                    placeholder="Desconto de 20% no almoço"
                    minLength={3}
                    maxLength={120}
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    required
                />
              </div>
              <div className="lg:col-span-3">
                <label htmlFor="descricao" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Descrição
                </label>
                <input
                    id="descricao"
                    className={estiloCampo}
                    placeholder="Válido de segunda a sexta no restaurante da universidade"
                    maxLength={500}
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    required
                />
              </div>
              <div>
                <label htmlFor="custo" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Custo (moedas)
                </label>
                <input
                    id="custo"
                    className={estiloCampo}
                    type="number"
                    min={1}
                    max={100000}
                    placeholder="50"
                    value={form.custoMoedas}
                    onChange={(e) => setForm({ ...form, custoMoedas: e.target.value })}
                    required
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <label htmlFor="foto" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Foto do produto
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <input
                      id="foto"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => void escolherFoto(e)}
                      className="text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-marca-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-marca-700 hover:file:bg-marca-100"
                  />
                  {form.foto ? (
                      <Image
                          src={form.foto}
                          alt="Pré-visualização da foto"
                          width={120}
                          height={80}
                          unoptimized
                          className="h-20 w-28 rounded-xl border border-slate-200 object-cover"
                      />
                  ) : (
                      <span className="flex items-center gap-2 text-sm text-slate-400">
                    <Icone nome="foto" className="h-4 w-4" />
                    Nenhuma foto selecionada
                  </span>
                  )}
                </div>
              </div>
            </div>

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
                  disabled={ocupado || !form.foto}
                  className="rounded-full bg-marca-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700 active:scale-[0.98] disabled:opacity-60"
              >
                {ocupado ? "Salvando..." : editandoId ? "Salvar alterações" : "Cadastrar vantagem"}
              </button>
            </div>
          </form>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Vantagens da empresa</h2>
              <span className="rounded-full bg-marca-50 px-3 py-1 text-xs font-semibold text-marca-700">
              {visiveis.length}
            </span>
            </div>
            {visiveis.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-marca-50 text-marca-600">
                    <Icone nome={empresaId ? "vantagem" : "empresa"} className="h-6 w-6" />
                  </span>
                  <p className="font-medium text-slate-700">
                    {empresaId ? "Nenhuma vantagem cadastrada" : "Nenhuma empresa selecionada"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {empresaId
                        ? "Esta empresa ainda não cadastrou vantagens."
                        : empresas.length === 0
                            ? "Cadastre uma empresa parceira antes de criar vantagens."
                            : "Selecione uma empresa para ver as vantagens."}
                  </p>
                  {empresaId ? (
                      <button
                          type="button"
                          onClick={() => focarCampo("nome")}
                          className="mt-3 inline-flex items-center gap-2 rounded-full bg-marca-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700"
                      >
                        <Icone nome="mais" className="h-4 w-4" />
                        Cadastrar a primeira vantagem
                      </button>
                  ) : empresas.length === 0 ? (
                      <Link
                          href="/empresas"
                          className="mt-3 inline-flex items-center gap-2 rounded-full bg-marca-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700"
                      >
                        <Icone nome="mais" className="h-4 w-4" />
                        Cadastrar uma empresa parceira
                      </Link>
                  ) : (
                      <button
                          type="button"
                          onClick={() => focarCampo("empresa")}
                          className="mt-3 inline-flex items-center gap-2 rounded-full bg-marca-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-marca-700"
                      >
                        Escolher uma empresa
                        <Icone nome="seta" className="h-4 w-4" />
                      </button>
                  )}
                </div>
            ) : (
                <ul className="grid gap-4 md:grid-cols-2">
                  {visiveis.map((vantagem) => (
                      <li
                          key={vantagem.id}
                          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-marca-300 hover:shadow-md"
                      >
                        <Image
                            src={vantagem.foto}
                            alt={vantagem.nome}
                            width={96}
                            height={96}
                            unoptimized
                            className="h-24 w-24 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900">{vantagem.nome}</p>
                          <p className="line-clamp-2 text-sm text-slate-500">{vantagem.descricao}</p>
                          <span className="mt-1.5 inline-block rounded-md bg-ouro-100 px-2 py-0.5 text-xs font-semibold text-ouro-700">
                      {vantagem.custoMoedas} moedas
                    </span>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                              type="button"
                              aria-label={`Editar ${vantagem.nome}`}
                              title="Editar"
                              onClick={() => editar(vantagem)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-marca-300 hover:bg-marca-50 hover:text-marca-700"
                          >
                            <Icone nome="editar" className="h-4 w-4" />
                          </button>
                          <button
                              type="button"
                              aria-label={`Excluir ${vantagem.nome}`}
                              title="Excluir"
                              disabled={ocupado}
                              onClick={() => void excluir(vantagem)}
                              className="rounded-lg border border-slate-200 p-2 text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:opacity-60"
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
