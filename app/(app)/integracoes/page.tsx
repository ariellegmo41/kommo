"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare, Globe, Zap, DollarSign, BarChart3, Check, Plus,
  X, Store, ExternalLink, Sparkles, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInstalledApps, APP_UNLOCKS, INTEGRATION_TO_APP_ID } from "@/lib/installed-apps";

interface Integration {
  name: string;
  desc: string;
  icon: typeof Globe;
  color: string;
  category: string;
  apiKeyLabel?: string;
  oauthLabel?: string;
}

const integrations: Integration[] = [
  { name: "WhatsApp Business API", desc: "Integração oficial Meta — multi números e templates aprovados",       icon: MessageSquare, color: "bg-green-100 text-green-600",   category: "Mensagens",     apiKeyLabel: "Token de Acesso Meta" },
  { name: "Instagram Direct",      desc: "Mensagens e DMs via API oficial Meta",                                icon: MessageSquare, color: "bg-pink-100 text-pink-600",    category: "Mensagens",     oauthLabel: "Conectar conta Instagram" },
  { name: "Telegram",              desc: "Bot e canal Telegram para atendimento",                               icon: MessageSquare, color: "bg-blue-100 text-blue-600",    category: "Mensagens",     apiKeyLabel: "Token do Bot Telegram" },
  { name: "Google Calendar",       desc: "Sincronização de agenda, reuniões e eventos",                        icon: Globe,         color: "bg-orange-100 text-orange-600", category: "Produtividade", oauthLabel: "Conectar Google Calendar" },
  { name: "n8n",                   desc: "Automações e integrações com centenas de apps externos",             icon: Zap,           color: "bg-red-100 text-red-600",       category: "Automação",     apiKeyLabel: "URL + API Key do n8n" },
  { name: "Make (Integromat)",     desc: "Construção de fluxos avançados sem código",                          icon: Zap,           color: "bg-purple-100 text-purple-600", category: "Automação",     apiKeyLabel: "Webhook URL do Make" },
  { name: "Zapier",                desc: "Conecte com mais de 5.000 aplicativos via Zapier",                   icon: Zap,           color: "bg-amber-100 text-amber-600",   category: "Automação",     apiKeyLabel: "API Key do Zapier" },
  { name: "Stripe",                desc: "Pagamentos, assinaturas e checkout seguro",                          icon: DollarSign,    color: "bg-indigo-100 text-indigo-600", category: "Pagamentos",    apiKeyLabel: "Chave Secreta Stripe" },
  { name: "Mercado Pago",          desc: "PIX, boleto e cartão para o mercado brasileiro",                     icon: DollarSign,    color: "bg-blue-100 text-blue-700",     category: "Pagamentos",    apiKeyLabel: "Access Token Mercado Pago" },
  { name: "HubSpot",               desc: "Sincronização bidirecional com CRM HubSpot",                         icon: BarChart3,     color: "bg-orange-100 text-orange-600", category: "CRM",           apiKeyLabel: "API Key HubSpot" },
  { name: "Pipedrive",             desc: "Integração com funil e contatos do Pipedrive",                       icon: BarChart3,     color: "bg-teal-100 text-teal-600",     category: "CRM",           apiKeyLabel: "Token Pipedrive" },
  { name: "Webhook",               desc: "Envie e receba dados em tempo real via HTTP",                        icon: Globe,         color: "bg-gray-100 text-gray-600",     category: "API",           apiKeyLabel: "URL do Endpoint" },
];

const connectSteps = ["Validando credenciais...", "Estabelecendo conexão...", "Sincronizando dados..."];

const categories = ["Todas", "Mensagens", "Automação", "Pagamentos", "CRM", "Produtividade", "API"];

