import { estiloCampo } from "../lib/api";

export default function CampoLeitura({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">{rotulo}</label>
        <input className={estiloCampo} value={valor} disabled readOnly />
      </div>
  );
}
