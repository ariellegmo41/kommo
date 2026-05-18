"use client";

import Topbar from "@/components/Topbar";
import {
  MessageSquare, Users, TrendingUp, DollarSign, Clock, Target, ArrowUp, ArrowDown, MoreHorizontal,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const convData = [
  { hora: "8h", conversas: 18 }, { hora: "9h", conversas: 34 }, { hora: "10h", conversas: 52 },
  { hora: "11h", conversas: 41 }, { hora: "12h", conversas: 28 }, { hora: "13h", conversas: 19 },
  { hora: "14h", conversas: 45 }, { hora: "15h", conversas: 61 }, { hora: "16h", conversas: 48 },
  { hora: "17h", conversas: 37 }, { hora: "18h", conversas: 22 },
];

const kpis = [
  {
    label: "Conversas Ativas",
    value: "248",
    change: "+12%",
    up: true,
    icon: MessageSquare,
    color: "bg-[#6C3BFF]/10 text-[#6C3BFF]",
  },
  {
    label: "Leads Recebidos",
    value: "1.432",
    change: "+8%",
    up: true,
    icon: Users,
    color: "bg-[#10B981]/10 text-[#10B981]",
  },
  {
    label: "Taxa de Conversão",
    value: "24,6%",
    change: "+3,2%",
    up: true,
    icon: Target,
    color: "bg-[#7B61FF]/10 text-[#7B61FF]",
  },
  {
    label: "Receita do Mês",
    value: "R$ 87.400",
    change: "-2%",
    up: false,
    icon: DollarSign,
    color: "bg-amber-100 text-amber-600",
  },
  {
    label: "Tempo Médio Resp.",
    value: "4m 32s",
    change: "-18%",
    up: true,
    icon: Clock,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Leads Convertidos",
    value: "352",
    change: "+21%",
    up: true,
    icon: TrendingUp,
    color: "bg-rose-100 text-rose-600",
  },
];

const pipeline = [
  { stage: "Novo Lead", count: 312, pct: 100, color: "bg-gray-300" },
  { stage: "Qualificando", count: 218, pct: 70, color: "bg-[#7B61FF]" },
  { stage: "Proposta", count: 142, pct: 46, color: "bg-[#6C3BFF]" },
  { stage: "Negociação", count: 86, pct: 28, color: "bg-blue-500" },
  { stage: "Fechado", count: 52, pct: 17, color: "bg-[#10B981]" },
];

const ranking = [
  { name: "Carla Mendes", deals: 28, revenue: "R$ 42.100", avatar: "C" },
  { name: "Bruno Lima", deals: 22, revenue: "R$ 35.600", avatar: "B" },
  { name: "Ana Paula", deals: 19, revenue: "R$ 29.800", avatar: "A" },
  { name: "Diego Santos", deals: 15, revenue: "R$ 21.400", avatar: "D" },
  { name: "Fernanda Costa", deals: 12, revenue: "R$ 18.500", avatar: "F" },
];

const recent = [
  { type: "msg", text: "Nova mensagem de João Silva no WhatsApp", time: "2 min" },
  { type: "lead", text: "Lead qualificado: Maria Fernanda (Instagram)", time: "15 min" },
  { type: "deal", text: "Venda fechada: R$ 4.200 — Ana Costa", time: "38 min" },
  { type: "bot", text: "Salesbot qualificou 3 leads automaticamente", time: "1h" },
  { type: "task", text: "Tarefa vencendo: Follow-up com Empresa XYZ", time: "2h" },
];

const agenda = [
  { time: "09:00", label: "Reunião com time de vendas", done: true },
  { time: "11:00", label: "Demo para Cliente ABC", done: false },
  { time: "14:30", label: "Follow-up Proposta — Empresa Beta", done: false },
  { time: "16:00", label: "Review semanal de pipeline", done: false },
];

const colors: Record<string, string> = {
  C: "bg-[#6C3BFF]",
  B: "bg-[#10B981]",
  A: "bg-amber-500",
  D: "bg-blue-500",
  F: "bg-rose-500",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Dashboard" subtitle="Visão geral do seu negócio" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-6 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <kpi.icon size={16} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {kpi.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-xl font-bold text-[#111827]">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Conversas por hora */}
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">Conversas por Hora</h3>
              <span className="text-xs text-gray-400">Hoje</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={convData}>
                <defs>
                  <linearGradient id="gradConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C3BFF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6C3BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                <Area type="monotone" dataKey="conversas" stroke="#6C3BFF" strokeWidth={2} fill="url(#gradConv)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Funil de vendas */}
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">Funil Comercial</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {pipeline.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <div className="w-28 text-sm text-gray-500 flex-shrink-0">{stage.stage}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stage.color} transition-all`}
                      style={{ width: `${stage.pct}%` }}
                    />
                  </div>
                  <div className="w-10 text-right text-sm font-semibold text-[#111827]">{stage.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda diária */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Agenda de Hoje</h3>
            <div className="space-y-3">
              {agenda.map((item) => (
                <div key={item.time} className="flex items-start gap-3">
                  <span className="text-xs text-[#6C3BFF] font-medium w-10 flex-shrink-0 mt-0.5">{item.time}</span>
                  <div className={`flex-1 text-sm ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {item.label}
                  </div>
                  {!item.done && (
                    <div className="w-2 h-2 rounded-full bg-[#6C3BFF] mt-1.5 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Ranking */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Ranking de Vendedores</h3>
            <div className="space-y-3">
              {ranking.map((v, i) => (
                <div key={v.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className={`w-7 h-7 rounded-full ${colors[v.avatar]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {v.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{v.name}</p>
                    <p className="text-xs text-gray-400">{v.deals} negócios</p>
                  </div>
                  <span className="text-sm font-semibold text-[#10B981]">{v.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Atividades recentes */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Atividades Recentes</h3>
            <div className="space-y-3">
              {recent.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#6C3BFF] mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">{item.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
