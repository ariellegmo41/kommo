"use client";

import Topbar from "@/components/Topbar";
import {
  MessageSquare, Users, TrendingUp, DollarSign, Clock, Target,
  ArrowUp, ArrowDown, MoreHorizontal, ShoppingBag,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const convData = [
  { hora: "8h", conversas: 12 }, { hora: "9h", conversas: 28 }, { hora: "10h", conversas: 45 },
  { hora: "11h", conversas: 38 }, { hora: "12h", conversas: 22 }, { hora: "13h", conversas: 15 },
  { hora: "14h", conversas: 52 }, { hora: "15h", conversas: 67 }, { hora: "16h", conversas: 59 },
  { hora: "17h", conversas: 43 }, { hora: "18h", conversas: 31 }, { hora: "19h", conversas: 48 },
  { hora: "20h", conversas: 36 },
];

const kpis = [
  { label: "Atendimentos Hoje",   value: "186",        change: "+22%", up: true,  icon: MessageSquare, color: "bg-[#6C3BFF]/10 text-[#6C3BFF]" },
  { label: "Novos Clientes",      value: "43",         change: "+15%", up: true,  icon: Users,         color: "bg-[#10B981]/10 text-[#10B981]" },
  { label: "Pedidos Confirmados", value: "87",         change: "+31%", up: true,  icon: ShoppingBag,   color: "bg-amber-100 text-amber-600" },
  { label: "Receita do Dia",      value: "R$ 12.480",  change: "+18%", up: true,  icon: DollarSign,    color: "bg-rose-100 text-rose-600" },
  { label: "Ticket Médio",        value: "R$ 287",     change: "+6%",  up: true,  icon: Target,        color: "bg-blue-100 text-blue-600" },
  { label: "Tempo Médio Resp.",   value: "3m 12s",     change: "-24%", up: true,  icon: Clock,         color: "bg-purple-100 text-purple-600" },
];

const pipeline = [
  { stage: "Novo Interesse",       count: 203, pct: 100, color: "bg-gray-300" },
  { stage: "Consultoria de Estilo",count: 148, pct: 73,  color: "bg-[#7B61FF]" },
  { stage: "Proposta Enviada",     count: 94,  pct: 46,  color: "bg-[#6C3BFF]" },
  { stage: "Aguardando Pagamento", count: 52,  pct: 26,  color: "bg-amber-500" },
  { stage: "Pedido Confirmado",    count: 87,  pct: 43,  color: "bg-[#10B981]" },
];

const ranking = [
  { name: "Carla Mendes",  deals: 34, revenue: "R$ 9.248", avatar: "C" },
  { name: "Ana Beatriz",   deals: 28, revenue: "R$ 7.612", avatar: "A" },
  { name: "Juliana Costa", deals: 19, revenue: "R$ 5.130", avatar: "J" },
  { name: "Beatriz Lima",  deals: 6,  revenue: "R$ 1.490", avatar: "B" },
];

const recent = [
  { text: "Ana Beatriz perguntou sobre o Vestido Midi Floral no P",          time: "1 min"  },
  { text: "Pedido confirmado — Conjunto Alfaiataria (R$ 459) · Camila R.",   time: "8 min"  },
  { text: "Nova seguidora do Instagram entrou no Inbox",                     time: "15 min" },
  { text: "Bot guia de tamanhos resolveu 12 dúvidas automaticamente",        time: "32 min" },
  { text: "Cliente VIP Fernanda Lima solicitou look para evento",            time: "1h"     },
  { text: "Campanha 'Coleção Verão 2026' atingiu 1.200 enviadas",           time: "2h"     },
];

const agenda = [
  { time: "10:00", label: "Live de moda no Instagram — Coleção Inverno",    done: true  },
  { time: "13:00", label: "Atendimento VIP — Fernanda Lima (evento especial)", done: false },
  { time: "15:30", label: "Sessão de fotos — nova coleção Outono",          done: false },
  { time: "18:00", label: "Reunião com fornecedora de tecidos premium",     done: false },
];

const avatarColors: Record<string, string> = {
  C: "bg-[#6C3BFF]", A: "bg-amber-500", J: "bg-[#10B981]", B: "bg-rose-500",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Dashboard" subtitle="Bella Modas — visão geral de hoje" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-6 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${kpi.color}`}><kpi.icon size={16} /></div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {kpi.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{kpi.change}
                </span>
              </div>
              <p className="text-xl font-bold text-[#111827]">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Conversas por hora */}
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#111827]">Atendimentos por Hora</h3>
                <p className="text-xs text-gray-400 mt-0.5">WhatsApp + Instagram + TikTok</p>
              </div>
              <span className="text-xs text-gray-400">Hoje</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
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
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} formatter={(v) => [`${v} atendimentos`, ""]} />
                <Area type="monotone" dataKey="conversas" stroke="#6C3BFF" strokeWidth={2} fill="url(#gradConv)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Agenda */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Agenda de Hoje</h3>
            <div className="space-y-3">
              {agenda.map((item) => (
                <div key={item.time} className="flex items-start gap-3">
                  <span className="text-xs text-[#6C3BFF] font-medium w-10 flex-shrink-0 mt-0.5">{item.time}</span>
                  <div className={`flex-1 text-xs ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}>{item.label}</div>
                  {!item.done && <div className="w-2 h-2 rounded-full bg-[#6C3BFF] mt-1 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline + Ranking + Atividades */}
        <div className="grid grid-cols-3 gap-4">
          {/* Funil */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">Funil de Vendas</h3>
              <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
            </div>
            <div className="space-y-3">
              {pipeline.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <div className="w-36 text-xs text-gray-500 flex-shrink-0">{stage.stage}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${stage.color} transition-all`} style={{ width: `${stage.pct}%` }} />
                  </div>
                  <div className="w-8 text-right text-sm font-semibold text-[#111827]">{stage.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Ranking — Vendedoras</h3>
            <div className="space-y-3">
              {ranking.map((v, i) => (
                <div key={v.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className={`w-7 h-7 rounded-full ${avatarColors[v.avatar]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{v.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{v.name}</p>
                    <p className="text-xs text-gray-400">{v.deals} pedidos</p>
                  </div>
                  <span className="text-sm font-semibold text-[#10B981]">{v.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Atividades */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Atividades Recentes</h3>
            <div className="space-y-3">
              {recent.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#6C3BFF] mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-snug">{item.text}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
