"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const revenueData = [
  { mes: "Jan", receita: 28400, meta: 30000, leads: 410 },
  { mes: "Fev", receita: 31200, meta: 32000, leads: 487 },
  { mes: "Mar", receita: 27800, meta: 33000, leads: 392 },
  { mes: "Abr", receita: 36900, meta: 35000, leads: 560 },
  { mes: "Mai", receita: 43480, meta: 38000, leads: 643 },
];

const weeklyLeads = [
  { dia: "Seg", whatsapp: 28, instagram: 42, email: 3, outros: 9  },
  { dia: "Ter", whatsapp: 34, instagram: 51, email: 4, outros: 7  },
  { dia: "Qua", whatsapp: 21, instagram: 38, email: 2, outros: 12 },
  { dia: "Qui", whatsapp: 45, instagram: 62, email: 5, outros: 8  },
  { dia: "Sex", whatsapp: 52, instagram: 73, email: 6, outros: 14 },
  { dia: "Sáb", whatsapp: 38, instagram: 88, email: 2, outros: 18 },
  { dia: "Dom", whatsapp: 22, instagram: 67, email: 1, outros: 11 },
];

const funnelConversion = [
  { stage: "Visualizações", count: 8240 },
  { stage: "Mensagens",     count: 1843 },
  { stage: "Consultorias",  count: 648  },
  { stage: "Propostas",     count: 203  },
  { stage: "Pedidos",       count: 87   },
];

const originPie = [
  { name: "Instagram", value: 38, color: "#E1306C" },
  { name: "WhatsApp",  value: 34, color: "#25D366" },
  { name: "TikTok",    value: 16, color: "#111827" },
  { name: "Indicação", value: 9,  color: "#6C3BFF" },
  { name: "Outros",    value: 3,  color: "#9ca3af" },
];

const sellerPerf = [
  { name: "Carla",   deals: 34, revenue: 9248,  conv: 34 },
  { name: "Ana B.",  deals: 28, revenue: 7612,  conv: 28 },
  { name: "Juliana", deals: 19, revenue: 5130,  conv: 19 },
  { name: "Beatriz", deals: 6,  revenue: 1490,  conv: 6  },
];

const kpis = [
  { label: "Taxa de Conversão", value: "14,4%",      change: "+2,8%", up: true, icon: Target },
  { label: "Receita do Mês",   value: "R$ 43.480", change: "+18%",  up: true, icon: DollarSign },
  { label: "Atendimentos",     value: "643",        change: "+11%",  up: true, icon: Users },
  { label: "Tempo Médio Resp.",value: "3m 12s",     change: "-24%",  up: true, icon: Clock },
];

const periods = ["Hoje", "7 dias", "30 dias", "Este mês", "Personalizado"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{typeof p.value === "number" && p.value > 1000 ? `R$ ${p.value.toLocaleString("pt-BR")}` : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30 dias");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Analytics" subtitle="Relatórios e métricas de performance" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Period */}
        <div className="flex items-center gap-2">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-colors",
                period === p ? "bg-[#6C3BFF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((m) => (
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

        {/* Receita + Leads */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-[#111827]">Receita vs Meta</h3>
                <p className="text-xs text-gray-400 mt-0.5">Evolução mensal</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#6C3BFF] inline-block" /> Receita</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-300 inline-block" /> Meta</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C3BFF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6C3BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="receita" name="Receita" stroke="#6C3BFF" strokeWidth={2.5} fill="url(#gradReceita)" dot={{ fill: "#6C3BFF", strokeWidth: 0, r: 4 }} />
                <Area type="monotone" dataKey="meta" name="Meta" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="5 5" fill="url(#gradMeta)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Origem dos leads */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-1">Origem dos Leads</h3>
            <p className="text-xs text-gray-400 mb-4">Distribuição por canal</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={originPie} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {originPie.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {originPie.map((o) => (
                <div key={o.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: o.color }} />
                    <span className="text-xs text-gray-600">{o.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#111827]">{o.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leads por canal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-1">Leads por Canal — Semana</h3>
            <p className="text-xs text-gray-400 mb-5">Volume diário por origem</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyLeads} barSize={8} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="whatsapp" name="WhatsApp" fill="#25D366" radius={[3, 3, 0, 0]} />
                <Bar dataKey="instagram" name="Instagram" fill="#E1306C" radius={[3, 3, 0, 0]} />
                <Bar dataKey="email" name="TikTok" fill="#111827" radius={[3, 3, 0, 0]} />
                <Bar dataKey="outros" name="Indicação" fill="#6C3BFF" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance vendedores */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-1">Performance — Vendedores</h3>
            <p className="text-xs text-gray-400 mb-5">Negócios e receita por agente</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sellerPerf} layout="vertical" barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={50} />
                <Tooltip formatter={(v) => `R$ ${Number(v).toLocaleString("pt-BR")}`} />
                <Bar dataKey="revenue" name="Receita" fill="#6C3BFF" radius={[0, 4, 4, 0]} background={{ fill: "#f3f4f6", radius: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funil */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#111827] mb-5">Funil de Conversão</h3>
          <div className="flex items-end justify-center gap-3 h-48">
            {funnelConversion.map((stage, i) => {
              const maxH = 160;
              const h = Math.round((stage.count / funnelConversion[0].count) * maxH);
              const colors = ["#d1d5db", "#7B61FF", "#6C3BFF", "#3b82f6", "#10B981"];
              return (
                <div key={stage.stage} className="flex flex-col items-center gap-2 flex-1">
                  <div className="text-xs font-bold text-[#111827]">{stage.count.toLocaleString("pt-BR")}</div>
                  <div className="w-full rounded-t-xl transition-all" style={{ height: h, backgroundColor: colors[i] }} />
                  <div className="text-[10px] text-gray-500 text-center">{stage.stage}</div>
                  {i > 0 && (
                    <div className="text-[10px] font-semibold text-[#6C3BFF]">
                      {((stage.count / funnelConversion[i - 1].count) * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
