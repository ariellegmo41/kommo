"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import {
  Search, MoreHorizontal, MessageSquare, Check,
  ShoppingCart, DollarSign, Clock, Package, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "Aguardando Pagamento" | "Em Separação" | "Enviado" | "Entregue" | "Cancelado";
type Payment = "PIX" | "Cartão" | "Boleto";

interface Order {
  id: string;
  num: string;
  customer: string;
  avatar: string;
  product: string;
  qty: number;
  value: number;
  payment: Payment;
  status: Status;
  date: string;
  channel: string;
}

const orders: Order[] = [
  { id: "1",  num: "#1087", customer: "Fernanda Lima",      avatar: "F", product: "Vestido Midi Floral",    qty: 1, value: 459,  payment: "PIX",    status: "Aguardando Pagamento", date: "Hoje 09:21",  channel: "WhatsApp" },
  { id: "2",  num: "#1086", customer: "Andressa Costa",     avatar: "A", product: "Vestido Longo Festa",    qty: 1, value: 729,  payment: "Cartão", status: "Em Separação",         date: "Hoje 08:54",  channel: "WhatsApp" },
  { id: "3",  num: "#1085", customer: "Rafaela Santos",     avatar: "R", product: "Conjunto Alfaiataria + Blazer Oversized", qty: 2, value: 1137, payment: "PIX", status: "Enviado", date: "Ontem 17:30", channel: "Instagram" },
  { id: "4",  num: "#1084", customer: "Marina Duarte",      avatar: "M", product: "Blazer Oversized",       qty: 1, value: 489,  payment: "PIX",    status: "Entregue",             date: "Ontem 14:12", channel: "Instagram" },
  { id: "5",  num: "#1083", customer: "Juliana Freitas",    avatar: "J", product: "Vestido Midi Floral",    qty: 1, value: 459,  payment: "Cartão", status: "Entregue",             date: "Ontem 11:05", channel: "WhatsApp" },
  { id: "6",  num: "#1082", customer: "Bianca Figueiredo",  avatar: "B", product: "Saia Midi Plissada",     qty: 1, value: 319,  payment: "PIX",    status: "Aguardando Pagamento", date: "Ontem 10:22", channel: "WhatsApp" },
  { id: "7",  num: "#1081", customer: "Camila Rodrigues",   avatar: "C", product: "Conjunto Alfaiataria",   qty: 1, value: 648,  payment: "Boleto", status: "Enviado",              date: "18/05 15:40", channel: "Instagram" },
  { id: "8",  num: "#1080", customer: "Priscila Tavares",   avatar: "P", product: "Blusa Cropped Tricô",   qty: 2, value: 378,  payment: "PIX",    status: "Entregue",             date: "17/05 13:30", channel: "TikTok" },
  { id: "9",  num: "#1079", customer: "Tatiane Oliveira",   avatar: "T", product: "Conjunto Jogger Premium",qty: 1, value: 389,  payment: "Cartão", status: "Cancelado",            date: "17/05 09:10", channel: "WhatsApp" },
  { id: "10", num: "#1078", customer: "Larissa Mendes",     avatar: "L", product: "Vestido Midi Floral",   qty: 1, value: 459,  payment: "PIX",    status: "Entregue",             date: "16/05 16:55", channel: "WhatsApp" },
];

const statusConfig: Record<Status, { color: string; bg: string; dot: string }> = {
  "Aguardando Pagamento": { color: "text-amber-700",  bg: "bg-amber-100",  dot: "bg-amber-500" },
  "Em Separação":         { color: "text-blue-700",   bg: "bg-blue-100",   dot: "bg-blue-500" },
  "Enviado":              { color: "text-[#6C3BFF]",  bg: "bg-[#6C3BFF]/10", dot: "bg-[#6C3BFF]" },
  "Entregue":             { color: "text-[#10B981]",  bg: "bg-green-100",  dot: "bg-[#10B981]" },
  "Cancelado":            { color: "text-red-600",    bg: "bg-red-100",    dot: "bg-red-500" },
};

const paymentColors: Record<Payment, string> = {
  PIX:    "text-[#10B981] bg-green-100",
  Cartão: "text-blue-700 bg-blue-100",
  Boleto: "text-amber-700 bg-amber-100",
};

const avatarColors: Record<string, string> = {
  F: "bg-[#6C3BFF]", A: "bg-amber-500", R: "bg-[#7B61FF]", M: "bg-[#10B981]",
  J: "bg-teal-500",  B: "bg-rose-500",  C: "bg-indigo-500", P: "bg-pink-500",
  T: "bg-cyan-500",  L: "bg-orange-500",
};

const statusFilters: Array<Status | "Todos"> = ["Todos", "Aguardando Pagamento", "Em Separação", "Enviado", "Entregue", "Cancelado"];

const timeline: Array<{ status: Status; label: string }> = [
  { status: "Aguardando Pagamento", label: "Pedido criado" },
  { status: "Em Separação",         label: "Pagamento confirmado" },
  { status: "Enviado",              label: "Produto separado e embalado" },
  { status: "Entregue",             label: "Saiu para entrega" },
];

