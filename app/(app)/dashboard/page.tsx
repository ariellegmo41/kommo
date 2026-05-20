"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare, DollarSign, Clock, Target, ArrowUp, ArrowDown,
  ShoppingBag, Package, AlertTriangle, Bot, UserPlus, Zap,
  BarChart3, Calendar, CheckSquare, Square, ChevronRight,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

const convData = [
  { hora: "8h", v: 12 }, { hora: "9h", v: 28 }, { hora: "10h", v: 45 },
  { hora: "11h", v: 38 }, { hora: "12h", v: 22 }, { hora: "13h", v: 15 },
  { hora: "14h", v: 52 }, { hora: "15h", v: 67 }, { hora: "16h", v: 59 },
  { hora: "17h", v: 43 }, { hora: "18h", v: 31 }, { hora: "19h", v: 48 },
  { hora: "20h", v: 36 },
];

const kpis = [
  { label: "Receita do Dia",    value: "R$ 12.480", goal: "Meta R$ 15k", pct: 83, change: "+18%", up: true,  icon: DollarSign,    ic: "text-[#6C3BFF]",  bg: "bg-[#6C3BFF]/10" },
  { label: "Pedidos",           value: "87",         goal: "Meta 100",   pct: 87, change: "+31%", up: true,  icon: ShoppingBag,   ic: "text-amber-600",  bg: "bg-amber-100"    },
  { label: "Novos Clientes",    value: "43",         goal: "Meta 50",    pct: 86, change: "+15%", up: true,  icon: UserPlus,      ic: "text-[#10B981]",  bg: "bg-[#10B981]/10" },
  { label: "Atendimentos",      value: "186",        goal: "Meta 200",   pct: 93, change: "+22%", up: true,  icon: MessageSquare, ic: "text-blue-600",   bg: "bg-blue-100"     },
  { label: "Ticket Médio",      value: "R$ 287",     goal: "Meta R$ 300",pct: 96, change: "+6%",  up: true,  icon: Target,        ic: "text-rose-600",   bg: "bg-rose-100"     },
  { label: "Tempo de Resposta", value: "3m 12s",     goal: "Meta < 5min",pct: 100,change: "-24%", up: true,  icon: Clock,         ic: "text-purple-600", bg: "bg-purple-100"   },
];

const alerts = [
  { icon: Package,       label: "2 itens sem estoque",             href: "/estoque",  chip: "bg-red-50 border-red-200 text-red-700"       },
  { icon: MessageSquare, label: "4 leads sem resposta há +24h",    href: "/inbox",    chip: "bg-amber-50 border-amber-200 text-amber-700"  },
  { icon: ShoppingBag,   label: "Live ao vivo agora — 156 vendo",  href: "/ao-vivo",  chip: "bg-rose-50 border-rose-200 text-rose-700"    },
];

const missionInit = [
  { id: 1, text: "Confirmar atendimento VIP — Fernanda Lima (13h)" },
  { id: 2, text: "Enviar proposta de look para Rafaela Santos"       },
  { id: 3, text: "Publicar Reels da Coleção Verão 2026"              },
  { id: 4, text: "Solicitar reposição — Calça Wide Leg e Cropped"   },
];

const quickActions = [
  { icon: MessageSquare, label: "Atendimento", href: "/inbox",     color: "bg-[#6C3BFF]/10 text-[#6C3BFF] hover:bg-[#6C3BFF]/20" },
  { icon: UserPlus,      label: "Nova Lead",   href: "/leads",     color: "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20" },
  { icon: ShoppingBag,   label: "Lives",       href: "/lives",     color: "bg-rose-100 text-rose-600 hover:bg-rose-200"          },
  { icon: Package,       label: "Estoque",     href: "/estoque",   color: "bg-red-100 text-red-500 hover:bg-red-200"             },
  { icon: BarChart3,     label: "Analytics",   href: "/analytics", color: "bg-blue-100 text-blue-600 hover:bg-blue-200"          },
  { icon: Calendar,      label: "Agenda",      href: "/calendario",color: "bg-purple-100 text-purple-600 hover:bg-purple-200"    },
];

