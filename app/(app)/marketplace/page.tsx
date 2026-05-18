"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import {
  Search, Star, Download, Check, X, Globe, Zap, DollarSign,
  MessageSquare, BarChart3, Bot, Shield, Bell, Calendar, Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["Todos", "Automação", "Pagamentos", "Mensagens", "Analytics", "IA", "Produtividade", "Segurança"];

interface App {
  id: string;
  name: string;
  desc: string;
  icon: typeof Globe;
  iconBg: string;
  category: string;
  rating: number;
  reviews: number;
  installs: string;
  price: string;
  installed: boolean;
  featured?: boolean;
  badge?: string;
}

const apps: App[] = [
  { id:"1",  name:"WhatsApp Business API", desc:"Integração oficial Meta com multi-número e templates aprovados.", icon:MessageSquare, iconBg:"bg-green-100 text-green-600", category:"Mensagens",     rating:4.9, reviews:1240, installs:"50k+", price:"Grátis",       installed:true,  featured:true, badge:"Oficial" },
  { id:"2",  name:"Stripe Payments",       desc:"Aceite pagamentos e gerencie assinaturas diretamente no CRM.",  icon:DollarSign,   iconBg:"bg-indigo-100 text-indigo-600", category:"Pagamentos",    rating:4.8, reviews:892,  installs:"30k+", price:"Grátis",       installed:true  },
  { id:"3",  name:"n8n Automações",        desc:"Crie fluxos avançados conectando centenas de apps externos.",   icon:Zap,          iconBg:"bg-red-100 text-red-600",       category:"Automação",     rating:4.7, reviews:643,  installs:"20k+", price:"Grátis",       installed:false, featured:true },
  { id:"4",  name:"Mercado Pago",          desc:"Pagamentos via PIX, boleto e cartão para o mercado brasileiro.",icon:DollarSign,   iconBg:"bg-blue-100 text-blue-600",     category:"Pagamentos",    rating:4.6, reviews:512,  installs:"25k+", price:"Grátis",       installed:false },
  { id:"5",  name:"GPT-4o IA Agent",       desc:"Agente de IA avançado para qualificação e atendimento.",        icon:Bot,          iconBg:"bg-purple-100 text-purple-600", category:"IA",            rating:4.9, reviews:1830, installs:"40k+", price:"R$ 49/mês",    installed:true,  featured:true, badge:"Popular" },
  { id:"6",  name:"Power BI Connector",    desc:"Exporte dados do CRM para dashboards do Power BI em tempo real.",icon:BarChart3,   iconBg:"bg-amber-100 text-amber-600",   category:"Analytics",     rating:4.5, reviews:320,  installs:"8k+",  price:"R$ 29/mês",    installed:false },
  { id:"7",  name:"Google Calendar Sync",  desc:"Sincronize tarefas e reuniões com o Google Calendar.",          icon:Calendar,     iconBg:"bg-orange-100 text-orange-600", category:"Produtividade", rating:4.7, reviews:780,  installs:"35k+", price:"Grátis",       installed:true  },
  { id:"8",  name:"Auditoria & Compliance",desc:"Logs de auditoria, LGPD e controle avançado de acessos.",       icon:Shield,       iconBg:"bg-slate-100 text-slate-600",   category:"Segurança",     rating:4.8, reviews:290,  installs:"12k+", price:"R$ 79/mês",    installed:false },
  { id:"9",  name:"Slack Notificações",    desc:"Receba alertas de leads e vendas diretamente no Slack.",        icon:Bell,         iconBg:"bg-rose-100 text-rose-600",     category:"Produtividade", rating:4.6, reviews:540,  installs:"18k+", price:"Grátis",       installed:false },
  { id:"10", name:"Zapier Bridge",         desc:"Conecte o IDEA Atende com mais de 5.000 aplicativos.",          icon:Zap,          iconBg:"bg-amber-100 text-amber-600",   category:"Automação",     rating:4.5, reviews:410,  installs:"15k+", price:"Grátis",       installed:false },
  { id:"11", name:"E-commerce Tracker",   desc:"Integração com Shopify, WooCommerce e VTEX para rastrear pedidos.",icon:Package,   iconBg:"bg-teal-100 text-teal-600",     category:"Automação",     rating:4.4, reviews:230,  installs:"9k+",  price:"R$ 39/mês",    installed:false },
  { id:"12", name:"Telegram Bot",         desc:"Atendimento e notificações pelo Telegram com bot dedicado.",     icon:MessageSquare,iconBg:"bg-cyan-100 text-cyan-600",     category:"Mensagens",     rating:4.6, reviews:380,  installs:"14k+", price:"Grátis",       installed:true  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={10} className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

function InstallModal({ app, onClose, onInstall }: { app: App; onClose: () => void; onInstall: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={16} className="text-gray-400" />
        </button>
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl ${app.iconBg} flex items-center justify-center flex-shrink-0`}>
            <app.icon size={26} />
          </div>
          <div>
            <h3 className="font-bold text-[#111827] text-lg">{app.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Stars rating={app.rating} />
              <span className="text-xs text-gray-400">{app.rating} · {app.reviews.toLocaleString("pt-BR")} avaliações</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">{app.desc}</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Permissões necessárias</p>
          {["Leitura de conversas", "Criação de contatos", "Envio de mensagens"].map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm text-gray-600">
              <Check size={12} className="text-[#10B981]" /> {p}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#111827]">{app.price}</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
            <button onClick={onInstall} className="px-5 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors flex items-center gap-1.5">
              <Download size={14} /> Instalar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("Todos");
  const [list, setList]         = useState(apps);
  const [modal, setModal]       = useState<App | null>(null);

  const filtered = list.filter((a) =>
    (category === "Todos" || a.category === category) &&
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered.filter((a) => a.featured);

  function install(id: string) {
    setList((p) => p.map((a) => a.id === id ? { ...a, installed: true } : a));
    setModal(null);
  }

  function uninstall(id: string) {
    setList((p) => p.map((a) => a.id === id ? { ...a, installed: false } : a));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Marketplace" subtitle="Expanda o IDEA Atende com apps e integrações" />

      {modal && (
        <InstallModal
          app={modal}
          onClose={() => setModal(null)}
          onInstall={() => install(modal.id)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Search + filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar aplicativos..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-3 py-2 text-xs rounded-xl font-medium transition-colors",
                  category === c ? "bg-[#6C3BFF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && category === "Todos" && !search && (
          <div>
            <h3 className="font-semibold text-[#111827] mb-4">⭐ Destaques</h3>
            <div className="grid grid-cols-3 gap-4">
              {featured.map((app) => (
                <div key={app.id} className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-2xl p-5 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6C3BFF, transparent)", transform: "translate(30%,-30%)" }} />
                  <div className={`w-12 h-12 rounded-xl ${app.iconBg} flex items-center justify-center mb-3`}>
                    <app.icon size={22} />
                  </div>
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-bold text-base leading-tight">{app.name}</p>
                    {app.badge && <span className="text-[10px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-2">{app.badge}</span>}
                  </div>
                  <p className="text-white/60 text-xs mb-4 leading-relaxed">{app.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Stars rating={app.rating} />
                      <span className="text-white/50 text-[10px] ml-1">{app.rating}</span>
                    </div>
                    {app.installed ? (
                      <span className="flex items-center gap-1 text-xs text-[#10B981] bg-[#10B981]/20 px-2.5 py-1 rounded-full font-medium">
                        <Check size={10} /> Instalado
                      </span>
                    ) : (
                      <button onClick={() => setModal(app)} className="text-xs bg-[#6C3BFF] text-white px-3 py-1.5 rounded-xl hover:bg-[#5930e8] transition-colors font-medium">
                        Instalar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All apps */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#111827]">
              {category === "Todos" ? "Todos os aplicativos" : category}
              <span className="text-gray-400 font-normal ml-2 text-sm">({filtered.length})</span>
            </h3>
            <span className="text-xs text-gray-400">{list.filter((a) => a.installed).length} instalados</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-xl ${app.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <app.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-[#111827] truncate">{app.name}</p>
                      {app.badge && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">{app.badge}</span>}
                    </div>
                    <span className="text-[10px] text-gray-400">{app.category}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1">{app.desc}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Stars rating={app.rating} />
                    <span className="text-[10px] text-gray-400">{app.rating} ({app.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Download size={9} /> {app.installs}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-semibold", app.price === "Grátis" ? "text-[#10B981]" : "text-[#111827]")}>{app.price}</span>
                  {app.installed ? (
                    <button onClick={() => uninstall(app.id)} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                      <Check size={10} /> Instalado
                    </button>
                  ) : (
                    <button onClick={() => setModal(app)} className="text-xs bg-[#6C3BFF] text-white px-3 py-1.5 rounded-xl hover:bg-[#5930e8] transition-colors font-medium flex items-center gap-1">
                      <Download size={11} /> Instalar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
