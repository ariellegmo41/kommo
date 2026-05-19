"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Star, Download, Check, X, Globe, Zap, DollarSign,
  MessageSquare, BarChart3, Bot, Shield, Bell, Calendar, Package,
  ArrowRight, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInstalledApps, APP_UNLOCKS } from "@/lib/installed-apps";

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
  featured?: boolean;
  badge?: string;
  permissions: string[];
}

const apps: App[] = [
  { id:"1",  name:"WhatsApp Business API", desc:"Integração oficial Meta com multi-número e templates aprovados.", icon:MessageSquare, iconBg:"bg-green-100 text-green-600",   category:"Mensagens",     rating:4.9, reviews:1240, installs:"50k+", price:"Grátis",    featured:true, badge:"Oficial",  permissions:["Leitura de conversas","Envio de mensagens","Gestão de templates"] },
  { id:"2",  name:"Stripe Payments",       desc:"Aceite pagamentos e gerencie assinaturas diretamente no CRM.",  icon:DollarSign,   iconBg:"bg-indigo-100 text-indigo-600", category:"Pagamentos",    rating:4.8, reviews:892,  installs:"30k+", price:"Grátis",    permissions:["Criação de cobranças","Leitura de pedidos","Webhooks de pagamento"] },
  { id:"3",  name:"n8n Automações",        desc:"Crie fluxos avançados conectando centenas de apps externos.",   icon:Zap,          iconBg:"bg-red-100 text-red-600",       category:"Automação",     rating:4.7, reviews:643,  installs:"20k+", price:"Grátis",    featured:true,                    permissions:["Leitura de leads","Criação de automações","Acesso à API"] },
  { id:"4",  name:"Mercado Pago",          desc:"Pagamentos via PIX, boleto e cartão para o mercado brasileiro.",icon:DollarSign,   iconBg:"bg-blue-100 text-blue-600",     category:"Pagamentos",    rating:4.6, reviews:512,  installs:"25k+", price:"Grátis",    permissions:["Criação de cobranças PIX","Emissão de boletos","Leitura de pagamentos"] },
  { id:"5",  name:"GPT-4o IA Agent",       desc:"Agente de IA avançado para qualificação e atendimento.",        icon:Bot,          iconBg:"bg-purple-100 text-purple-600", category:"IA",            rating:4.9, reviews:1830, installs:"40k+", price:"R$ 49/mês", featured:true, badge:"Popular",  permissions:["Leitura de conversas","Envio de mensagens","Acesso ao módulo IA"] },
  { id:"6",  name:"Power BI Connector",    desc:"Exporte dados do CRM para dashboards do Power BI em tempo real.",icon:BarChart3,   iconBg:"bg-amber-100 text-amber-600",   category:"Analytics",     rating:4.5, reviews:320,  installs:"8k+",  price:"R$ 29/mês", permissions:["Leitura de relatórios","Exportação de dados","Acesso ao Analytics"] },
  { id:"7",  name:"Google Calendar Sync",  desc:"Sincronize tarefas e reuniões com o Google Calendar.",          icon:Calendar,     iconBg:"bg-orange-100 text-orange-600", category:"Produtividade", rating:4.7, reviews:780,  installs:"35k+", price:"Grátis",    permissions:["Leitura do calendário","Criação de eventos","Acesso à agenda"] },
  { id:"8",  name:"Auditoria & Compliance",desc:"Logs de auditoria, LGPD e controle avançado de acessos.",       icon:Shield,       iconBg:"bg-slate-100 text-slate-600",   category:"Segurança",     rating:4.8, reviews:290,  installs:"12k+", price:"R$ 79/mês", permissions:["Leitura de logs","Relatórios de conformidade","Gestão de acessos"] },
  { id:"9",  name:"Slack Notificações",    desc:"Receba alertas de leads e vendas diretamente no Slack.",        icon:Bell,         iconBg:"bg-rose-100 text-rose-600",     category:"Produtividade", rating:4.6, reviews:540,  installs:"18k+", price:"Grátis",    permissions:["Envio de notificações","Leitura de eventos","Acesso a webhooks"] },
  { id:"10", name:"Zapier Bridge",         desc:"Conecte o IDEA Atende com mais de 5.000 aplicativos.",          icon:Zap,          iconBg:"bg-amber-100 text-amber-600",   category:"Automação",     rating:4.5, reviews:410,  installs:"15k+", price:"Grátis",    permissions:["Leitura de leads","Criação de automações","Acesso à API"] },
  { id:"11", name:"E-commerce Tracker",   desc:"Integração com Shopify, WooCommerce e VTEX para rastrear pedidos.",icon:Package,   iconBg:"bg-teal-100 text-teal-600",     category:"Automação",     rating:4.4, reviews:230,  installs:"9k+",  price:"R$ 39/mês", permissions:["Leitura de pedidos","Atualização de estoque","Rastreamento de entregas"] },
  { id:"12", name:"Telegram Bot",         desc:"Atendimento e notificações pelo Telegram com bot dedicado.",     icon:MessageSquare,iconBg:"bg-cyan-100 text-cyan-600",     category:"Mensagens",     rating:4.6, reviews:380,  installs:"14k+", price:"Grátis",    permissions:["Envio de mensagens","Leitura de conversas","Gestão de bot"] },
];