const feed = [
  { icon: MessageSquare, bg: "bg-[#6C3BFF]/10", ic: "text-[#6C3BFF]",  title: "Fernanda Lima — WhatsApp",          sub: "Look para evento especial · aguardando", time: "agora",  live: true  },
  { icon: ShoppingBag,   bg: "bg-[#10B981]/10", ic: "text-[#10B981]",  title: "Pedido #1091 confirmado",            sub: "Camila R. · Conjunto Alfaiataria · R$ 459",time: "4min",  live: false },
  { icon: Bot,           bg: "bg-amber-100",    ic: "text-amber-600",  title: "Salesbot resolveu 7 dúvidas",        sub: "Guia de tamanhos · sem intervenção",     time: "12min", live: false },
  { icon: UserPlus,      bg: "bg-blue-100",     ic: "text-blue-600",   title: "Nova lead — Instagram Direct",        sub: "Priscila T. · look formatura",           time: "18min", live: false },
  { icon: Package,       bg: "bg-red-100",      ic: "text-red-500",    title: "Alerta — estoque crítico",           sub: "Calça Wide Leg Bege · sem unidades",     time: "25min", live: false },
  { icon: Zap,           bg: "bg-purple-100",   ic: "text-purple-600", title: "Campanha VIP Night disparada",       sub: "312 clientes · WhatsApp",                time: "41min", live: false },
  { icon: DollarSign,    bg: "bg-rose-100",     ic: "text-rose-600",   title: "PIX recebido — Vestido Longo",       sub: "Beatriz S. · R$ 389",                    time: "1h",    live: false },
  { icon: MessageSquare, bg: "bg-[#6C3BFF]/10", ic: "text-[#6C3BFF]",  title: "Larissa Mendes — troca de tamanho", sub: "Blusa Cropped Tricô · M para G",         time: "1h 20m",live: false },
];

const pipeline = [
  { stage: "Novo Interesse",        count: 203, pct: 100, color: "bg-gray-300"    },
  { stage: "Consultoria de Estilo", count: 148, pct: 73,  color: "bg-[#7B61FF]"  },
  { stage: "Proposta Enviada",      count: 94,  pct: 46,  color: "bg-[#6C3BFF]"  },
  { stage: "Aguardando Pagamento",  count: 52,  pct: 26,  color: "bg-amber-500"  },
  { stage: "Pedido Confirmado",     count: 87,  pct: 43,  color: "bg-[#10B981]"  },
];

const ranking = [
  { name: "Carla Mendes",  deals: 34, revenue: "R$ 9.248", pct: 100, avatar: "C", avatarBg: "bg-[#6C3BFF]" },
  { name: "Ana Beatriz",   deals: 28, revenue: "R$ 7.612", pct: 82,  avatar: "A", avatarBg: "bg-amber-500" },
  { name: "Juliana Costa", deals: 19, revenue: "R$ 5.130", pct: 55,  avatar: "J", avatarBg: "bg-[#10B981]" },
  { name: "Beatriz Lima",  deals: 6,  revenue: "R$ 1.490", pct: 16,  avatar: "B", avatarBg: "bg-rose-500"  },
];

