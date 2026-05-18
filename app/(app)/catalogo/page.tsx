"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import {
  Search, Star, MessageSquare, Edit2, Plus, AlertTriangle,
  Link as LinkIcon, ArrowUpRight, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Sizes = { PP: number; P: number; M: number; G: number; GG: number };

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  color: string;
  textColor: string;
  stock: number;
  rating: number;
  sales: number;
  sizes: Sizes;
  desc: string;
}

const categories = ["Todos", "Vestidos", "Conjuntos", "Blusas", "Calças", "Blazers", "Saias"];

const products: Product[] = [
  {
    id: "1", name: "Vestido Midi Floral",   category: "Vestidos",  price: 459, color: "bg-rose-100",   textColor: "text-rose-600",
    stock: 18, rating: 4.9, sales: 87,
    sizes: { PP: 2, P: 4, M: 7, G: 3, GG: 2 },
    desc: "Vestido midi com estampa floral delicada, tecido fluido e corte elegante. Ideal para eventos e jantares especiais.",
  },
  {
    id: "2", name: "Conjunto Alfaiataria",  category: "Conjuntos", price: 648, color: "bg-stone-200",  textColor: "text-stone-700",
    stock: 12, rating: 4.8, sales: 54,
    sizes: { PP: 1, P: 3, M: 4, G: 2, GG: 2 },
    desc: "Conjunto de blazer e calça em alfaiataria premium. Sofisticação e conforto para o dia a dia.",
  },
  {
    id: "3", name: "Blusa Cropped Tricô",   category: "Blusas",    price: 189, color: "bg-amber-100",  textColor: "text-amber-700",
    stock: 3,  rating: 4.6, sales: 43,
    sizes: { PP: 0, P: 1, M: 1, G: 1, GG: 0 },
    desc: "Blusa cropped em tricô macio, perfeita para combinar com calças de cintura alta.",
  },
  {
    id: "4", name: "Calça Wide Leg Bege",   category: "Calças",    price: 279, color: "bg-yellow-50",  textColor: "text-yellow-700",
    stock: 0,  rating: 4.7, sales: 62,
    sizes: { PP: 0, P: 0, M: 0, G: 0, GG: 0 },
    desc: "Calça wide leg em linho bege de alta qualidade, corte amplo e fluido.",
  },
  {
    id: "5", name: "Vestido Longo Festa",   category: "Vestidos",  price: 729, color: "bg-purple-100", textColor: "text-purple-700",
    stock: 7,  rating: 4.9, sales: 31,
    sizes: { PP: 1, P: 2, M: 3, G: 1, GG: 0 },
    desc: "Vestido longo ideal para festas e formaturas, com decote elegante e saia fluida.",
  },
  {
    id: "6", name: "Conjunto Jogger Premium",category: "Conjuntos", price: 389, color: "bg-slate-200", textColor: "text-slate-700",
    stock: 15, rating: 4.5, sales: 29,
    sizes: { PP: 3, P: 4, M: 4, G: 3, GG: 1 },
    desc: "Conjunto jogger em moletom premium, confortável e estiloso para o casual.",
  },
  {
    id: "7", name: "Blazer Oversized",      category: "Blazers",   price: 489, color: "bg-gray-200",   textColor: "text-gray-700",
    stock: 9,  rating: 4.8, sales: 47,
    sizes: { PP: 2, P: 2, M: 3, G: 1, GG: 1 },
    desc: "Blazer oversized em tecido estruturado, tendência da temporada. Versátil e moderno.",
  },
  {
    id: "8", name: "Saia Midi Plissada",    category: "Saias",     price: 319, color: "bg-teal-100",   textColor: "text-teal-700",
    stock: 6,  rating: 4.7, sales: 38,
    sizes: { PP: 1, P: 2, M: 2, G: 1, GG: 0 },
    desc: "Saia midi com pregas finas, tecido leve e caimento perfeito para qualquer ocasião.",
  },
];

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-medium">Sem estoque</span>;
  if (stock <= 3)  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Estoque baixo</span>;
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{stock} un.</span>;
}