const installSteps = [
  "Verificando compatibilidade...",
  "Configurando permissões...",
  "Conectando ao serviço...",
  "Finalizando instalação...",
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

function InstallModal({
  app, onClose, onInstall,
}: {
  app: App; onClose: () => void; onInstall: () => void;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"review" | "installing" | "success">("review");
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  function startInstall() {
    setPhase("installing");
    setProgress(0);
    setStepIdx(0);

    let p = 0;
    const tick = () => {
      p = Math.min(p + 2, 100);
      setProgress(p);
      setStepIdx(p < 25 ? 0 : p < 50 ? 1 : p < 75 ? 2 : 3);
      if (p < 100) {
        setTimeout(tick, 28);
      } else {
        setTimeout(() => {
          onInstall();
          setPhase("success");
        }, 200);
      }
    };
    setTimeout(tick, 80);
  }

  const unlocks = APP_UNLOCKS[app.id] ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={phase === "success" ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden">

        {/* Review phase */}
        {phase === "review" && (
          <div className="p-6">
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
                <span className="text-xs text-gray-400">{app.installs} instalações</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{app.desc}</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Permissões necessárias</p>
              {app.permissions.map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={12} className="text-[#10B981] flex-shrink-0" /> {p}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className={cn("text-sm font-semibold", app.price === "Grátis" ? "text-[#10B981]" : "text-[#111827]")}>{app.price}</span>
              <div className="flex gap-2">
                <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
                <button onClick={startInstall} className="px-5 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors flex items-center gap-1.5">
                  <Download size={14} /> Instalar agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Installing phase */}
        {phase === "installing" && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl ${app.iconBg} flex items-center justify-center flex-shrink-0`}>
                <app.icon size={26} />
              </div>
              <div>
                <h3 className="font-bold text-[#111827] text-lg">{app.name}</h3>
                <p className="text-xs text-gray-400">Instalando no IDEA Atende...</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{installSteps[stepIdx]}</span>
                <span className="text-sm font-bold text-[#6C3BFF]">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6C3BFF] to-[#7B61FF] rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2.5">
              {installSteps.map((step, i) => {
                const done = i < stepIdx;
                const current = i === stepIdx;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                      done ? "bg-[#10B981]" : current ? "bg-[#6C3BFF] animate-pulse" : "bg-gray-100"
                    )}>
                      {done
                        ? <Check size={10} className="text-white" />
                        : <span className={cn("w-1.5 h-1.5 rounded-full", current ? "bg-white" : "bg-gray-300")} />}
                    </div>
                    <span className={cn("text-sm", done ? "text-gray-500 line-through" : current ? "text-[#111827] font-medium" : "text-gray-400")}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Success phase */}
        {phase === "success" && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center">
                <Check size={24} className="text-white" strokeWidth={3} />
              </div>
            </div>
            <h3 className="font-bold text-[#111827] text-xl mb-1">Instalado com sucesso!</h3>
            <p className="text-sm text-gray-400 mb-5">{app.name} está ativo e pronto para uso.</p>

            {unlocks.length > 0 && (
              <div className="bg-[#6C3BFF]/5 border border-[#6C3BFF]/15 rounded-xl p-4 mb-5 text-left">
                <p className="text-xs font-semibold text-[#6C3BFF] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Sparkles size={11} /> O que foi habilitado
                </p>
                <div className="space-y-2">
                  {unlocks.map((u) => (
                    <div key={u} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check size={12} className="text-[#10B981] flex-shrink-0" /> {u}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => router.push("/integracoes")}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-[#6C3BFF] text-[#6C3BFF] rounded-xl text-sm font-medium hover:bg-[#6C3BFF]/5 transition-colors"
              >
                Ver em Integrações <ArrowRight size={14} />
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-[#6C3BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5930e8] transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const { installedIds, installApp, uninstallApp } = useInstalledApps();
  const [search, setSearch]   = useState("");
  const [category, setCategory] = useState("Todos");
  const [modal, setModal]     = useState<App | null>(null);

  const list = apps.map((a) => ({ ...a, installed: installedIds.has(a.id) }));

  const filtered = list.filter((a) =>
    (category === "Todos" || a.category === category) &&
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered.filter((a) => a.featured);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Marketplace" subtitle="Expanda o IDEA Atende com apps e integrações" />

      {modal && (
        <InstallModal
          app={modal}
          onClose={() => setModal(null)}
          onInstall={() => installApp(modal.id)}
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
            <h3 className="font-semibold text-[#111827] mb-4">Destaques</h3>
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
            <span className="text-xs text-gray-400">{installedIds.size} instalados</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((app) => (
              <div key={app.id} className={cn(
                "bg-white rounded-2xl p-4 shadow-sm border hover:shadow-md transition-all flex flex-col",
                app.installed ? "border-[#10B981]/30 bg-[#10B981]/5" : "border-gray-100"
              )}>
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
                    <button
                      onClick={() => uninstallApp(app.id)}
                      className="flex items-center gap-1 text-xs bg-[#10B981]/10 text-[#10B981] px-3 py-1.5 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors font-medium border border-[#10B981]/20"
                    >
                      <Check size={10} /> Instalado
                    </button>
                  ) : (
                    <button
                      onClick={() => setModal(app)}
                      className="text-xs bg-[#6C3BFF] text-white px-3 py-1.5 rounded-xl hover:bg-[#5930e8] transition-colors font-medium flex items-center gap-1"
                    >
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
