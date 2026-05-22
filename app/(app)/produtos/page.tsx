"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import {
  Tag, Plus, Search, Package, Star, MoreHorizontal,
  Edit2, Copy, ShoppingBag, Filter, X, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductStatus = "ativo" | "exclusivo" | "esgotado" | "reservado" | "oculto";

interface Product {
  code: string; name: string; category: string;
  price: number; cost: number;
  stock: number; sizes: Record<string, number>;
  status: ProductStatus; tags: string[];
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const products: Product[] = [
  { code:"101", name:"Vestido Midi Floral",    category:"Vestidos",   price:189.90, cost:72.00, stock:5,  sizes:{PP:0,P:2,M:2,G:1,GG:0}, status:"ativo",      tags:["Lançamento"],    color:"bg-rose-100"    },
  { code:"102", name:"Blusa Cropped Tricô",   category:"Blusas",     price:79.90,  cost:29.00, stock:1,  sizes:{PP:0,P:0,M:1,G:0,GG:0}, status:"exclusivo",   tags:["Peça Única"],    color:"bg-amber-100"   },
  { code:"103", name:"Calça Wide Leg Bege",   category:"Calças",     price:129.90, cost:48.00, stock:0,  sizes:{PP:0,P:0,M:0,G:0,GG:0}, status:"esgotado",    tags:[],               color:"bg-yellow-50"   },
  { code:"104", name:"Conjunto Alfaiataria",   category:"Conjuntos",  price:259.90, cost:98.00, stock:2,  sizes:{PP:0,P:0,M:1,G:1,GG:0}, status:"exclusivo",   tags:["Mais Vendido"], color:"bg-stone-200"   },
  { code:"105", name:"Vestido Longo Festa",    category:"Vestidos",   price:299.90, cost:112.00,stock:4,  sizes:{PP:0,P:1,M:1,G:1,GG:1}, status:"ativo",       tags:["Premium"],      color:"bg-purple-100"  },
  { code:"106", name:"Blazer Oversized",       category:"Blazers",    price:189.90, cost:72.00, stock:6,  sizes:{PP:0,P:2,M:2,G:1,GG:1}, status:"ativo",       tags:["Lançamento"],   color:"bg-gray-200"    },
  { code:"107", name:"Saia Midi Plissada",     category:"Saias",      price:99.90,  cost:38.00, stock:7,  sizes:{PP:0,P:2,M:2,G:2,GG:1}, status:"ativo",       tags:[],              color:"bg-teal-100"    },
  { code:"108", name:"Conjunto Jogger",        category:"Conjuntos",  price:149.90, cost:56.00, stock:3,  sizes:{PP:0,P:1,M:1,G:1,GG:0}, status:"exclusivo",   tags:["Promoção"],     color:"bg-slate-200"   },
];

const statusConfig: Record<ProductStatus, { label: string; bg: string; text: string }> = {
  ativo:     { label:"Ativo",             bg:"bg-[#10B981]/10", text:"text-[#10B981]"  },
  exclusivo: { label:"Exclusivo da Live", bg:"bg-[#6C3BFF]/10", text:"text-[#6C3BFF]"  },
  esgotado:  { label:"Esgotado",          bg:"bg-red-100",       text:"text-red-600"    },
  reservado: { label:"Reservado",         bg:"bg-amber-100",     text:"text-amber-700"  },
  oculto:    { label:"Oculto",            bg:"bg-gray-100",      text:"text-gray-500"   },
};

const categories = ["Todos", "Vestidos", "Conjuntos", "Blusas", "Calças", "Blazers", "Saias"];
const statuses: (ProductStatus | "todos")[] = ["todos","ativo","exclusivo","esgotado"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProdutosPage() {
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("Todos");
  const [statusFilter, setStatus] = useState<ProductStatus | "todos">("todos");
  const [selected, setSelected]   = useState<Product | null>(products[0]);
  const [productList, setProductList] = useState(products);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Vestidos");
  const [newPrice, setNewPrice] = useState("");
  const [newCost, setNewCost] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  function showFeedback(msg: string) {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2500);
  }

  function addProduct() {
    if (!newName.trim() || !newPrice) return;
    const prod: Product = {
      code: String(productList.length + 101),
      name: newName, category: newCategory,
      price: parseFloat(newPrice), cost: parseFloat(newCost) || 0,
      stock: 0, sizes: { PP: 0, P: 0, M: 0, G: 0, GG: 0 },
      status: "ativo", tags: [], color: "bg-blue-100",
    };
    setProductList((prev) => [...prev, prod]);
    setNewName(""); setNewPrice(""); setNewCost(""); setShowNewProduct(false);
  }

  const filtered = productList.filter((p) => {
    const matchSearch   = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.includes(search);
    const matchCategory = category === "Todos" || p.category === category;
    const matchStatus   = statusFilter === "todos" || p.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const margin = selected ? Math.round(((selected.price - selected.cost) / selected.price) * 100) : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {actionFeedback && (
        <div className="fixed top-4 right-4 z-50 bg-[#111827] text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2">
          <Check size={14} className="text-[#10B981]" /> {actionFeedback}
        </div>
      )}
      {showNewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNewProduct(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[#111827]">Novo Produto</h3>
              <button onClick={() => setShowNewProduct(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Nome *</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome do produto" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Categoria</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                  {["Vestidos","Conjuntos","Blusas","Calças","Blazers","Saias"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Preço de venda *</label>
                  <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="189.90" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Custo</label>
                  <input type="number" value={newCost} onChange={(e) => setNewCost(e.target.value)} placeholder="72.00" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none" />
                </div>
              </div>
              <button onClick={addProduct} className="w-full py-2.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors">Cadastrar Produto</button>
            </div>
          </div>
        </div>
      )}
      <Topbar
        title="Produtos"
        subtitle={`${products.length} produtos · ${products.filter(p => p.status !== "esgotado").length} disponíveis`}
        action={{ label: "Novo Produto", onClick: () => setShowNewProduct(true) }}
      />

      <div className="flex-1 overflow-hidden flex gap-0">

        {/* Left: list */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">

          {/* Filters */}
          <div className="p-4 space-y-3 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou código..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 focus:border-[#6C3BFF]"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-full transition-colors",
                    category === c ? "bg-[#6C3BFF] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {c}
                </button>
              ))}
              <div className="h-6 w-px bg-gray-200 self-center mx-1" />
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-full capitalize transition-colors",
                    statusFilter === s ? "bg-[#111827] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {s === "todos" ? "Todos status" : statusConfig[s]?.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Código", "Produto", "Preço", "Estoque", "Status", ""].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const sc = statusConfig[p.status];
                  const isSelected = selected?.code === p.code;
                  return (
                    <tr
                      key={p.code}
                      onClick={() => setSelected(p)}
                      className={cn(
                        "hover:bg-gray-50 cursor-pointer transition-colors",
                        isSelected && "bg-[#6C3BFF]/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-[#6C3BFF] bg-[#6C3BFF]/10 px-2 py-0.5 rounded-md">{p.code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-8 h-8 rounded-lg flex-shrink-0", p.color)} />
                          <div>
                            <p className="text-sm font-medium text-[#111827]">{p.name}</p>
                            <p className="text-[10px] text-gray-400">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-[#111827]">R$ {p.price.toFixed(2).replace(".", ",")}</p>
                        <p className="text-[10px] text-gray-400">custo R$ {p.cost.toFixed(2).replace(".", ",")}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-sm font-bold",
                          p.stock === 0 ? "text-red-500" : p.stock <= 2 ? "text-amber-500" : "text-[#10B981]"
                        )}>{p.stock}</span>
                        <span className="text-xs text-gray-400"> un.</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", sc.bg, sc.text)}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: detail panel */}
        {selected && (
          <div className="w-[300px] flex-shrink-0 overflow-y-auto p-5 space-y-5">
            {/* Product header */}
            <div className="flex items-start gap-3">
              <div className={cn("w-14 h-14 rounded-xl flex-shrink-0", selected.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-[#6C3BFF] bg-[#6C3BFF]/10 px-2 py-0.5 rounded-md">{selected.code}</span>
                  {selected.tags.map((t) => (
                    <span key={t} className="text-[9px] font-medium bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <p className="text-sm font-bold text-[#111827] leading-tight">{selected.name}</p>
                <p className="text-xs text-gray-400">{selected.category}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Preço de Venda",  value: `R$ ${selected.price.toFixed(2).replace(".", ",")}`, bold: true },
                { label: "Custo",           value: `R$ ${selected.cost.toFixed(2).replace(".", ",")}`,  bold: false },
                { label: "Margem",          value: `${margin}%`,                                        bold: false },
                { label: "Total em Estoque",value: `${selected.stock} un.`,                             bold: false },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                  <p className={cn("text-sm font-bold", s.bold ? "text-[#6C3BFF]" : "text-[#111827]")}>{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Status */}
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(statusConfig) as ProductStatus[]).map((s) => {
                  const sc = statusConfig[s];
                  return (
                    <span
                      key={s}
                      className={cn(
                        "text-[10px] font-semibold px-2.5 py-1 rounded-full border-2 transition-all",
                        selected.status === s
                          ? `${sc.bg} ${sc.text} border-current`
                          : "bg-white text-gray-400 border-gray-100"
                      )}
                    >
                      {sc.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Estoque por Tamanho</p>
              <div className="grid grid-cols-5 gap-1.5">
                {Object.entries(selected.sizes).map(([size, qty]) => (
                  <div key={size} className="text-center">
                    <div className={cn(
                      "w-full py-2 rounded-lg text-xs font-bold mb-0.5",
                      qty === 0 ? "bg-red-100 text-red-400" : qty <= 1 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                    )}>{qty}</div>
                    <p className="text-[9px] text-gray-400">{size}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button onClick={() => showFeedback(`${selected?.name} adicionado à live!`)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#6C3BFF] text-white text-sm font-semibold hover:bg-[#5a2fd6] transition-colors">
                <Plus size={15} /> Adicionar à Live
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => showFeedback("Editar produto em breve")} className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                  <Edit2 size={13} /> Editar
                </button>
                <button onClick={() => { if (selected) { const dup = { ...selected, code: String(productList.length + 101), name: selected.name + " (cópia)" }; setProductList((p) => [...p, dup]); showFeedback("Produto duplicado!"); } }} className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                  <Copy size={13} /> Duplicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
