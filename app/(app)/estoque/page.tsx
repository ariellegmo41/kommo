"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import { AlertTriangle, ArrowUp, ArrowDown, Package, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Sizes = { PP: number; P: number; M: number; G: number; GG: number };

interface StockItem {
  id: string;
  name: string;
  category: string;
  color: string;
  sizes: Sizes;
  minStock: number;
}

const stockItems: StockItem[] = [
  { id: "1", name: "Vestido Midi Floral",    category: "Vestidos",  color: "bg-rose-100",   sizes: { PP: 2, P: 4, M: 7, G: 3, GG: 2 }, minStock: 3 },
  { id: "2", name: "Conjunto Alfaiataria",   category: "Conjuntos", color: "bg-stone-200",  sizes: { PP: 1, P: 3, M: 4, G: 2, GG: 2 }, minStock: 2 },
  { id: "3", name: "Blusa Cropped Tricô",   category: "Blusas",    color: "bg-amber-100",  sizes: { PP: 0, P: 1, M: 1, G: 1, GG: 0 }, minStock: 3 },
  { id: "4", name: "Calça Wide Leg Bege",   category: "Calças",    color: "bg-yellow-50",  sizes: { PP: 0, P: 0, M: 0, G: 0, GG: 0 }, minStock: 2 },
  { id: "5", name: "Vestido Longo Festa",   category: "Vestidos",  color: "bg-purple-100", sizes: { PP: 1, P: 2, M: 3, G: 1, GG: 0 }, minStock: 2 },
  { id: "6", name: "Conjunto Jogger Premium",category: "Conjuntos", color: "bg-slate-200",  sizes: { PP: 3, P: 4, M: 4, G: 3, GG: 1 }, minStock: 2 },
  { id: "7", name: "Blazer Oversized",      category: "Blazers",   color: "bg-gray-200",   sizes: { PP: 2, P: 2, M: 3, G: 1, GG: 1 }, minStock: 2 },
  { id: "8", name: "Saia Midi Plissada",    category: "Saias",     color: "bg-teal-100",   sizes: { PP: 1, P: 2, M: 2, G: 1, GG: 0 }, minStock: 2 },
];

interface Movement {
  id: string;
  product: string;
  type: "entrada" | "saida";
  qty: number;
  size: string;
  reason: string;
  user: string;
  time: string;
}

const movements: Movement[] = [
  { id: "1", product: "Vestido Midi Floral",    type: "saida",   qty: 1, size: "P",  reason: "Pedido #1085",         user: "Carla",   time: "Hoje 10:30" },
  { id: "2", product: "Blazer Oversized",       type: "saida",   qty: 1, size: "M",  reason: "Pedido #1083",         user: "Ana B.",  time: "Hoje 09:15" },
  { id: "3", product: "Blusa Cropped Tricô",   type: "entrada",  qty: 5, size: "M",  reason: "Reposição fornecedor", user: "Carla",   time: "Ontem 16:00" },
  { id: "4", product: "Calça Wide Leg Bege",   type: "saida",   qty: 2, size: "G",  reason: "Pedido #1080",         user: "Juliana", time: "Ontem 14:22" },
  { id: "5", product: "Conjunto Alfaiataria",  type: "entrada", qty: 4, size: "M",  reason: "Reposição fornecedor", user: "Carla",   time: "18/05 11:00" },
  { id: "6", product: "Vestido Longo Festa",   type: "saida",   qty: 1, size: "PP", reason: "Pedido #1079",         user: "Beatriz", time: "18/05 09:45" },
];

function SizeCell({ qty, min }: { qty: number; min: number }) {
  if (qty === 0)      return <td className="px-3 py-3 text-center"><span className="inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-bold bg-red-100 text-red-500">0</span></td>;
  if (qty < min)      return <td className="px-3 py-3 text-center"><span className="inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-bold bg-amber-100 text-amber-700">{qty}</span></td>;
  return <td className="px-3 py-3 text-center"><span className="inline-flex items-center justify-center w-9 h-7 rounded-lg text-xs font-bold bg-green-100 text-green-700">{qty}</span></td>;
}

function totalStock(sizes: Sizes) {
  return Object.values(sizes).reduce((s, v) => s + v, 0);
}