const agenda = [
  { time: "10:00", label: "Live de moda — Instagram",            done: true  },
  { time: "13:00", label: "Atendimento VIP — Fernanda Lima",      done: false },
  { time: "15:30", label: "Sessão de fotos — coleção Outono",     done: false },
  { time: "18:00", label: "Reunião com fornecedora de tecidos",   done: false },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [done, setDone] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setDone((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Dashboard" subtitle="Bella Modas · Superlive — visão geral em tempo real" />

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* Alert chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <AlertTriangle size={13} className="text-amber-500" />
            Alertas:
          </span>
          {alerts.map((a) => (
            <button
              key={a.label}
              onClick={() => router.push(a.href)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-opacity hover:opacity-80",
                a.chip
              )}
            >
              <a.icon size={11} />
              {a.label}
              <ChevronRight size={10} />
            </button>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-6 gap-3">
          {kpis.map((k) => {
            const bar = k.pct >= 80 ? "bg-[#10B981]" : k.pct >= 50 ? "bg-amber-400" : "bg-red-400";
            return (
              <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className={cn("p-1.5 rounded-lg", k.bg)}>
                    <k.icon size={14} className={k.ic} />
                  </div>
                  <span className={cn("flex items-center gap-0.5 text-[10px] font-semibold", k.up ? "text-[#10B981]" : "text-red-500")}>
                    {k.up ? <ArrowUp size={9} /> : <ArrowDown size={9} />}{k.change}
                  </span>
                </div>
                <p className="text-xl font-bold text-[#111827] mt-1">{k.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{k.label}</p>
                <div className="mt-2.5 space-y-1">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={cn("h-1.5 rounded-full transition-all", bar)} style={{ width: `${k.pct}%` }} />
                  </div>
                  <p className="text-[9px] text-gray-400">{k.goal} · {k.pct}%</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Missão do Dia + Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#111827]">Missão do Dia</h3>
              <span className="text-xs text-gray-400">
                {done.size}/{missionInit.length} concluídas
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {missionInit.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggle(m.id)}
                  className={cn(
                    "flex items-start gap-2.5 text-left p-3 rounded-xl border transition-colors",
                    done.has(m.id)
                      ? "bg-[#10B981]/5 border-[#10B981]/20"
                      : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                  )}
                >
                  {done.has(m.id)
                    ? <CheckSquare size={15} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                    : <Square size={15} className="text-gray-300 flex-shrink-0 mt-0.5" />
                  }
                  <span className={cn("text-xs leading-snug", done.has(m.id) ? "line-through text-gray-400" : "text-gray-700")}>
                    {m.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-3">Ações Rápidas</h3>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((q) => (
                <button
                  key={q.label}
                  onClick={() => router.push(q.href)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-colors",
                    q.color
                  )}
                >
                  <q.icon size={17} />
                  <span className="text-[10px] font-semibold leading-tight text-center">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart + Live Feed */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#111827]">Atendimentos por Hora</h3>
                <p className="text-xs text-gray-400 mt-0.5">WhatsApp + Instagram + TikTok</p>
              </div>
              <span className="text-xs text-gray-400">Hoje · pico às 15h</span>
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
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
                  formatter={(v) => [`${v} atendimentos`, ""]}
                />
                <Area type="monotone" dataKey="v" stroke="#6C3BFF" strokeWidth={2} fill="url(#gradConv)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Live activity feed */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#111827]">Feed ao Vivo</h3>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                online
              </span>
            </div>
            <div className="space-y-2.5 overflow-y-auto flex-1">
              {feed.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", f.bg)}>
                    <f.icon size={13} className={f.ic} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-medium leading-tight", f.live ? "text-[#6C3BFF]" : "text-[#111827]")}>
                      {f.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-snug truncate">{f.sub}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 flex-shrink-0 mt-0.5">{f.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funil + Ranking + Agenda */}
        <div className="grid grid-cols-3 gap-3">
          {/* Funil */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Funil de Vendas</h3>
            <div className="space-y-3">
              {pipeline.map((s) => (
                <div key={s.stage} className="flex items-center gap-3">
                  <div className="w-32 text-[11px] text-gray-500 flex-shrink-0 leading-tight">{s.stage}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className={cn("h-2 rounded-full transition-all", s.color)} style={{ width: `${s.pct}%` }} />
                  </div>
                  <div className="w-8 text-right text-sm font-bold text-[#111827]">{s.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Ranking — Vendedoras</h3>
            <div className="space-y-4">
              {ranking.map((v, i) => (
                <div key={v.name}>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-xs font-bold text-gray-300 w-4 flex-shrink-0">{i + 1}</span>
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0", v.avatarBg)}>
                      {v.avatar}
                    </div>
                    <p className="flex-1 text-xs font-semibold text-[#111827] truncate">{v.name}</p>
                    <span className="text-xs font-bold text-[#10B981]">{v.revenue}</span>
                  </div>
                  <div className="ml-8 bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#6C3BFF]" style={{ width: `${v.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Agenda de Hoje</h3>
            <div className="space-y-3">
              {agenda.map((item) => (
                <div key={item.time} className="flex items-start gap-3">
                  <span className={cn("text-xs font-semibold w-12 flex-shrink-0 mt-0.5", item.done ? "text-gray-300" : "text-[#6C3BFF]")}>
                    {item.time}
                  </span>
                  <div className={cn("flex-1 text-xs leading-snug", item.done ? "line-through text-gray-400" : "text-gray-700")}>
                    {item.label}
                  </div>
                  {!item.done && <div className="w-2 h-2 rounded-full bg-[#6C3BFF] mt-1.5 flex-shrink-0" />}
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/calendario")}
              className="mt-4 w-full text-xs text-[#6C3BFF] font-medium flex items-center justify-center gap-1 hover:underline"
            >
              Ver calendário completo <ChevronRight size={12} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
