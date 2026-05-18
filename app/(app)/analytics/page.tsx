"use client";

import Topbar from "@/components/Topbar";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Clock } from "lucide-react";

const metrics = [
  { label: "Taxa de Conversão", value: "24,6%", change: "+3,2%", up: true, icon: Target },
  { label: "Receita do Período", value: "R$ 87.400", change: "+18%", up: true, icon: DollarSign },
  { label: "Leads Recebidos", value: "1.432", change: "+8%", up: true, icon: Users },
  { label: "Tempo Médio de Resp.", value: "4m 32s", change: "-18%", up: true, icon: Clock },
];

const funnelData = [
  { stage: "Visitantes", count: 12430, pct: 100, color: "bg-gray-300" },
  { stage: "Leads", count: 1432, pct: 11.5, color: "bg-[#7B61FF]" },
  { stage: "Qualificados", count: 654, pct: 5.3, color: "bg-[#6C3BFF]" },
  { stage: "Propostas", count: 228, pct: 1.8, color: "bg-blue-500" },
  { stage: "Convertidos", count: 352, pct: 2.8, color: "bg-[#10B981]" },
];

const origins = [
  { label: "WhatsApp", pct: 42, color: "bg-green-500" },
  { label: "Instagram", pct: 26, color: "bg-pink-500" },
  { label: "Email", pct: 14, color: "bg-blue-500" },
  { label: "Messenger", pct: 10, color: "bg-indigo-500" },
  { label: "Outros", pct: 8, color: "bg-gray-400" },
];

const sellers = [
  { name: "Carla Mendes", deals: 28, revenue: "R$ 42.100", conv: "34%", avatar: "C" },
  { name: "Bruno Lima", deals: 22, revenue: "R$ 35.600", conv: "28%", avatar: "B" },
  { name: "Ana Paula", deals: 19, revenue: "R$ 29.800", conv: "24%", avatar: "A" },
  { name: "Diego Santos", deals: 15, revenue: "R$ 21.400", conv: "19%", avatar: "D" },
];

const avColors: Record<string, string> = {
  C: "bg-[#6C3BFF]",
  B: "bg-[#10B981]",
  A: "bg-amber-500",
  D: "bg-blue-500",
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Analytics" subtitle="Relatórios e métricas de performance" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Period selector */}
        <div className="flex items-center gap-2">
          {["Hoje", "7 dias", "30 dias", "Este mês", "Personalizado"].map((p, i) => (
            <button
              key={p}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${i === 2 ? "bg-[#6C3BFF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-[#6C3BFF]/10 rounded-lg flex items-center justify-center">
                  <m.icon size={16} className="text-[#6C3BFF]" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${m.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {m.change}
                </span>
              </div>
              <p className="text-xl font-bold text-[#111827]">{m.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Funil */}
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-5">Funil de Vendas</h3>
            <div className="space-y-4">
              {funnelData.map((stage) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-600">{stage.stage}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">{stage.pct}%</span>
                      <span className="text-sm font-bold text-[#111827]">{stage.count.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${stage.color} transition-all`} style={{ width: `${Math.max(stage.pct, 2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Origem dos leads */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-5">Origem dos Leads</h3>
            <div className="space-y-3">
              {origins.map((o) => (
                <div key={o.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{o.label}</span>
                    <span className="text-sm font-bold text-[#111827]">{o.pct}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${o.color}`} style={{ width: `${o.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance vendedores */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#111827] mb-4">Performance por Vendedor</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Vendedor</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Negócios</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Receita</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Conversão</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sellers.map((s) => (
                <tr key={s.name}>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${avColors[s.avatar]} flex items-center justify-center text-white text-xs font-bold`}>
                        {s.avatar}
                      </div>
                      <span className="text-sm font-medium text-[#111827]">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{s.deals}</td>
                  <td className="py-3 text-sm font-semibold text-[#10B981]">{s.revenue}</td>
                  <td className="py-3 text-sm text-[#111827]">{s.conv}</td>
                  <td className="py-3 w-32">
                    <div className="bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#6C3BFF]" style={{ width: s.conv }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