function stockStatus(item: StockItem): "ok" | "baixo" | "critico" | "zerado" {
  const total = totalStock(item.sizes);
  const hasZeroSize = Object.values(item.sizes).some((v) => v === 0);
  if (total === 0) return "zerado";
  if (hasZeroSize || total <= item.minStock * 2) return "critico";
  if (total <= item.minStock * 4) return "baixo";
  return "ok";
}

const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
  ok:      { label: "OK",           color: "text-green-700",  bg: "bg-green-100" },
  baixo:   { label: "Baixo",        color: "text-amber-700",  bg: "bg-amber-100" },
  critico: { label: "Crítico",      color: "text-red-600",    bg: "bg-red-100" },
  zerado:  { label: "Sem estoque",  color: "text-red-700",    bg: "bg-red-200" },
};

export default function EstoquePage() {
  const [tab, setTab] = useState<"estoque" | "movimentacoes">("estoque");

  const alertItems = stockItems.filter((i) => stockStatus(i) === "critico" || stockStatus(i) === "zerado");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Estoque"
        subtitle="Controle de produtos por tamanho — Bella Modas"
        action={{ label: "Registrar Entrada", onClick: () => {} }}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Alert banner */}
        {alertItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800">
                {alertItems.length} produto{alertItems.length > 1 ? "s" : ""} precisam de reposição
              </p>
              <p className="text-xs text-amber-600 mt-0.5 truncate">
                {alertItems.map((i) => i.name).join(" · ")}
              </p>
            </div>
            <button className="text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
              Solicitar Reposição
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total em Estoque",  value: stockItems.reduce((s, i) => s + totalStock(i.sizes), 0), icon: Package,      color: "bg-[#6C3BFF]/10 text-[#6C3BFF]" },
            { label: "Produtos Ativos",   value: stockItems.filter((i) => totalStock(i.sizes) > 0).length, icon: Package,    color: "bg-green-100 text-[#10B981]" },
            { label: "Estoque Crítico",   value: alertItems.length,                                         icon: AlertTriangle, color: "bg-amber-100 text-amber-600" },
            { label: "Sem Estoque",       value: stockItems.filter((i) => totalStock(i.sizes) === 0).length, icon: TrendingDown, color: "bg-red-100 text-red-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#111827]">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="font-medium text-gray-600">Legenda:</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-green-100 inline-block" /> Adequado</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-amber-100 inline-block" /> Abaixo do mínimo</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-red-100 inline-block" /> Zerado</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {(["estoque", "movimentacoes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2 text-sm rounded-lg font-medium transition-colors capitalize",
                tab === t ? "bg-white text-[#6C3BFF] shadow-sm" : "text-gray-500"
              )}
            >
              {t === "estoque" ? "Estoque por Tamanho" : "Movimentações"}
            </button>
          ))}
        </div>

        {tab === "estoque" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Produto</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Categoria</th>
                  {(["PP", "P", "M", "G", "GG"] as const).map((s) => (
                    <th key={s} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3">{s}</th>
                  ))}
                  <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-3">Total</th>
                  <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stockItems.map((item) => {
                  const total = totalStock(item.sizes);
                  const st = stockStatus(item);
                  const sc = statusLabel[st];
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg ${item.color} flex-shrink-0`} />
                          <span className="text-sm font-medium text-[#111827]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{item.category}</td>
                      <SizeCell qty={item.sizes.PP} min={item.minStock} />
                      <SizeCell qty={item.sizes.P}  min={item.minStock} />
                      <SizeCell qty={item.sizes.M}  min={item.minStock} />
                      <SizeCell qty={item.sizes.G}  min={item.minStock} />
                      <SizeCell qty={item.sizes.GG} min={item.minStock} />
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-bold text-[#111827]">{total}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "movimentacoes" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Produto", "Tipo", "Tam.", "Qtde.", "Motivo", "Usuário", "Data"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#111827]">{m.product}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "flex items-center gap-1 text-xs font-semibold w-fit px-2 py-0.5 rounded-full",
                        m.type === "entrada" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      )}>
                        {m.type === "entrada" ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                        {m.type === "entrada" ? "Entrada" : "Saída"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-600">{m.size}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#111827]">{m.qty}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.reason}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{m.user}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{m.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
