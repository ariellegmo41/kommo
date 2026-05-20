"use client";

import { useState, useEffect } from "react";
import {
  Radio, Search, ShoppingCart, AlertTriangle, CheckCircle2,
  Clock, MessageSquare, Users, X, Plus, Zap, ChevronRight,
  DollarSign, Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LiveProduct {
  code: string; name: string; price: number; stock: number;
  sizes: Record<string, number>;
}

interface CartItem { code: string; name: string; size: string; price: number }

interface Cart {
  id: string; customer: string; channel: string;
  minutesAgo: number; minutesLeft: number;
  status: "aguardando" | "pago" | "expirando" | "expirado";
  items: CartItem[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const liveProducts: LiveProduct[] = [
  { code:"101", name:"Vestido Midi Floral",    price:189.90, stock:5, sizes:{ P:2, M:2, G:1, GG:0 } },
  { code:"102", name:"Blusa Cropped Tricô",   price:79.90,  stock:1, sizes:{ P:0, M:1, G:0, GG:0 } },
  { code:"103", name:"Calça Wide Leg Bege",   price:129.90, stock:0, sizes:{ P:0, M:0, G:0, GG:0 } },
  { code:"104", name:"Conjunto Alfaiataria",   price:259.90, stock:2, sizes:{ P:0, M:1, G:1, GG:0 } },
  { code:"105", name:"Vestido Longo Festa",    price:299.90, stock:4, sizes:{ P:1, M:1, G:1, GG:1 } },
  { code:"106", name:"Blazer Oversized",       price:189.90, stock:6, sizes:{ P:2, M:2, G:1, GG:1 } },
  { code:"107", name:"Saia Midi Plissada",     price:99.90,  stock:7, sizes:{ P:2, M:2, G:2, GG:1 } },
  { code:"108", name:"Conjunto Jogger",        price:149.90, stock:3, sizes:{ P:1, M:1, G:1, GG:0 } },
];

const initialCarts: Cart[] = [
  {
    id:"1", customer:"Fernanda Lima", channel:"WhatsApp", minutesAgo:23, minutesLeft:37, status:"aguardando",
    items:[
      { code:"101", name:"Vestido Midi Floral", size:"P", price:189.90 },
      { code:"106", name:"Blazer Oversized",    size:"M", price:189.90 },
    ],
  },
  {
    id:"2", customer:"Camila Rodrigues", channel:"Instagram", minutesAgo:45, minutesLeft:15, status:"aguardando",
    items:[
      { code:"105", name:"Vestido Longo Festa", size:"G", price:299.90 },
      { code:"106", name:"Blazer Oversized",    size:"M", price:189.90 },
    ],
  },
  {
    id:"3", customer:"Andressa Costa", channel:"WhatsApp", minutesAgo:55, minutesLeft:0, status:"pago",
    items:[
      { code:"104", name:"Conjunto Alfaiataria", size:"M", price:259.90 },
    ],
  },
  {
    id:"4", customer:"Tatiane Oliveira", channel:"WhatsApp", minutesAgo:58, minutesLeft:2, status:"expirando",
    items:[
      { code:"108", name:"Conjunto Jogger", size:"P", price:149.90 },
    ],
  },
  {
    id:"5", customer:"Rafaela Santos", channel:"Instagram", minutesAgo:12, minutesLeft:48, status:"aguardando",
    items:[
      { code:"101", name:"Vestido Midi Floral", size:"M", price:189.90 },
    ],
  },
];

const alertsData = [
  { type:"success", time:"19:34", text:"Ana Lima: PIX confirmado · R$ 389,00" },
  { type:"warning", time:"19:31", text:"Produto 103 esgotado — 2 na fila de espera" },
  { type:"danger",  time:"19:30", text:"Tatiane O.: prazo expira em 2 min" },
  { type:"success", time:"19:28", text:"Beatriz S.: PIX confirmado · R$ 299,90" },
  { type:"info",    time:"19:25", text:"Nova cliente: Priscila T. (TikTok)" },
  { type:"warning", time:"19:20", text:"Cliente VIP: Andressa Costa comprando" },
];

const waitlist = [
  { code:"103", name:"Calça Wide Leg Bege", stock:0, queue:["Rafaela Santos","Juliana F."] },
  { code:"102", name:"Blusa Cropped Tricô", stock:1, queue:["Priscila Tavares"] },
];

const recentCodes = [
  { code:"101", name:"Vestido Midi Floral", count:12 },
  { code:"105", name:"Vestido Longo Festa", count:8  },
  { code:"106", name:"Blazer Oversized",    count:6  },
  { code:"104", name:"Conjunto Alfaiat.",   count:4  },
];

const channelBadge: Record<string, string> = {
  WhatsApp: "bg-green-100 text-green-700",
  Instagram:"bg-pink-100 text-pink-700",
};

function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price, 0);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AoVivoPage() {
  const [seconds, setSeconds] = useState(23 * 60 + 47);
  const [code, setCode]       = useState("");
  const [selectedSize, setSize] = useState("");
  const [added, setAdded]     = useState(false);
  const [carts, setCarts]     = useState<Cart[]>(initialCarts);
  const [cartFilter, setCartFilter] = useState<"todos" | "aguardando" | "pago" | "expirando">("todos");

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const found = code.length >= 2
    ? liveProducts.find((p) => p.code.startsWith(code) || p.name.toLowerCase().includes(code.toLowerCase()))
    : null;

  function handleAdd() {
    if (!found || !selectedSize || found.sizes[selectedSize] === 0) return;
    setAdded(true);
    setTimeout(() => { setAdded(false); setCode(""); setSize(""); }, 1600);
  }

  const paidCount = carts.filter(c => c.status === "pago").length;
  const totalRevenue = carts.filter(c => c.status === "pago").reduce((s, c) => s + cartTotal(c.items), 0)
    + 3420 - 259.90; // base revenue from the demo

  const filteredCarts = cartFilter === "todos"
    ? carts
    : carts.filter(c => c.status === cartFilter);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0f172a]">

      {/* Live header */}
      <div className="flex items-center gap-4 px-5 py-3 bg-[#111827] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            AO VIVO
          </span>
          <span className="text-white font-semibold text-sm">Queima de Estoque — Moda Feminina</span>
        </div>
        <div className="flex items-center gap-3 text-white/50 text-xs">
          <span className="flex items-center gap-1"><Clock size={11} />{mm}:{ss}</span>
          <span className="bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full text-[10px] font-medium">Instagram</span>
          <span className="bg-slate-500/20 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-medium">TikTok</span>
          <span className="flex items-center gap-1"><Users size={11} />156 vendo</span>
        </div>
        <div className="flex-1" />
        <button className="flex items-center gap-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-800/40 transition-colors">
          <X size={13} /> Encerrar Live
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 px-5 py-2.5 bg-[#1a2235] border-b border-white/5 flex-shrink-0">
        {[
          { label: "Faturado",    value: `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`, color: "text-[#10B981]" },
          { label: "Pedidos",     value: String(paidCount + 18),   color: "text-white" },
          { label: "Carrinhos",   value: String(carts.length),      color: "text-white" },
          { label: "Pagos",       value: String(paidCount + 5),     color: "text-[#10B981]" },
          { label: "Aguardando",  value: String(carts.filter(c => c.status === "aguardando").length), color: "text-amber-400" },
          { label: "Expirando",   value: String(carts.filter(c => c.status === "expirando").length),  color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={cn("text-base font-bold", s.color)}>{s.value}</span>
            <span className="text-white/30 text-xs">{s.label}</span>
            <span className="text-white/10">·</span>
          </div>
        ))}
      </div>

      {/* Main 3-column layout */}
      <div className="flex-1 overflow-hidden flex gap-3 p-3">

        {/* LEFT: Product panel */}
        <div className="w-[260px] flex-shrink-0 flex flex-col gap-3">

          <div className="bg-[#1e2d45] rounded-xl border border-white/10 p-4 flex flex-col gap-3">
            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Adicionar ao Carrinho</p>

            {/* Code search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value); setSize(""); }}
                placeholder="Código ou nome (ex: 104)"
                className="w-full bg-[#111827] border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#6C3BFF]/60"
              />
            </div>

            {/* Product result */}
            {found ? (
              <div className="bg-[#111827] rounded-xl p-3.5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-[#6C3BFF]">{found.code}</span>
                  <span className={cn("text-[10px] font-semibold", found.stock > 0 ? "text-[#10B981]" : "text-red-400")}>
                    {found.stock > 0 ? `${found.stock} disp.` : "Esgotado"}
                  </span>
                </div>
                <p className="text-sm font-bold text-white mb-0.5">{found.name}</p>
                <p className="text-xs text-[#10B981] font-semibold mb-3">R$ {found.price.toFixed(2).replace(".", ",")}</p>

                <p className="text-[10px] text-white/40 mb-1.5">Tamanho:</p>
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {Object.entries(found.sizes).map(([size, qty]) => (
                    <button
                      key={size}
                      disabled={qty === 0}
                      onClick={() => setSize(size)}
                      className={cn(
                        "w-10 h-8 rounded-lg text-xs font-bold border transition-all",
                        qty === 0
                          ? "border-white/5 text-white/15 cursor-not-allowed"
                          : selectedSize === size
                            ? "bg-[#6C3BFF] border-[#6C3BFF] text-white"
                            : "border-white/20 text-white/70 hover:border-[#6C3BFF]/60"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!selectedSize || found.stock === 0}
                  className={cn(
                    "w-full py-2 rounded-lg text-xs font-bold transition-all",
                    added
                      ? "bg-[#10B981] text-white"
                      : selectedSize && found.stock > 0
                        ? "bg-[#6C3BFF] text-white hover:bg-[#5a2fd6]"
                        : "bg-white/5 text-white/25 cursor-not-allowed"
                  )}
                >
                  {added ? "✓ Adicionado!" : "+ Adicionar ao Carrinho"}
                </button>
              </div>
            ) : code.length >= 2 ? (
              <div className="text-center py-4 text-white/30 text-xs">Produto não encontrado</div>
            ) : null}
          </div>

          {/* Recent products */}
          <div className="bg-[#1e2d45] rounded-xl border border-white/10 p-4 flex-1 overflow-y-auto">
            <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-3">Últimos chamados</p>
            <div className="space-y-2">
              {recentCodes.map((r) => (
                <button
                  key={r.code}
                  onClick={() => { setCode(r.code); setSize(""); }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <span className="text-[10px] font-bold text-[#6C3BFF] w-8">{r.code}</span>
                  <span className="flex-1 text-xs text-white/70 truncate">{r.name}</span>
                  <span className="text-[10px] text-white/30">×{r.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: Carts */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart size={14} className="text-white/60" />
              <span className="text-white/80 text-sm font-semibold">Carrinhos Abertos</span>
            </div>
            <div className="flex gap-1">
              {(["todos","aguardando","pago","expirando"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setCartFilter(f)}
                  className={cn(
                    "text-[10px] font-semibold px-2.5 py-1 rounded-lg capitalize transition-colors",
                    cartFilter === f ? "bg-[#6C3BFF] text-white" : "bg-white/5 text-white/40 hover:text-white/70"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5">
            {filteredCarts.map((cart) => {
              const total = cartTotal(cart.items);
              const isPaid     = cart.status === "pago";
              const isExpiring = cart.status === "expirando";

              return (
                <div
                  key={cart.id}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    isPaid     ? "bg-[#10B981]/10 border-[#10B981]/30" :
                    isExpiring ? "bg-red-950/40 border-red-500/40" :
                                 "bg-[#1e2d45] border-white/10"
                  )}
                >
                  {/* Cart header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <span className="text-sm font-bold text-white truncate">{cart.customer}</span>
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0", channelBadge[cart.channel] ?? "bg-gray-100 text-gray-700")}>
                        {cart.channel}
                      </span>
                    </div>
                    {isPaid ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#10B981] flex-shrink-0">
                        <CheckCircle2 size={12} /> PAGO
                      </span>
                    ) : isExpiring ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 animate-pulse flex-shrink-0">
                        <Clock size={12} /> {cart.minutesLeft} min!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-white/40 flex-shrink-0">
                        <Clock size={11} /> {cart.minutesLeft}min restando
                      </span>
                    )}
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 mb-3">
                    {cart.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className="text-white/30 w-8 flex-shrink-0">{item.code}</span>
                        <span className="flex-1 text-white/70 truncate">{item.name}</span>
                        <span className="text-white/50 flex-shrink-0">tam {item.size}</span>
                        <span className="text-white font-semibold flex-shrink-0">R$ {item.price.toFixed(2).replace(".", ",")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/10">
                    <span className="text-sm font-bold text-white">
                      Total: R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                    {isPaid ? (
                      <button className="text-xs text-[#10B981] font-medium hover:underline flex items-center gap-1">
                        Ver Pedido <ChevronRight size={11} />
                      </button>
                    ) : isExpiring ? (
                      <div className="flex gap-2">
                        <button className="text-xs bg-red-500 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                          Enviar Link Urgente
                        </button>
                        <button className="text-xs text-white/40 hover:text-white/70 px-2 py-1.5 rounded-lg border border-white/10">
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button className="text-xs bg-[#6C3BFF] text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-[#5a2fd6] transition-colors flex items-center gap-1">
                          <MessageSquare size={11} /> Enviar Link
                        </button>
                        <button className="text-xs text-white/40 hover:text-white/70 px-2 py-1.5 rounded-lg border border-white/10">
                          Editar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Alerts + Waitlist */}
        <div className="w-[250px] flex-shrink-0 flex flex-col gap-3">

          {/* Alerts */}
          <div className="bg-[#1e2d45] rounded-xl border border-white/10 p-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={13} className="text-amber-400" />
              <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Alertas em Tempo Real</p>
            </div>
            <div className="space-y-2.5">
              {alertsData.map((a, i) => {
                const icon = a.type === "success" ? <CheckCircle2 size={12} className="text-[#10B981] flex-shrink-0" />
                           : a.type === "danger"  ? <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />
                           : a.type === "warning" ? <AlertTriangle size={12} className="text-amber-400 flex-shrink-0" />
                           : <Users size={12} className="text-blue-400 flex-shrink-0" />;
                return (
                  <div key={i} className="flex items-start gap-2">
                    <div className="mt-0.5">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-white/70 leading-snug">{a.text}</p>
                      <p className="text-[9px] text-white/25 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Waitlist */}
          <div className="bg-[#1e2d45] rounded-xl border border-white/10 p-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Users size={13} className="text-[#6C3BFF]" />
              <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Lista de Espera</p>
            </div>
            <div className="space-y-3">
              {waitlist.map((w) => (
                <div key={w.code}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#6C3BFF]">{w.code}</span>
                      <span className="text-[10px] text-white/60 truncate">{w.name}</span>
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                      w.stock === 0 ? "bg-red-900/40 text-red-400" : "bg-amber-900/40 text-amber-400"
                    )}>
                      {w.stock === 0 ? "Esgotado" : `${w.stock} un.`}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {w.queue.map((name, i) => (
                      <div key={name} className="flex items-center gap-2 text-[10px] text-white/50">
                        <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-white/30 text-[9px] font-bold flex-shrink-0">{i + 1}</span>
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
