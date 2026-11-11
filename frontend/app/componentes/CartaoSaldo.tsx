import Icone from "./Icone";

export default function CartaoSaldo({ rotulo, saldo }: { rotulo: string; saldo: number | null }) {
    return (
        <div className="flex h-full flex-col justify-between gap-2 rounded-2xl border border-marca-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-600">{rotulo}</p>
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ouro-100 text-ouro-700 ring-1 ring-ouro-500/40">
                    <Icone nome="moeda" className="h-5 w-5" />
                </span>
                <p className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold leading-none text-marca-600">{saldo === null ? "—" : saldo}</span>
                    <span className="text-sm font-medium text-slate-500">moedas</span>
                </p>
            </div>
        </div>
    );
}
