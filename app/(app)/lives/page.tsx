"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import {
  Video, Plus, Calendar, Clock, ShoppingBag,
  CheckCircle2, Play, ChevronRight, Users, MoreHorizontal,
  DollarSign, BarChart3, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type LiveStatus = "ao-vivo" | "encerrada" | "planejada";

interface LiveEvent {
  id: string;
  name: string;
  status: LiveStatus;
  date: string;
  time: string;
  duration?: string;
  channels: string[];
  products: number;
  orders?: number;
  revenue?: number;
  carts?: number;
  conversion?: number;
  viewers?: number;
  checklistDone?: number;
  checklistTotal?: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialLives: LiveEvent[] = [
  {
    id: "1", name: "Queima de Estoque — Moda Feminina", status: "ao-vivo",
    date: "Hoje", time: "19:00", duration: "23 min",
    channels: ["Instagram", "TikTok"],
    products: 24, orders: 18, revenue: 3420, carts: 23, viewers: 156,
  },
  {
    id: "2", name: "Lançamento Coleção Verão 2026", status: "encerrada",
    date: "17/05/2026", time: "20:00", duration: "1h 45min",
    channels: ["Instagram"],
    products: 45, orders: 47, revenue: 8940, conversion: 68,
  },
  {
    id: "3", name: "VIP Night — Clientes Especiais", status: "encerrada",
    date: "10/05/2026", time: "19:30", duration: "1h 20min",
    channels: ["WhatsApp", "Instagram"],
    products: 32, orders: 31, revenue: 6280, conversion: 74,
  },
  {
    id: "4", name: "VIP Night — Clientes Especiais", status: "planejada",
    date: "25/05/2026", time: "19:30",
    channels: ["WhatsApp", "Instagram"],
    products: 35, checklistDone: 6, checklistTotal: 9,
  },
  {
    id: "5", name: "Blitz de Acessórios", status: "planejada",
    date: "28/05/2026", time: "20:00",
    channels: ["TikTok"],
    products: 12, checklistDone: 3, checklistTotal: 9,
  },
];

const checklist = [
  "Produtos cadastrados e com código",
  "Estoque conferido por variação",
  "WhatsApp conectado e testado",
  "Mensagens automáticas ativadas",
  "Página da loja ativa",
  "Operador(a) definido(a)",
  "Roteiro da live pronto",
  "Política de reserva configurada",
  "Internet e cenário testados",
];

const channelColors: Record<string, string> = {
  Instagram: "bg-pink-100 text-pink-700",
  TikTok:    "bg-slate-100 text-slate-700",
  WhatsApp:  "bg-green-100 text-green-700",
  YouTube:   "bg-red-100 text-red-700",
  Facebook:  "bg-blue-100 text-blue-700",
};

const channelOptions = ["Instagram", "TikTok", "WhatsApp", "YouTube", "Facebook"];

// ─── Checklist modal ──────────────────────────────────────────────────────────

function ChecklistModal({ live, onClose }: { live: LiveEvent; onClose: () => void }) {
  const [done, setDone] = useState<Set<number>>(
    new Set(Array.from({ length: live.checklistDone ?? 0 }, (_, i) => i))
  );
  const toggle = (i: number) =>
    setDone((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[#111827]">Checklist Pré-Live</h2>
            <p className="text-xs text-gray-400 mt-0.5">{live.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[#6C3BFF]">{done.size}/{checklist.length}</p>
            <p className="text-[10px] text-gray-400">concluídos</p>
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
          <div
            className="h-2 rounded-full bg-[#6C3BFF] transition-all"
            style={{ width: `${(done.size / checklist.length) * 100}%` }}
          />
        </div>

        <div className="space-y-2 mb-5">
          {checklist.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors",
                done.has(i) ? "bg-[#10B981]/5 border-[#10B981]/20" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
              )}
            >
              <CheckCircle2 size={16} className={done.has(i) ? "text-[#10B981]" : "text-gray-300"} />
              <span className={cn("text-sm", done.has(i) ? "line-through text-gray-400" : "text-gray-700")}>
                {item}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
            Fechar
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#6C3BFF] text-white text-sm font-semibold hover:bg-[#5a2fd6] transition-colors">
            Salvar progresso
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Live Modal ───────────────────────────────────────────────────────────

function NewLiveModal({ onClose, onAdd }: { onClose: () => void; onAdd: (live: LiveEvent) => void }) {
  const [name, setName]         = useState("");
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("19:00");
  const [channels, setChannels] = useState<string[]>(["Instagram"]);
  const [products, setProducts] = useState("20");
  const [saved, setSaved]       = useState(false);

  function toggleChannel(c: string) {
    setChannels((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function submit() {
    if (!name.trim() || !date) return;
    onAdd({
      id: String(Date.now()),
      name: name.trim(),
      status: "planejada",
      date,
      time,
      channels,
      products: Number(products) || 20,
      checklistDone: 0,
      checklistTotal: 9,
    });
    setSaved(true);
    setTimeout(onClose, 1100);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[500px] p-6 z-10">
        {saved ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <CheckCircle2 size={40} className="text-[#10B981]" />
            <p className="font-semibold text-[#111827]">Live criada com sucesso!</p>
            <p className="text-xs text-gray-400">Lembre-se de preparar o checklist antes da live.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-[#111827] text-base">Criar Nova Live</h2>
                <p className="text-xs text-gray-400 mt-0.5">Configure os detalhes da transmissão</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nome da Live</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Queima de Estoque — Verão 2026"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Horário</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Canais</label>
                <div className="flex gap-2 flex-wrap">
                  {channelOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => toggleChannel(c)}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-xl font-medium border transition-colors",
                        channels.includes(c)
                          ? "bg-[#6C3BFF] border-[#6C3BFF] text-white"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Nº de produtos planejados</label>
                <input
                  type="number"
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={!name.trim() || !date || channels.length === 0}
                className="flex-1 py-2.5 bg-[#6C3BFF] text-white rounded-xl text-sm font-semibold hover:bg-[#5a2fd6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Criar Live
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LivesPage() {
  const router = useRouter();
  const [liveList, setLiveList]       = useState<LiveEvent[]>(initialLives);
  const [checklistLive, setChecklistLive] = useState<LiveEvent | null>(null);
  const [showNewLive, setShowNewLive] = useState(false);
  const [openMenu, setOpenMenu]       = useState<string | null>(null);

  const totalRevenue  = liveList.filter((l) => l.revenue).reduce((s, l) => s + (l.revenue ?? 0), 0);
  const totalOrders   = liveList.filter((l) => l.orders).reduce((s, l) => s + (l.orders ?? 0), 0);
  const encerradas    = liveList.filter((l) => l.status === "encerrada");
  const avgConversion = encerradas.length
    ? Math.round(encerradas.reduce((s, l) => s + (l.conversion ?? 70), 0) / encerradas.length)
    : 0;
  const liveNow = liveList.find((l) => l.status === "ao-vivo");

  function removeLive(id: string) {
    setLiveList((prev) => prev.filter((l) => l.id !== id));
    setOpenMenu(null);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Lives"
        subtitle={`${liveList.filter((l) => l.status !== "planejada").length} realizadas · R$ ${totalRevenue.toLocaleString("pt-BR")} faturados`}
        action={{ label: "Criar Nova Live", onClick: () => setShowNewLive(true) }}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Faturamento Total",   value: `R$ ${totalRevenue.toLocaleString("pt-BR")}`, icon: DollarSign, color: "bg-[#6C3BFF]/10 text-[#6C3BFF]" },
            { label: "Total de Pedidos",    value: totalOrders,                                    icon: ShoppingBag,color: "bg-amber-100 text-amber-600"    },
            { label: "Lives Realizadas",    value: encerradas.length,                              icon: Video,      color: "bg-rose-100 text-rose-600"       },
            { label: "Conversão Média",     value: `${avgConversion}%`,                            icon: BarChart3,  color: "bg-[#10B981]/10 text-[#10B981]"  },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.color)}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#111827]">{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* LIVE NOW card */}
        {liveNow && (
          <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#6C3BFF]/10 mix-blend-overlay" />
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    AO VIVO
                  </span>
                  <span className="flex items-center gap-1 text-white/50 text-xs">
                    <Clock size={11} /> {liveNow.duration}
                  </span>
                  <span className="flex items-center gap-1 text-white/50 text-xs">
                    <Users size={11} /> {liveNow.viewers} vendo
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">{liveNow.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  {liveNow.channels.map((c) => (
                    <span key={c} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/80">{c}</span>
                  ))}
                </div>
                <div className="flex items-center gap-5">
                  <div>
                    <p className="text-xl font-bold text-white">R$ {liveNow.revenue?.toLocaleString("pt-BR")}</p>
                    <p className="text-[10px] text-white/50">faturado</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{liveNow.orders}</p>
                    <p className="text-[10px] text-white/50">pedidos</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{liveNow.carts}</p>
                    <p className="text-[10px] text-white/50">carrinhos</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push("/ao-vivo")}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-3 rounded-xl transition-colors"
              >
                <Play size={15} /> Entrar no Painel
              </button>
            </div>
          </div>
        )}

        {/* Encerradas */}
        {encerradas.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Lives Encerradas</h3>
            <div className="space-y-3">
              {encerradas.map((live) => (
                <div key={live.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Video size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#111827] truncate">{live.name}</p>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">Encerrada</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {live.date} · {live.time}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {live.duration}</span>
                      {live.channels.map((c) => (
                        <span key={c} className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", channelColors[c] ?? "bg-gray-100 text-gray-600")}>{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#111827]">R$ {live.revenue?.toLocaleString("pt-BR")}</p>
                      <p className="text-[10px] text-gray-400">faturado</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#111827]">{live.orders}</p>
                      <p className="text-[10px] text-gray-400">pedidos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#10B981]">{live.conversion}%</p>
                      <p className="text-[10px] text-gray-400">conversão</p>
                    </div>
                    <button
                      onClick={() => router.push("/analytics")}
                      className="text-gray-400 hover:text-[#6C3BFF] flex items-center gap-1 text-xs font-medium transition-colors"
                    >
                      Relatório <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Planejadas */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Lives Planejadas</h3>
          <div className="space-y-3">
            {liveList.filter((l) => l.status === "planejada").map((live) => {
              const pct = live.checklistDone && live.checklistTotal
                ? Math.round((live.checklistDone / live.checklistTotal) * 100)
                : 0;
              return (
                <div key={live.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#6C3BFF]/10 flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-[#6C3BFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#111827] truncate">{live.name}</p>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">Planejada</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {live.date} · {live.time}</span>
                      <span className="flex items-center gap-1"><ShoppingBag size={10} /> {live.products} produtos</span>
                      {live.channels.map((c) => (
                        <span key={c} className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", channelColors[c] ?? "bg-gray-100 text-gray-600")}>{c}</span>
                      ))}
                    </div>
                    {live.checklistDone !== undefined && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-[#6C3BFF]" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{live.checklistDone}/{live.checklistTotal} checklist</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setChecklistLive(live)}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#6C3BFF] bg-[#6C3BFF]/10 hover:bg-[#6C3BFF]/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <CheckCircle2 size={13} /> Checklist
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === live.id ? null : live.id)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenu === live.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden w-36 py-1">
                            <button
                              onClick={() => { setChecklistLive(live); setOpenMenu(null); }}
                              className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Editar live
                            </button>
                            <button
                              onClick={() => router.push("/ao-vivo")}
                              className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Iniciar live
                            </button>
                            <button
                              onClick={() => removeLive(live.id)}
                              className="w-full px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50 transition-colors"
                            >
                              Cancelar live
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Create new live placeholder */}
            <button
              onClick={() => setShowNewLive(true)}
              className="w-full py-4 flex items-center justify-center gap-2 text-[#6C3BFF] bg-[#6C3BFF]/5 hover:bg-[#6C3BFF]/10 rounded-xl border-2 border-dashed border-[#6C3BFF]/30 hover:border-[#6C3BFF]/50 transition-all text-sm font-medium"
            >
              <Plus size={16} /> Criar Nova Live
            </button>
          </div>
        </div>

      </div>

      {checklistLive && (
        <ChecklistModal live={checklistLive} onClose={() => setChecklistLive(null)} />
      )}

      {showNewLive && (
        <NewLiveModal
          onClose={() => setShowNewLive(false)}
          onAdd={(live) => setLiveList((prev) => [...prev, live])}
        />
      )}
    </div>
  );
}
