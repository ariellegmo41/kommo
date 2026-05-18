"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import {
  Code2, Key, Globe, Copy, Plus, Trash2, Eye, EyeOff,
  ChevronDown, ChevronRight, CheckCircle, AlertCircle, Clock,
  Terminal, BookOpen, Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Chaves de API", "Referência", "Webhooks", "Logs"] as const;
type Tab = typeof tabs[number];

/* ── API Keys ── */
const initialKeys = [
  { id: "1", name: "Produção",           key: "ia_live_sk_4xK9mQ2rB8nL7pT3vC5wZ1jY6hF0dA",  created: "01/05/2026", lastUsed: "Hoje",     scope: "full",     active: true  },
  { id: "2", name: "Desenvolvimento",    key: "ia_test_sk_8mR4pN1kJ5qX2wB9vL3cY7hT0dF6zA",  created: "10/04/2026", lastUsed: "Ontem",    scope: "read",     active: true  },
  { id: "3", name: "Integração n8n",    key: "ia_live_sk_2cW7tK9nM4jB6rX1vP8qZ5hY3dL0fA",  created: "20/03/2026", lastUsed: "3 dias",   scope: "webhook",  active: false },
];

/* ── Endpoints ── */
const endpoints = [
  {
    group: "Conversas", color: "text-green-600 bg-green-50",
    items: [
      { method: "GET",    path: "/v1/conversations",          desc: "Listar conversas" },
      { method: "GET",    path: "/v1/conversations/{id}",     desc: "Buscar conversa por ID" },
      { method: "POST",   path: "/v1/conversations",          desc: "Criar nova conversa" },
      { method: "PATCH",  path: "/v1/conversations/{id}",     desc: "Atualizar conversa" },
    ],
  },
  {
    group: "Leads", color: "text-blue-600 bg-blue-50",
    items: [
      { method: "GET",    path: "/v1/leads",                  desc: "Listar leads com filtros" },
      { method: "POST",   path: "/v1/leads",                  desc: "Criar lead" },
      { method: "PATCH",  path: "/v1/leads/{id}",             desc: "Atualizar lead" },
      { method: "DELETE", path: "/v1/leads/{id}",             desc: "Remover lead" },
    ],
  },
  {
    group: "Mensagens", color: "text-purple-600 bg-purple-50",
    items: [
      { method: "POST",   path: "/v1/messages/send",          desc: "Enviar mensagem" },
      { method: "GET",    path: "/v1/messages/{conv_id}",     desc: "Histórico de mensagens" },
    ],
  },
  {
    group: "Automações", color: "text-amber-600 bg-amber-50",
    items: [
      { method: "GET",    path: "/v1/automations",            desc: "Listar automações" },
      { method: "POST",   path: "/v1/automations/{id}/trigger", desc: "Disparar automação" },
    ],
  },
  {
    group: "Analytics", color: "text-rose-600 bg-rose-50",
    items: [
      { method: "GET",    path: "/v1/analytics/overview",     desc: "KPIs gerais" },
      { method: "GET",    path: "/v1/analytics/funnel",       desc: "Dados do funil" },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET:    "bg-green-100 text-green-700",
  POST:   "bg-blue-100 text-blue-700",
  PATCH:  "bg-amber-100 text-amber-700",
  DELETE: "bg-rose-100 text-rose-700",
};

/* ── Webhooks ── */
const initialWebhooks = [
  { id: "1", url: "https://n8n.empresa.com/webhook/crm",          events: ["lead.created", "conversation.new"],     active: true,  lastHit: "2 min" },
  { id: "2", url: "https://zapier.com/hooks/catch/xyz123",        events: ["deal.closed", "lead.qualified"],        active: true,  lastHit: "1h" },
  { id: "3", url: "https://api.empresa.com/webhooks/idea-atende", events: ["message.sent", "conversation.resolved"],active: false, lastHit: "3 dias" },
];

const allEvents = ["lead.created","lead.qualified","lead.scored","conversation.new","conversation.resolved","message.sent","message.received","deal.closed","deal.moved","automation.triggered"];

/* ── Logs ── */
const logs = [
  { id:"1", time:"14:32:18", method:"POST",   path:"/v1/messages/send",        status:200, ms:142, key:"Produção"       },
  { id:"2", time:"14:31:55", method:"GET",    path:"/v1/leads?score=80",        status:200, ms:88,  key:"Produção"       },
  { id:"3", time:"14:29:10", method:"PATCH",  path:"/v1/leads/ld_4X2k",        status:200, ms:195, key:"Desenvolvimento" },
  { id:"4", time:"14:25:44", method:"POST",   path:"/v1/conversations",         status:201, ms:230, key:"Integração n8n" },
  { id:"5", time:"14:20:02", method:"GET",    path:"/v1/analytics/overview",   status:200, ms:310, key:"Produção"       },
  { id:"6", time:"14:18:31", method:"DELETE", path:"/v1/leads/ld_7Z9m",        status:404, ms:55,  key:"Desenvolvimento" },
  { id:"7", time:"14:15:09", method:"POST",   path:"/v1/automations/at_1/trigger",status:200,ms:88,key:"Produção"       },
];

const codeExamples: Record<string, string> = {
  curl: `curl -X GET "https://api.ideaatende.com/v1/leads" \\
  -H "Authorization: Bearer ia_live_sk_4xK9..." \\
  -H "Content-Type: application/json" \\
  -d '{"status": "qualified", "limit": 50}'`,
  node: `import IDEAAtende from '@idea-atende/sdk';

const client = new IDEAAtende({
  apiKey: process.env.IDEA_API_KEY,
});

const leads = await client.leads.list({
  status: 'qualified',
  limit: 50,
});

console.log(leads.data);`,
  python: `from idea_atende import IDEAAtende

client = IDEAAtende(api_key=os.environ.get("IDEA_API_KEY"))

leads = client.leads.list(
    status="qualified",
    limit=50,
)

print(leads.data)`,
};

export default function APIPage() {
  const [tab, setTab]         = useState<Tab>("Chaves de API");
  const [keys, setKeys]       = useState(initialKeys);
  const [webhooks, setWebhooks] = useState(initialWebhooks);
  const [revealId, setRevealId] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>("Conversas");
  const [codeLang, setCodeLang]   = useState("curl");

  function maskKey(k: string) {
    return k.slice(0, 12) + "•".repeat(20) + k.slice(-4);
  }

  function copyKey(k: string) {
    navigator.clipboard.writeText(k).catch(() => {});
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="API Pública" subtitle="Integre o IDEA Atende com qualquer sistema" />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-1 flex-shrink-0">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              tab === t ? "border-[#6C3BFF] text-[#6C3BFF]" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "Chaves de API" && <Key size={13} />}
            {t === "Referência"   && <BookOpen size={13} />}
            {t === "Webhooks"     && <Webhook size={13} />}
            {t === "Logs"         && <Terminal size={13} />}
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* ── CHAVES DE API ── */}
        {tab === "Chaves de API" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              {/* Hero */}
              <div className="bg-gradient-to-r from-[#111827] to-[#1f2937] rounded-2xl p-5 text-white flex items-center gap-5">
                <div className="w-12 h-12 bg-[#6C3BFF]/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Key size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-base">IDEA Atende API v1</p>
                  <p className="text-white/60 text-xs mt-0.5">Base URL: <span className="text-white/80 font-mono">https://api.ideaatende.com</span></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{logs.filter(l => l.status < 400).length * 180}<span className="text-sm font-normal text-white/60">/dia</span></p>
                  <p className="text-white/50 text-xs">Requisições hoje</p>
                </div>
              </div>

              {/* Keys */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <p className="font-semibold text-[#111827]">Chaves de API</p>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors">
                    <Plus size={13} /> Nova chave
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {keys.map((k) => (
                    <div key={k.id} className="px-5 py-4 flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${k.active ? "bg-[#10B981]" : "bg-gray-300"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-[#111827]">{k.name}</p>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{k.scope}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded-lg">
                            {revealId === k.id ? k.key : maskKey(k.key)}
                          </code>
                          <button onClick={() => setRevealId(revealId === k.id ? null : k.id)} className="text-gray-400 hover:text-gray-600">
                            {revealId === k.id ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                          <button onClick={() => copyKey(k.key)} className="text-gray-400 hover:text-[#6C3BFF] transition-colors"><Copy size={12} /></button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Criada {k.created} · Último uso: {k.lastUsed}</p>
                      </div>
                      <button onClick={() => setKeys((p) => p.filter((x) => x.id !== k.id))} className="text-gray-300 hover:text-rose-500 transition-colors flex-shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rate limits */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-4">Rate Limits</p>
                <div className="space-y-3">
                  {[
                    { label: "Por minuto",  used: 42,  limit: 60  },
                    { label: "Por hora",    used: 380, limit: 1000 },
                    { label: "Por dia",     used: 1260, limit: 10000 },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{r.label}</span>
                        <span className="font-medium text-[#111827]">{r.used} / {r.limit}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2">
                        <div
                          className={cn("h-2 rounded-full transition-all", (r.used / r.limit) > 0.8 ? "bg-rose-500" : "bg-[#6C3BFF]")}
                          style={{ width: `${(r.used / r.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-3">Exemplos de código</p>
                <div className="flex gap-1 mb-3">
                  {["curl", "node", "python"].map((lang) => (
                    <button key={lang} onClick={() => setCodeLang(lang)} className={cn("px-2.5 py-1 text-xs rounded-lg font-mono font-medium transition-colors", codeLang === lang ? "bg-[#111827] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200")}>
                      {lang}
                    </button>
                  ))}
                </div>
                <pre className="bg-[#111827] rounded-xl p-3 text-[10px] text-green-300 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                  {codeExamples[codeLang]}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ── REFERÊNCIA ── */}
        {tab === "Referência" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <Globe size={16} className="text-[#6C3BFF]" />
                <code className="text-sm text-gray-600 font-mono flex-1">https://api.ideaatende.com</code>
                <button onClick={() => navigator.clipboard.writeText("https://api.ideaatende.com").catch(() => {})} className="text-gray-400 hover:text-[#6C3BFF] transition-colors"><Copy size={14} /></button>
              </div>

              {endpoints.map((group) => (
                <div key={group.group} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenGroup(openGroup === group.group ? null : group.group)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${group.color}`}>{group.group}</span>
                      <span className="text-xs text-gray-400">{group.items.length} endpoints</span>
                    </div>
                    {openGroup === group.group ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                  </button>
                  {openGroup === group.group && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {group.items.map((ep) => (
                        <div key={ep.path} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono flex-shrink-0 ${methodColors[ep.method]}`}>{ep.method}</span>
                          <code className="text-sm text-gray-600 font-mono flex-1">{ep.path}</code>
                          <span className="text-xs text-gray-400">{ep.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick test */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-3">Testar endpoint</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Método + URL</label>
                    <div className="flex gap-1">
                      <select className="px-2 py-2 text-xs bg-gray-50 border border-gray-200 rounded-l-xl focus:outline-none font-mono">
                        <option>GET</option><option>POST</option><option>PATCH</option><option>DELETE</option>
                      </select>
                      <input defaultValue="/v1/leads" className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-r-xl focus:outline-none font-mono border-l-0" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Body (JSON)</label>
                    <textarea rows={4} placeholder='{"status": "qualified"}' className="w-full px-3 py-2 text-xs bg-[#111827] text-green-300 font-mono border border-gray-200 rounded-xl focus:outline-none resize-none" />
                  </div>
                  <button className="w-full py-2.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors flex items-center justify-center gap-2">
                    <Code2 size={14} /> Executar
                  </button>
                </div>
                <div className="mt-3 bg-[#111827] rounded-xl p-3">
                  <p className="text-[10px] text-green-300 font-mono">HTTP 200 OK — 88ms</p>
                  <pre className="text-[10px] text-green-200 font-mono mt-1 whitespace-pre-wrap">{`{"data": [...], "total": 1432}`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── WEBHOOKS ── */}
        {tab === "Webhooks" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#111827]">Webhooks configurados</h3>
                <p className="text-xs text-gray-400 mt-0.5">Receba eventos em tempo real no seu sistema</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors">
                <Plus size={13} /> Novo webhook
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                {webhooks.map((wh) => (
                  <div key={wh.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <Webhook size={15} className={wh.active ? "text-[#6C3BFF] mt-0.5 flex-shrink-0" : "text-gray-300 mt-0.5 flex-shrink-0"} />
                        <div className="min-w-0">
                          <p className="text-sm font-mono text-gray-700 truncate">{wh.url}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Último envio: {wh.lastHit}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <button
                          onClick={() => setWebhooks((p) => p.map((w) => w.id === wh.id ? { ...w, active: !w.active } : w))}
                          className={cn("w-9 h-5 rounded-full transition-colors relative", wh.active ? "bg-[#6C3BFF]" : "bg-gray-200")}
                        >
                          <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", wh.active ? "translate-x-4" : "translate-x-0.5")} />
                        </button>
                        <button onClick={() => setWebhooks((p) => p.filter((w) => w.id !== wh.id))} className="text-gray-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map((ev) => (
                        <span key={ev} className="text-[10px] bg-[#6C3BFF]/10 text-[#6C3BFF] px-2 py-0.5 rounded-full font-mono">{ev}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Events */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-4">Eventos disponíveis</p>
                <div className="space-y-1.5">
                  {allEvents.map((ev) => (
                    <div key={ev} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <code className="text-xs font-mono text-gray-600">{ev}</code>
                      <button className="text-[10px] text-[#6C3BFF] hover:underline">+ Adicionar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LOGS ── */}
        {tab === "Logs" && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total hoje",    value: "1.260", icon: Terminal,      color: "text-[#6C3BFF]" },
                { label: "Sucesso",       value: "1.248", icon: CheckCircle,   color: "text-[#10B981]" },
                { label: "Erros",         value: "12",    icon: AlertCircle,   color: "text-rose-500"  },
                { label: "Latência média",value: "142ms", icon: Clock,         color: "text-amber-500" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <s.icon size={18} className={`${s.color} mb-2`} />
                  <p className="text-xl font-bold text-[#111827]">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="font-semibold text-[#111827]">Request logs</p>
                <span className="text-xs text-gray-400">Últimas 24h</span>
              </div>
              <div className="bg-[#0d1117] font-mono text-xs">
                {/* Header */}
                <div className="flex items-center gap-4 px-5 py-2.5 border-b border-white/5 text-gray-500 text-[10px] uppercase tracking-wider">
                  <span className="w-16">Hora</span>
                  <span className="w-14">Método</span>
                  <span className="flex-1">Endpoint</span>
                  <span className="w-12 text-right">Status</span>
                  <span className="w-14 text-right">Tempo</span>
                  <span className="w-24">Chave</span>
                </div>
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-4 px-5 py-2.5 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <span className="w-16 text-gray-500">{log.time}</span>
                    <span className={`w-14 ${methodColors[log.method]} text-[10px] px-1.5 py-0.5 rounded font-bold`}>{log.method}</span>
                    <span className="flex-1 text-gray-300 truncate">{log.path}</span>
                    <span className={cn("w-12 text-right font-bold", log.status < 300 ? "text-[#10B981]" : log.status < 400 ? "text-amber-400" : "text-rose-400")}>
                      {log.status}
                    </span>
                    <span className="w-14 text-right text-gray-500">{log.ms}ms</span>
                    <span className="w-24 text-gray-500 truncate text-[10px]">{log.key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