export default function PedidosPage() {
  const [statusFilter, setStatusFilter] = useState<Status | "Todos">("Todos");
  const [search, setSearch]   = useState("");
  const [selected, setSelected] = useState<Order>(orders[0]);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const filtered = orders.filter((o) =>
    (statusFilter === "Todos" || o.status === statusFilter) &&
    o.customer.toLowerCase().includes(search.toLowerCase())
  );

  const today = orders.filter((o) => o.date.startsWith("Hoje"));
  const revenue = today.reduce((s, o) => s + o.value, 0);
  const pending = orders.filter((o) => o.status === "Aguardando Pagamento").length;
  const delivered = orders.filter((o) => o.status === "Entregue").length;

  const statusOrder: Record<Status, number> = {
    "Aguardando Pagamento": 0, "Em Separação": 1, "Enviado": 2, "Entregue": 3, "Cancelado": 4,
  };
  const currentStep = statusOrder[selected.status] ?? 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#111827] text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2">
          <Check size={14} className="text-[#10B981]" /> {toast}
        </div>
      )}
      <Topbar
        title="Pedidos"
        subtitle={`${orders.length} pedidos · R$ ${orders.reduce((s, o) => s + o.value, 0).toLocaleString("pt-BR")} em total`}
        action={{ label: "Novo Pedido", onClick: () => showToast("Para criar um pedido, inicie o atendimento no Inbox e confirme pelo CRM.") }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 gap-4">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Pedidos Hoje",     value: today.length,                              icon: ShoppingCart, color: "text-[#6C3BFF] bg-[#6C3BFF]/10" },
              { label: "Receita do Dia",   value: `R$ ${revenue.toLocaleString("pt-BR")}`,  icon: DollarSign,   color: "text-[#10B981] bg-green-100" },
              { label: "Aguardando Pgto.", value: pending,                                   icon: Clock,        color: "text-amber-600 bg-amber-100" },
              { label: "Entregues",        value: delivered,                                 icon: Package,      color: "text-blue-600 bg-blue-100" },
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

          {/* Search + status filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-xl font-medium transition-colors whitespace-nowrap",
                    statusFilter === s ? "bg-[#6C3BFF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {s}
                  {s !== "Todos" && <span className="ml-1 text-[9px] opacity-70">({orders.filter((o) => o.status === s).length})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Pedido", "Cliente", "Produto", "Valor", "Pagamento", "Status", "Data", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => {
                  const sc = statusConfig[order.status];
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelected(order)}
                      className={cn("hover:bg-gray-50 transition-colors cursor-pointer", selected.id === order.id && "bg-[#6C3BFF]/5")}
                    >
                      <td className="px-4 py-3 text-sm font-bold text-[#6C3BFF]">{order.num}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${avatarColors[order.avatar] || "bg-gray-400"} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {order.avatar}
                          </div>
                          <span className="text-sm font-medium text-[#111827] whitespace-nowrap">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate">{order.product}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-[#111827]">R$ {order.value.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${paymentColors[order.payment]}`}>{order.payment}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.bg} ${sc.color} whitespace-nowrap`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{order.date}</td>
                      <td className="px-4 py-3">
                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order detail panel */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-[#111827]">{selected.num}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>
                {selected.status}
              </span>
            </div>
            <p className="text-xs text-gray-400">{selected.date} · {selected.channel}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Customer */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Cliente</p>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full ${avatarColors[selected.avatar] || "bg-gray-400"} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {selected.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{selected.customer}</p>
                  <p className="text-xs text-gray-400">via {selected.channel}</p>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Produto(s)</p>
              <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                <p className="text-sm font-medium text-[#111827]">{selected.product}</p>
                <p className="text-xs text-gray-400">{selected.qty}x · R$ {selected.value.toLocaleString("pt-BR")}</p>
              </div>
            </div>

            {/* Payment */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Pagamento</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${paymentColors[selected.payment]}`}>{selected.payment}</span>
                <span className="text-sm font-bold text-[#111827]">R$ {selected.value.toLocaleString("pt-BR")}</span>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Acompanhamento</p>
              <div className="space-y-3">
                {timeline.map((step, i) => {
                  const done = i < currentStep;
                  const current = i === currentStep && selected.status !== "Cancelado";
                  return (
                    <div key={step.status} className="flex items-start gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        done ? "bg-[#10B981]" : current ? "bg-[#6C3BFF]" : "bg-gray-100"
                      )}>
                        {done ? <Check size={10} className="text-white" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" style={{ color: current ? "white" : "#d1d5db" }} />}
                      </div>
                      <div>
                        <p className={cn("text-xs font-medium", done || current ? "text-[#111827]" : "text-gray-400")}>{step.status}</p>
                        <p className="text-[10px] text-gray-400">{step.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button onClick={() => showToast(`Abrindo WhatsApp para ${selected.customer}...`)} className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#20bd5a] transition-colors">
                <MessageSquare size={14} /> Contatar Cliente
              </button>
              {selected.status === "Aguardando Pagamento" && (
                <button onClick={() => showToast("Link de pagamento PIX copiado e enviado para o cliente!")} className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#6C3BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5930e8] transition-colors">
                  Enviar Link de Pagamento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