function SizeCell({ qty }: { qty: number }) {
  const bg = qty === 0 ? "bg-gray-100 text-gray-400" : qty <= 2 ? "bg-red-100 text-red-600" : qty <= 5 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700";
  return <span className={`inline-flex items-center justify-center w-8 h-7 rounded text-xs font-bold ${bg}`}>{qty}</span>;
}

export default function CatalogoPage() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Product>(products[0]);

  const filtered = products.filter((p) =>
    (category === "Todos" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Produtos",  value: products.length,                             color: "text-[#111827]" },
    { label: "Ativos",          value: products.filter((p) => p.stock > 0).length,  color: "text-[#10B981]" },
    { label: "Estoque Baixo",   value: products.filter((p) => p.stock > 0 && p.stock <= 3).length, color: "text-amber-600" },
    { label: "Sem Estoque",     value: products.filter((p) => p.stock === 0).length, color: "text-red-500" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Catálogo de Produtos"
        subtitle="Bella Modas — gerencie produtos e compartilhe via WhatsApp"
        action={{ label: "Novo Produto", onClick: () => {} }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 gap-4">

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search + filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produto..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-xl font-medium transition-colors",
                    category === c ? "bg-[#6C3BFF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-4 gap-4">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={cn(
                    "bg-white rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-all group",
                    selected.id === p.id ? "border-[#6C3BFF] ring-1 ring-[#6C3BFF]/20" : "border-gray-100"
                  )}
                >
                  {/* Image placeholder */}
                  <div className={`${p.color} rounded-t-2xl h-36 flex items-center justify-center relative overflow-hidden`}>
                    <span className={`text-4xl font-black ${p.textColor} opacity-20 select-none`}>{p.name[0]}</span>
                    {p.stock === 0 && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-red-500 px-2 py-0.5 rounded-full">Esgotado</span>
                      </div>
                    )}
                    {p.stock > 0 && p.stock <= 3 && (
                      <div className="absolute top-2 right-2">
                        <AlertTriangle size={14} className="text-amber-500" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow text-gray-600 hover:text-[#6C3BFF]">
                        <Edit2 size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-sm font-semibold text-[#111827] leading-tight">{p.name}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">{p.category}</span>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-base font-bold text-[#6C3BFF]">R$ {p.price.toLocaleString("pt-BR")}</p>
                      <StockBadge stock={p.stock} />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] text-gray-500">{p.rating} · {p.sales} vendas</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add product card */}
              <button className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#6C3BFF]/40 hover:bg-[#6C3BFF]/5 transition-all flex flex-col items-center justify-center gap-2 h-[220px] text-gray-400 hover:text-[#6C3BFF]">
                <Plus size={24} />
                <span className="text-sm font-medium">Novo Produto</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product detail panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
          <div className={`${selected.color} h-40 flex items-center justify-center flex-shrink-0 relative`}>
            <span className={`text-7xl font-black ${selected.textColor} opacity-20 select-none`}>{selected.name[0]}</span>
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              <button className="px-2.5 py-1.5 bg-white/90 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1 hover:bg-white transition-colors shadow-sm">
                <Edit2 size={11} /> Editar
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[#111827] text-base leading-tight">{selected.name}</h3>
                <StockBadge stock={selected.stock} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Tag size={9} /> {selected.category}
                </span>
                <span className="flex items-center gap-0.5 text-xs text-gray-500">
                  <Star size={10} className="text-amber-400 fill-amber-400" /> {selected.rating}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#6C3BFF] mt-3">R$ {selected.price.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-gray-400 mt-0.5">{selected.sales} vendas · R$ {(selected.price * selected.sales).toLocaleString("pt-BR")} em receita</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Descrição</p>
              <p className="text-xs text-gray-600 leading-relaxed">{selected.desc}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Estoque por Tamanho</p>
              <div className="grid grid-cols-5 gap-1.5">
                {(["PP", "P", "M", "G", "GG"] as const).map((size) => (
                  <div key={size} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-500 font-medium">{size}</span>
                    <SizeCell qty={selected.sizes[size]} />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ações Rápidas</p>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#20bd5a] transition-colors">
                <MessageSquare size={15} /> Compartilhar no WhatsApp
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#6C3BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5930e8] transition-colors">
                <LinkIcon size={15} /> Gerar Link de Pagamento
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                <ArrowUpRight size={15} /> Ver Pedidos deste Produto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