function ConnectModal({
  integration,
  appId,
  onClose,
  onConnect,
}: {
  integration: Integration;
  appId: string | null;
  onClose: () => void;
  onConnect: () => void;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<"form" | "connecting" | "success">("form");
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  const demoValues: Record<string, string> = {
    "Token de Acesso Meta":          "EAABsbCS...demo_token_bella_modas",
    "Conectar conta Instagram":      "bellamodas_oficial",
    "Token do Bot Telegram":         "7412345678:AAHxxxxxx_demo_token",
    "Conectar Google Calendar":      "carla@bellamodas.com.br",
    "URL + API Key do n8n":          "https://n8n.bellamodas.com/webhook/...",
    "Webhook URL do Make":           "https://hook.eu1.make.com/xxxxx",
    "API Key do Zapier":             "zap_key_bella_modas_xxxx",
    "Chave Secreta Stripe":          "sk_live_...bella_modas_stripe",
    "Access Token Mercado Pago":     "APP_USR-xxxx-bella-modas-token",
    "API Key HubSpot":               "pat-na1-xxxx-bella-modas-hub",
    "Token Pipedrive":               "xxxx_bella_modas_pipe_token",
    "URL do Endpoint":               "https://api.bellamodas.com.br/webhook",
  };

  const fieldLabel = integration.apiKeyLabel ?? integration.oauthLabel ?? "Credencial";
  const demoValue = demoValues[fieldLabel] ?? "demo_credential_bella_modas";

  function startConnect() {
    setPhase("connecting");
    setProgress(0);
    setStepIdx(0);

    let p = 0;
    const tick = () => {
      p = Math.min(p + 3, 100);
      setProgress(p);
      setStepIdx(p < 33 ? 0 : p < 66 ? 1 : 2);
      if (p < 100) {
        setTimeout(tick, 25);
      } else {
        setTimeout(() => {
          onConnect();
          setPhase("success");
        }, 200);
      }
    };
    setTimeout(tick, 60);
  }

  const unlocks = appId ? APP_UNLOCKS[appId] ?? [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={phase === "success" ? onClose : undefined} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[460px] overflow-hidden">

        {/* Form phase */}
        {phase === "form" && (
          <div className="p-6">
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-12 h-12 rounded-xl ${integration.color} flex items-center justify-center flex-shrink-0`}>
                <integration.icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">Conectar {integration.name}</h3>
                <p className="text-xs text-gray-400">{integration.category}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-5">{integration.desc}</p>

            <div className="space-y-3 mb-5">
              {integration.oauthLabel ? (
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{integration.oauthLabel}</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                    <Globe size={14} className="text-gray-400" />
                    <span className="flex-1">{demoValue}</span>
                    <span className="text-[10px] text-[#10B981] font-medium bg-green-50 px-1.5 py-0.5 rounded-full">Autenticado</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{fieldLabel}</label>
                  <input
                    type="text"
                    defaultValue={demoValue}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 font-mono text-xs"
                  />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Ambiente</label>
                <select className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20">
                  <option>Produção</option>
                  <option>Sandbox (teste)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
              <button onClick={startConnect} className="flex-1 px-4 py-2.5 bg-[#6C3BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5930e8] transition-colors flex items-center justify-center gap-1.5">
                <Plus size={14} /> Conectar agora
              </button>
            </div>
          </div>
        )}

        {/* Connecting phase */}
        {phase === "connecting" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl ${integration.color} flex items-center justify-center flex-shrink-0`}>
                <integration.icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">{integration.name}</h3>
                <p className="text-xs text-gray-400">Conectando ao IDEA Atende...</p>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{connectSteps[stepIdx]}</span>
                <span className="text-sm font-bold text-[#6C3BFF]">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#10B981] to-[#6C3BFF] rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="space-y-2.5">
              {connectSteps.map((step, i) => {
                const done = i < stepIdx;
                const current = i === stepIdx;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                      done ? "bg-[#10B981]" : current ? "bg-[#6C3BFF] animate-pulse" : "bg-gray-100"
                    )}>
                      {done ? <Check size={10} className="text-white" /> : <span className={cn("w-1.5 h-1.5 rounded-full", current ? "bg-white" : "bg-gray-300")} />}
                    </div>
                    <span className={cn("text-sm", done ? "text-gray-400 line-through" : current ? "text-[#111827] font-medium" : "text-gray-400")}>{step}</span>
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
            <h3 className="font-bold text-[#111827] text-xl mb-1">Conexão estabelecida!</h3>
            <p className="text-sm text-gray-400 mb-5">{integration.name} está ativo e sincronizado.</p>

            {unlocks.length > 0 && (
              <div className="bg-[#6C3BFF]/5 border border-[#6C3BFF]/15 rounded-xl p-4 mb-5 text-left">
                <p className="text-xs font-semibold text-[#6C3BFF] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Sparkles size={11} /> Recursos habilitados
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

            <button onClick={onClose} className="w-full px-4 py-2.5 bg-[#6C3BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5930e8] transition-colors">
              Concluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IntegracoesPage() {
  const router = useRouter();
  const { installedIds, installApp } = useInstalledApps();
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [modal, setModal] = useState<Integration | null>(null);
  const [connectedExtras, setConnectedExtras] = useState<Set<string>>(new Set(["Instagram Direct", "Webhook"]));

  const filtered = integrations.filter(
    (i) => categoryFilter === "Todas" || i.category === categoryFilter
  );

  function isConnected(name: string) {
    const appId = INTEGRATION_TO_APP_ID[name];
    const viaMarketplace = appId ? installedIds.has(appId) : false;
    return viaMarketplace || connectedExtras.has(name);
  }

  function handleConnect(integration: Integration) {
    const appId = INTEGRATION_TO_APP_ID[integration.name];
    if (appId && !installedIds.has(appId)) {
      installApp(appId);
    }
    setConnectedExtras((prev) => new Set(prev).add(integration.name));
    setModal(null);
  }

  function isViaMarketplace(name: string) {
    const appId = INTEGRATION_TO_APP_ID[name];
    return appId ? installedIds.has(appId) : false;
  }

  const connectedCount = integrations.filter((i) => isConnected(i.name)).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Integrações" subtitle={`${connectedCount} ativas · conecte o IDEA Atende com suas ferramentas`} />

      {modal && (
        <ConnectModal
          integration={modal}
          appId={INTEGRATION_TO_APP_ID[modal.name] ?? null}
          onClose={() => setModal(null)}
          onConnect={() => handleConnect(modal)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-xl font-medium transition-colors",
                categoryFilter === c ? "bg-[#6C3BFF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Integrações Ativas",     value: connectedCount,                      color: "text-[#10B981]" },
            { label: "Apps do Marketplace",    value: installedIds.size,                   color: "text-[#6C3BFF]" },
            { label: "Disponíveis para Conectar", value: integrations.length - connectedCount, color: "text-gray-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Integrations grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((int) => {
            const connected = isConnected(int.name);
            const viaMarket = isViaMarketplace(int.name);
            const appId = INTEGRATION_TO_APP_ID[int.name];
            const hasMarketplaceApp = !!appId;
            const notInstalled = hasMarketplaceApp && !installedIds.has(appId);

            return (
              <div
                key={int.name}
                className={cn(
                  "bg-white rounded-xl p-4 shadow-sm border flex flex-col gap-3 transition-all",
                  connected ? "border-[#10B981]/30" : "border-gray-100"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${int.color} flex items-center justify-center flex-shrink-0`}>
                    <int.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-medium text-[#111827] text-sm">{int.name}</p>
                      {connected && (
                        <span className="flex items-center gap-1 text-[10px] text-[#10B981] bg-green-50 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                          <Check size={8} /> Ativo
                        </span>
                      )}
                      {viaMarket && (
                        <span className="flex items-center gap-1 text-[10px] text-[#6C3BFF] bg-[#6C3BFF]/10 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                          <Store size={8} /> Marketplace
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{int.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {connected ? (
                    <button className="flex-1 text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                      Configurar
                    </button>
                  ) : notInstalled ? (
                    <button
                      onClick={() => router.push("/marketplace")}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg font-medium border border-[#6C3BFF] text-[#6C3BFF] hover:bg-[#6C3BFF]/5 transition-colors flex items-center justify-center gap-1"
                    >
                      <Store size={11} /> Instalar no Marketplace <ArrowRight size={11} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setModal(int)}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg font-medium bg-[#6C3BFF] text-white hover:bg-[#5930e8] transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus size={11} /> Conectar
                    </button>
                  )}
                  {connected && (
                    <button className="p-1.5 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-lg transition-colors">
                      <ExternalLink size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
