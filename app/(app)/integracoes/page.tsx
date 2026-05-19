"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare, Globe, Zap, DollarSign, BarChart3, Check, Plus,
  X, Store, ExternalLink, Sparkles, ArrowRight, Eye, EyeOff,
  Copy, RefreshCw, CheckCircle2, AlertCircle, Wifi, WifiOff,
  Settings, Webhook, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInstalledApps, APP_UNLOCKS, INTEGRATION_TO_APP_ID } from "@/lib/installed-apps";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Integration {
  name: string;
  desc: string;
  icon: typeof Globe;
  color: string;
  category: string;
}

interface FieldDef {
  label: string;
  value: string;
  type: "text" | "password" | "readonly" | "select" | "url";
  hint?: string;
  options?: string[];
}

interface WebhookEvent {
  event: string;
  desc: string;
  active: boolean;
}

interface LogEntry {
  time: string;
  msg: string;
  ok: boolean;
}

interface StatEntry {
  label: string;
  value: string;
}

interface IntegCfg {
  fields: FieldDef[];
  webhookUrl: string;
  webhookEvents: WebhookEvent[];
  logs: LogEntry[];
  stats: StatEntry[];
}

// ─── Integration list ────────────────────────────────────────────────────────

const integrations: Integration[] = [
  { name: "WhatsApp Business API", desc: "Integração oficial Meta — multi números e templates aprovados",  icon: MessageSquare, color: "bg-green-100 text-green-600",   category: "Mensagens"     },
  { name: "Instagram Direct",      desc: "Mensagens e DMs via API oficial Meta",                           icon: MessageSquare, color: "bg-pink-100 text-pink-600",    category: "Mensagens"     },
  { name: "Telegram",              desc: "Bot e canal Telegram para atendimento",                          icon: MessageSquare, color: "bg-blue-100 text-blue-600",    category: "Mensagens"     },
  { name: "Google Calendar",       desc: "Sincronização de agenda, reuniões e eventos",                   icon: Globe,         color: "bg-orange-100 text-orange-600", category: "Produtividade" },
  { name: "n8n",                   desc: "Automações e integrações com centenas de apps externos",        icon: Zap,           color: "bg-red-100 text-red-600",       category: "Automação"     },
  { name: "Make (Integromat)",     desc: "Construção de fluxos avançados sem código",                     icon: Zap,           color: "bg-purple-100 text-purple-600", category: "Automação"     },
  { name: "Zapier",                desc: "Conecte com mais de 5.000 aplicativos",                         icon: Zap,           color: "bg-amber-100 text-amber-600",   category: "Automação"     },
  { name: "Stripe",                desc: "Pagamentos, assinaturas e checkout seguro",                     icon: DollarSign,    color: "bg-indigo-100 text-indigo-600", category: "Pagamentos"    },
  { name: "Mercado Pago",          desc: "PIX, boleto e cartão para o mercado brasileiro",                icon: DollarSign,    color: "bg-blue-100 text-blue-700",     category: "Pagamentos"    },
  { name: "HubSpot",               desc: "Sincronização bidirecional com CRM HubSpot",                   icon: BarChart3,     color: "bg-orange-100 text-orange-600", category: "CRM"           },
  { name: "Pipedrive",             desc: "Integração com funil e contatos do Pipedrive",                  icon: BarChart3,     color: "bg-teal-100 text-teal-600",     category: "CRM"           },
  { name: "Webhook",               desc: "Envie e receba dados em tempo real via HTTP",                   icon: Globe,         color: "bg-gray-100 text-gray-600",     category: "API"           },
];

// ─── Per-integration configuration data ─────────────────────────────────────

const CONFIGS: Record<string, IntegCfg> = {
  "WhatsApp Business API": {
    fields: [
      { label: "Token de Acesso Meta",     value: "EAABsbCS4bellamodasXXXdemo",  type: "password", hint: "Gerado no Meta Business Manager" },
      { label: "ID do Número de Telefone", value: "551194007820",               type: "text",     hint: "Ex: 5511999990000" },
      { label: "ID da Conta Business",     value: "987654321098765",            type: "readonly" },
      { label: "Versão da API",            value: "v19.0",                      type: "select",   options: ["v18.0", "v19.0", "v20.0"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/whatsapp/bella_modas",
    webhookEvents: [
      { event: "messages",           desc: "Novas mensagens recebidas",         active: true  },
      { event: "message_deliveries", desc: "Confirmações de entrega",           active: true  },
      { event: "message_reads",      desc: "Confirmações de leitura",           active: true  },
      { event: "message_reactions",  desc: "Reações nas mensagens",             active: false },
      { event: "account_alerts",     desc: "Alertas da conta Meta Business",    active: true  },
    ],
    logs: [
      { time: "Agora",  msg: "Mensagem entregue — Fernanda Lima",      ok: true  },
      { time: "2min",   msg: "Template 'Coleção Verão 2026' aprovado", ok: true  },
      { time: "15min",  msg: "Webhook recebido — 3 novas mensagens",   ok: true  },
      { time: "1h",     msg: "Rate limit atingido temporariamente",    ok: false },
      { time: "3h",     msg: "Token renovado automaticamente",         ok: true  },
    ],
    stats: [
      { label: "Mensagens hoje",   value: "186"  },
      { label: "Taxa de entrega",  value: "98,4%" },
      { label: "Templates ativos", value: "7"    },
    ],
  },
  "Instagram Direct": {
    fields: [
      { label: "Conta conectada",       value: "@bellamodas",               type: "readonly" },
      { label: "Token de Acesso",       value: "IGQWRPxxxxbellamodastoken",  type: "password", hint: "Token OAuth gerado pela Meta" },
      { label: "ID da Página Facebook", value: "112233445566778",           type: "text" },
      { label: "Modo",                  value: "Produção",                  type: "select", options: ["Produção", "Desenvolvimento"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/instagram/bella_modas",
    webhookEvents: [
      { event: "messages",       desc: "DMs recebidas",               active: true  },
      { event: "story_mentions", desc: "Menções em Stories",          active: true  },
      { event: "comments",       desc: "Comentários em posts",        active: false },
      { event: "follows",        desc: "Novos seguidores",            active: true  },
    ],
    logs: [
      { time: "5min",  msg: "DM recebida — Camila Rodrigues",      ok: true  },
      { time: "12min", msg: "Menção em Story — @rafaela.santos",   ok: true  },
      { time: "1h",    msg: "Token OAuth renovado com sucesso",    ok: true  },
      { time: "2h",    msg: "Erro ao ler comentários — permissão", ok: false },
    ],
    stats: [
      { label: "DMs hoje",         value: "43"  },
      { label: "Seguidores novos", value: "12"  },
      { label: "Menções hoje",     value: "8"   },
    ],
  },
  "Telegram": {
    fields: [
      { label: "Token do Bot",  value: "7412345678:AAHxxxbellamodasbot", type: "password", hint: "Gerado pelo @BotFather no Telegram" },
      { label: "Nome do Bot",   value: "@bellamodas_atendimento_bot",   type: "readonly" },
      { label: "Username",      value: "bellamodas_bot",                type: "text" },
      { label: "Parse Mode",    value: "HTML",                          type: "select", options: ["HTML", "Markdown", "MarkdownV2"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/telegram/bella_modas",
    webhookEvents: [
      { event: "message",           desc: "Mensagens recebidas",         active: true  },
      { event: "callback_query",    desc: "Cliques em botões inline",    active: true  },
      { event: "channel_post",      desc: "Posts no canal",              active: false },
      { event: "my_chat_member",    desc: "Alterações de status do bot", active: true  },
    ],
    logs: [
      { time: "Agora", msg: "Mensagem recebida no bot",          ok: true  },
      { time: "30min", msg: "Notificação de pedido enviada",     ok: true  },
      { time: "2h",    msg: "Webhook configurado com sucesso",   ok: true  },
    ],
    stats: [
      { label: "Usuários ativos", value: "28"  },
      { label: "Msgs hoje",       value: "54"  },
    ],
  },
  "Google Calendar": {
    fields: [
      { label: "Conta Google",        value: "carla@bellamodas.com.br",  type: "readonly" },
      { label: "ID do Calendário",    value: "carla@bellamodas.com.br",  type: "text",   hint: "Ou ID do calendário secundário" },
      { label: "Fuso horário",        value: "America/Sao_Paulo",        type: "select", options: ["America/Sao_Paulo", "America/Manaus", "America/Fortaleza"] },
      { label: "Sincronização",       value: "Tempo real",               type: "select", options: ["Tempo real", "A cada 5 min", "A cada 15 min", "A cada 1h"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/gcalendar/bella_modas",
    webhookEvents: [
      { event: "event.created",  desc: "Evento criado no Calendar",   active: true  },
      { event: "event.updated",  desc: "Evento atualizado",           active: true  },
      { event: "event.deleted",  desc: "Evento removido",             active: true  },
      { event: "reminder.fired", desc: "Lembrete disparado",          active: false },
    ],
    logs: [
      { time: "Hoje 10:00", msg: "Evento sincronizado — Live Instagram",       ok: true },
      { time: "Ontem",      msg: "Sincronização completa — 4 eventos",         ok: true },
      { time: "Ontem",      msg: "Falha ao sincronizar — timeout",             ok: false },
    ],
    stats: [
      { label: "Eventos sincronizados", value: "12"  },
      { label: "Próximos 7 dias",       value: "5"   },
    ],
  },
  "n8n": {
    fields: [
      { label: "URL da Instância",  value: "https://n8n.bellamodas.com.br",  type: "url",      hint: "URL pública da sua instância n8n" },
      { label: "API Key",           value: "n8n_api_bella_modas_xxxxx",       type: "password", hint: "Configurações > API em sua instância" },
      { label: "Ambiente",          value: "Produção",                        type: "select",   options: ["Produção", "Staging"] },
      { label: "Timeout (segundos)", value: "30",                             type: "text" },
    ],
    webhookUrl: "https://n8n.bellamodas.com.br/webhook/idea-atende",
    webhookEvents: [
      { event: "lead.created",  desc: "Novo lead criado",              active: true  },
      { event: "lead.updated",  desc: "Lead atualizado",               active: true  },
      { event: "order.created", desc: "Novo pedido confirmado",        active: true  },
      { event: "message.received", desc: "Mensagem recebida no inbox", active: false },
    ],
    logs: [
      { time: "Agora",  msg: "Workflow 'Novo Lead → Slack' executado",   ok: true  },
      { time: "15min",  msg: "Workflow 'Pedido → Nota Fiscal' OK",       ok: true  },
      { time: "1h",     msg: "Execução falhou — credencial expirada",    ok: false },
      { time: "3h",     msg: "4 workflows executados com sucesso",       ok: true  },
    ],
    stats: [
      { label: "Workflows ativos",     value: "6"    },
      { label: "Execuções hoje",       value: "142"  },
      { label: "Taxa de sucesso",      value: "97,9%" },
    ],
  },
  "Make (Integromat)": {
    fields: [
      { label: "Webhook URL (Make)", value: "https://hook.eu1.make.com/bella_modas_xxx", type: "url",      hint: "Copie do cenário Make" },
      { label: "API Key",            value: "make_api_bella_modas_key_xxx",               type: "password" },
      { label: "Região",             value: "EU (Europa)",                                type: "select", options: ["EU (Europa)", "US (EUA)", "BR (Brasil)"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/make/bella_modas",
    webhookEvents: [
      { event: "lead.created",  desc: "Novo lead",           active: true  },
      { event: "order.created", desc: "Novo pedido",         active: true  },
      { event: "payment.ok",    desc: "Pagamento confirmado", active: false },
    ],
    logs: [
      { time: "20min", msg: "Cenário 'Lead → Email' executado", ok: true  },
      { time: "2h",    msg: "Timeout ao chamar Make API",       ok: false },
      { time: "4h",    msg: "3 cenários executados",            ok: true  },
    ],
    stats: [
      { label: "Cenários ativos", value: "3" },
      { label: "Execuções hoje",  value: "27" },
    ],
  },
  "Zapier": {
    fields: [
      { label: "API Key",      value: "zap_sk_bella_modas_xxxxxxx",  type: "password", hint: "Settings > Connected Accounts no Zapier" },
      { label: "Account ID",   value: "zapier_acc_4421879",          type: "readonly" },
      { label: "Região",       value: "US (padrão)",                 type: "select", options: ["US (padrão)", "EU"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/zapier/bella_modas",
    webhookEvents: [
      { event: "lead.created",     desc: "Novo lead criado",      active: true  },
      { event: "order.confirmed",  desc: "Pedido confirmado",     active: true  },
      { event: "message.received", desc: "Nova mensagem",         active: false },
    ],
    logs: [
      { time: "5min",  msg: "Zap 'Novo Lead → Google Sheets' OK",    ok: true  },
      { time: "30min", msg: "Zap 'Pedido → Trello' executado",        ok: true  },
      { time: "2h",    msg: "Autenticação falhou — renovar API key",  ok: false },
    ],
    stats: [
      { label: "Zaps ativos",    value: "8"   },
      { label: "Tarefas hoje",   value: "94"  },
    ],
  },
  "Stripe": {
    fields: [
      { label: "Chave Pública (pk_)",   value: "pk_live_51bella_modas_xxx", type: "text",     hint: "Pode ser exposta no front-end" },
      { label: "Chave Secreta (sk_)",   value: "sk_live_51bella_modas_xxx", type: "password", hint: "Nunca exponha esta chave" },
      { label: "Webhook Secret",        value: "whsec_bella_modas_xxxxx",   type: "password", hint: "Gerado em Developers > Webhooks" },
      { label: "Moeda padrão",          value: "BRL",                       type: "select",   options: ["BRL", "USD", "EUR"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/stripe/bella_modas",
    webhookEvents: [
      { event: "payment_intent.succeeded",      desc: "Pagamento aprovado",       active: true  },
      { event: "payment_intent.payment_failed", desc: "Pagamento recusado",       active: true  },
      { event: "checkout.session.completed",    desc: "Checkout finalizado",      active: true  },
      { event: "customer.subscription.created", desc: "Nova assinatura",          active: false },
      { event: "invoice.paid",                  desc: "Fatura paga",              active: false },
    ],
    logs: [
      { time: "Agora",  msg: "Pagamento R$ 729,00 — Andressa Costa",    ok: true  },
      { time: "30min",  msg: "Checkout criado — Vestido Longo Festa",   ok: true  },
      { time: "2h",     msg: "Pagamento recusado — cartão expirado",    ok: false },
      { time: "3h",     msg: "3 pagamentos processados com sucesso",    ok: true  },
    ],
    stats: [
      { label: "Receita hoje",         value: "R$ 2.430"  },
      { label: "Transações aprovadas", value: "14"        },
      { label: "Taxa de aprovação",    value: "93,3%"     },
    ],
  },
  "Mercado Pago": {
    fields: [
      { label: "Access Token",   value: "APP_USR-bella-modas-access-xxx", type: "password", hint: "Credenciais > Produção no painel MP" },
      { label: "Public Key",     value: "APP_USR-bella-modas-public-xxx", type: "text",     hint: "Usado no front-end para tokenizar" },
      { label: "ID do Vendedor", value: "1234567890",                     type: "readonly" },
      { label: "Ambiente",       value: "Produção",                       type: "select",   options: ["Produção", "Sandbox"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/mercadopago/bella_modas",
    webhookEvents: [
      { event: "payment",        desc: "Qualquer atualização de pagamento", active: true  },
      { event: "payment.created", desc: "Pagamento criado",                 active: true  },
      { event: "payment.approved", desc: "Pagamento aprovado",              active: true  },
      { event: "refund",         desc: "Reembolso processado",              active: false },
    ],
    logs: [
      { time: "10min", msg: "PIX aprovado — R$ 459,00 — Fernanda Lima",  ok: true  },
      { time: "1h",    msg: "Boleto gerado — R$ 319,00 — Bianca F.",     ok: true  },
      { time: "2h",    msg: "PIX expirado — cliente não pagou",          ok: false },
    ],
    stats: [
      { label: "PIX hoje",     value: "R$ 1.840" },
      { label: "Boletos",      value: "3"        },
      { label: "Aprovações",   value: "92%"      },
    ],
  },
  "HubSpot": {
    fields: [
      { label: "API Key (Private App)", value: "pat-na1-bella-modas-hub-xxx", type: "password", hint: "Settings > Integrations > Private Apps" },
      { label: "Portal ID",             value: "44556677",                    type: "readonly" },
      { label: "Pipeline padrão",       value: "Bella Modas — Vendas",       type: "text" },
      { label: "Sincronização",         value: "Bidirecional",               type: "select", options: ["Bidirecional", "IDEA → HubSpot", "HubSpot → IDEA"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/hubspot/bella_modas",
    webhookEvents: [
      { event: "contact.creation",  desc: "Novo contato no HubSpot",    active: true  },
      { event: "contact.propertyChange", desc: "Dados do contato alterados", active: true },
      { event: "deal.creation",     desc: "Novo negócio criado",         active: false },
    ],
    logs: [
      { time: "1h",  msg: "5 contatos sincronizados para HubSpot",   ok: true  },
      { time: "3h",  msg: "Conflito de dados — campo 'email' vazio",  ok: false },
      { time: "6h",  msg: "Sync completo — 128 registros",           ok: true  },
    ],
    stats: [
      { label: "Contatos sincronizados", value: "128" },
      { label: "Pendentes",              value: "3"   },
    ],
  },
  "Pipedrive": {
    fields: [
      { label: "API Token",   value: "pipedrive_bella_modas_token_xxx",     type: "password", hint: "Configurações > Integrações > API" },
      { label: "Subdomínio",  value: "bellamodas.pipedrive.com",            type: "text",     hint: "Seu subdomínio Pipedrive" },
      { label: "Pipeline ID", value: "1",                                   type: "text" },
      { label: "Sync",        value: "A cada 15 min",                       type: "select", options: ["Tempo real", "A cada 5 min", "A cada 15 min", "A cada 1h"] },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/pipedrive/bella_modas",
    webhookEvents: [
      { event: "added.person",   desc: "Novo contato",     active: true  },
      { event: "updated.person", desc: "Contato editado",  active: false },
      { event: "added.deal",     desc: "Novo negócio",     active: true  },
      { event: "updated.deal",   desc: "Negócio editado",  active: true  },
    ],
    logs: [
      { time: "2h", msg: "Deal atualizado — Rafaela Santos",   ok: true  },
      { time: "5h", msg: "Sync falhou — token inválido",       ok: false },
      { time: "6h", msg: "Sync inicial — 22 deals importados", ok: true  },
    ],
    stats: [
      { label: "Deals sincronizados", value: "22" },
      { label: "Contatos",            value: "47" },
    ],
  },
  "Webhook": {
    fields: [
      { label: "URL de Destino",  value: "https://api.bellamodas.com.br/webhook", type: "url",      hint: "Endpoint que receberá os eventos" },
      { label: "Secret Key",      value: "whs_bella_modas_secret_xxx",            type: "password", hint: "Usado para validar a assinatura HMAC" },
      { label: "Método HTTP",     value: "POST",                                  type: "select",   options: ["POST", "PUT", "PATCH"] },
      { label: "Content-Type",    value: "application/json",                      type: "select",   options: ["application/json", "application/x-www-form-urlencoded"] },
      { label: "Header extra",    value: "X-Source: idea-atende",                 type: "text",     hint: "Header adicional opcional" },
    ],
    webhookUrl: "https://api.ideaatende.com/wh/custom/bella_modas",
    webhookEvents: [
      { event: "lead.created",      desc: "Novo lead",                active: true  },
      { event: "lead.updated",      desc: "Lead atualizado",          active: true  },
      { event: "message.received",  desc: "Mensagem recebida",        active: false },
      { event: "order.created",     desc: "Pedido criado",            active: true  },
      { event: "order.status",      desc: "Status do pedido mudou",   active: true  },
      { event: "payment.confirmed", desc: "Pagamento confirmado",     active: false },
    ],
    logs: [
      { time: "Agora",  msg: "POST enviado — lead criado (200 OK)",         ok: true  },
      { time: "5min",   msg: "POST enviado — pedido #1087 (200 OK)",        ok: true  },
      { time: "30min",  msg: "POST falhou — endpoint retornou 503",         ok: false },
      { time: "1h",     msg: "Reenvio automático — entregue após retry",    ok: true  },
    ],
    stats: [
      { label: "Eventos hoje",  value: "74"   },
      { label: "Taxa entrega",  value: "98,6%" },
      { label: "Retries",       value: "2"    },
    ],
  },
};

// ─── Categories ──────────────────────────────────────────────────────────────

const categories = ["Todas", "Mensagens", "Automação", "Pagamentos", "CRM", "Produtividade", "API"];

// ─── Config Modal ─────────────────────────────────────────────────────────────

function ConfigModal({
  integration,
  onClose,
  onDisconnect,
}: {
  integration: Integration;
  onClose: () => void;
  onDisconnect: () => void;
}) {
  const cfg = CONFIGS[integration.name];
  const [tab, setTab] = useState<"config" | "webhooks" | "logs">("config");
  const [fields, setFields] = useState<FieldDef[]>(cfg?.fields ?? []);
  const [events, setEvents] = useState<WebhookEvent[]>(cfg?.webhookEvents ?? []);
  const [showPass, setShowPass] = useState<Record<number, boolean>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "ok" | "error">("idle");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  function testConnection() {
    setTesting(true);
    setTestResult("idle");
    setTimeout(() => { setTesting(false); setTestResult("ok"); }, 1800);
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function copyWebhook() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function toggleEvent(i: number) {
    setEvents((prev) => prev.map((e, idx) => idx === i ? { ...e, active: !e.active } : e));
  }

  function updateField(i: number, val: string) {
    setFields((prev) => prev.map((f, idx) => idx === i ? { ...f, value: val } : f));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[580px] max-h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className={`w-11 h-11 rounded-xl ${integration.color} flex items-center justify-center flex-shrink-0`}>
            <integration.icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#111827]">{integration.name}</h3>
              <span className="flex items-center gap-1 text-[10px] text-[#10B981] bg-green-100 px-2 py-0.5 rounded-full font-medium">
                <Check size={8} /> Ativo
              </span>
            </div>
            <p className="text-xs text-gray-400">{integration.category}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {testResult === "ok" && (
              <span className="flex items-center gap-1 text-xs text-[#10B981] font-medium">
                <CheckCircle2 size={13} /> Conexão OK
              </span>
            )}
            {testResult === "error" && (
              <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                <AlertCircle size={13} /> Falha
              </span>
            )}
            <button
              onClick={testConnection}
              disabled={testing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <RefreshCw size={12} className={testing ? "animate-spin" : ""} />
              {testing ? "Testando..." : "Testar Conexão"}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Stats row */}
        {cfg?.stats && (
          <div className="flex items-center gap-0 border-b border-gray-100 flex-shrink-0">
            {cfg.stats.map((s, i) => (
              <div key={s.label} className={cn("flex-1 px-5 py-3 text-center", i > 0 && "border-l border-gray-100")}>
                <p className="text-base font-bold text-[#111827]">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {([
            { id: "config",   label: "Configurações", icon: Settings },
            { id: "webhooks", label: "Webhooks",       icon: Webhook },
            { id: "logs",     label: "Logs",           icon: FileText },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors",
                tab === t.id
                  ? "border-[#6C3BFF] text-[#6C3BFF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Configurações */}
          {tab === "config" && (
            <div className="space-y-4">
              {fields.map((field, i) => (
                <div key={field.label}>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                  {field.type === "readonly" ? (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 font-mono">
                      {field.value}
                    </div>
                  ) : field.type === "password" ? (
                    <div className="relative">
                      <input
                        type={showPass[i] ? "text" : "password"}
                        value={field.value}
                        onChange={(e) => updateField(i, e.target.value)}
                        className="w-full pr-10 pl-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 font-mono"
                      />
                      <button
                        onClick={() => setShowPass((p) => ({ ...p, [i]: !p[i] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass[i] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  ) : field.type === "select" ? (
                    <select
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                    >
                      {field.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => updateField(i, e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                    />
                  )}
                  {field.hint && <p className="text-[11px] text-gray-400 mt-1">{field.hint}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Webhooks */}
          {tab === "webhooks" && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">URL do Webhook (IDEA Atende)</p>
                <div className="flex items-center gap-2 bg-gray-900 rounded-xl px-4 py-3">
                  <code className="text-xs text-green-400 flex-1 truncate">{cfg?.webhookUrl}</code>
                  <button
                    onClick={copyWebhook}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors flex-shrink-0"
                  >
                    {copied ? <CheckCircle2 size={13} className="text-green-400" /> : <Copy size={13} />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Configure esta URL no painel de {integration.name} para receber eventos em tempo real.</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Eventos Subscritos</p>
                <div className="space-y-2">
                  {events.map((ev, i) => (
                    <div
                      key={ev.event}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all",
                        ev.active ? "border-[#6C3BFF]/20 bg-[#6C3BFF]/5" : "border-gray-100 bg-gray-50"
                      )}
                    >
                      <button
                        onClick={() => toggleEvent(i)}
                        className={cn(
                          "w-9 h-5 rounded-full relative transition-colors flex-shrink-0",
                          ev.active ? "bg-[#6C3BFF]" : "bg-gray-200"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                          ev.active ? "translate-x-4" : "translate-x-0.5"
                        )} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <code className="text-xs font-mono text-gray-700">{ev.event}</code>
                        <p className="text-[11px] text-gray-400">{ev.desc}</p>
                      </div>
                      {ev.active && <Wifi size={13} className="text-[#10B981] flex-shrink-0" />}
                      {!ev.active && <WifiOff size={13} className="text-gray-300 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Logs */}
          {tab === "logs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Eventos Recentes</p>
                <button className="flex items-center gap-1 text-xs text-[#6C3BFF] hover:underline">
                  <RefreshCw size={11} /> Atualizar
                </button>
              </div>
              <div className="space-y-2">
                {cfg?.logs.map((log, i) => (
                  <div key={i} className={cn(
                    "flex items-start gap-3 px-4 py-3 rounded-xl border",
                    log.ok ? "border-green-100 bg-green-50/50" : "border-red-100 bg-red-50/50"
                  )}>
                    {log.ok
                      ? <CheckCircle2 size={14} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                      : <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#111827]">{log.msg}</p>
                    </div>
                    <span className="text-[11px] text-gray-400 flex-shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => { onDisconnect(); onClose(); }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium border border-red-100"
          >
            <X size={13} /> Desconectar
          </button>
          <button
            onClick={save}
            className={cn(
              "flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium transition-all",
              saved
                ? "bg-[#10B981] text-white"
                : "bg-[#6C3BFF] text-white hover:bg-[#5930e8]"
            )}
          >
            {saved ? <><Check size={14} /> Salvo!</> : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Connect Modal ────────────────────────────────────────────────────────────

const connectSteps = ["Validando credenciais...", "Estabelecendo conexão...", "Sincronizando dados..."];

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

  const cfg = CONFIGS[integration.name];
  const [fields, setFields] = useState<FieldDef[]>(cfg?.fields ?? []);
  const [showPass, setShowPass] = useState<Record<number, boolean>>({});

  function updateField(i: number, val: string) {
    setFields((prev) => prev.map((f, idx) => idx === i ? { ...f, value: val } : f));
  }

  function startConnect() {
    setPhase("connecting");
    setProgress(0);
    setStepIdx(0);
    let p = 0;
    const tick = () => {
      p = Math.min(p + 3, 100);
      setProgress(p);
      setStepIdx(p < 33 ? 0 : p < 66 ? 1 : 2);
      if (p < 100) setTimeout(tick, 25);
      else setTimeout(() => { onConnect(); setPhase("success"); }, 200);
    };
    setTimeout(tick, 60);
  }

  const unlocks = appId ? APP_UNLOCKS[appId] ?? [] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden">

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
            <div className="space-y-3 mb-5">
              {fields.map((field, i) => (
                <div key={field.label}>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{field.label}</label>
                  {field.type === "readonly" ? (
                    <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 font-mono">{field.value}</div>
                  ) : field.type === "password" ? (
                    <div className="relative">
                      <input
                        type={showPass[i] ? "text" : "password"}
                        value={field.value}
                        onChange={(e) => updateField(i, e.target.value)}
                        className="w-full pr-10 pl-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 font-mono"
                      />
                      <button onClick={() => setShowPass((p) => ({ ...p, [i]: !p[i] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass[i] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  ) : field.type === "select" ? (
                    <select value={field.value} onChange={(e) => updateField(i, e.target.value)} className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20">
                      {field.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={field.value} onChange={(e) => updateField(i, e.target.value)} className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
                  )}
                  {field.hint && <p className="text-[11px] text-gray-400 mt-1">{field.hint}</p>}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50">Cancelar</button>
              <button onClick={startConnect} className="flex-1 px-4 py-2.5 bg-[#6C3BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5930e8] flex items-center justify-center gap-1.5">
                <Plus size={14} /> Conectar agora
              </button>
            </div>
          </div>
        )}

        {phase === "connecting" && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl ${integration.color} flex items-center justify-center`}>
                <integration.icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-[#111827]">{integration.name}</h3>
                <p className="text-xs text-gray-400">Conectando...</p>
              </div>
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{connectSteps[stepIdx]}</span>
                <span className="text-sm font-bold text-[#6C3BFF]">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#10B981] to-[#6C3BFF] rounded-full transition-all duration-75" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="space-y-2.5">
              {connectSteps.map((step, i) => {
                const done = i < stepIdx;
                const current = i === stepIdx;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", done ? "bg-[#10B981]" : current ? "bg-[#6C3BFF] animate-pulse" : "bg-gray-100")}>
                      {done ? <Check size={10} className="text-white" /> : <span className={cn("w-1.5 h-1.5 rounded-full", current ? "bg-white" : "bg-gray-300")} />}
                    </div>
                    <span className={cn("text-sm", done ? "text-gray-400 line-through" : current ? "text-[#111827] font-medium" : "text-gray-400")}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
            <button onClick={onClose} className="w-full px-4 py-2.5 bg-[#6C3BFF] text-white rounded-xl text-sm font-medium hover:bg-[#5930e8]">Concluir</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IntegracoesPage() {
  const router = useRouter();
  const { installedIds, installApp } = useInstalledApps();
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [configModal, setConfigModal] = useState<Integration | null>(null);
  const [connectModal, setConnectModal] = useState<Integration | null>(null);
  const [connectedExtras, setConnectedExtras] = useState<Set<string>>(new Set(["Instagram Direct", "Webhook"]));

  const filtered = integrations.filter(
    (i) => categoryFilter === "Todas" || i.category === categoryFilter
  );

  function isConnected(name: string) {
    const appId = INTEGRATION_TO_APP_ID[name];
    return (appId ? installedIds.has(appId) : false) || connectedExtras.has(name);
  }

  function isViaMarketplace(name: string) {
    const appId = INTEGRATION_TO_APP_ID[name];
    return appId ? installedIds.has(appId) : false;
  }

  function handleConnect(integration: Integration) {
    const appId = INTEGRATION_TO_APP_ID[integration.name];
    if (appId && !installedIds.has(appId)) installApp(appId);
    setConnectedExtras((prev) => new Set(prev).add(integration.name));
    setConnectModal(null);
  }

  function handleDisconnect(name: string) {
    const appId = INTEGRATION_TO_APP_ID[name];
    if (appId) installApp("__remove__" + appId); // handled gracefully — just removes from extras
    setConnectedExtras((prev) => { const n = new Set(prev); n.delete(name); return n; });
  }

  const connectedCount = integrations.filter((i) => isConnected(i.name)).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Integrações" subtitle={`${connectedCount} ativas · conecte o IDEA Atende com suas ferramentas`} />

      {configModal && (
        <ConfigModal
          integration={configModal}
          onClose={() => setConfigModal(null)}
          onDisconnect={() => handleDisconnect(configModal.name)}
        />
      )}
      {connectModal && (
        <ConnectModal
          integration={connectModal}
          appId={INTEGRATION_TO_APP_ID[connectModal.name] ?? null}
          onClose={() => setConnectModal(null)}
          onConnect={() => handleConnect(connectModal)}
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Integrações Ativas",        value: connectedCount,                      color: "text-[#10B981]" },
            { label: "Apps do Marketplace",        value: installedIds.size,                   color: "text-[#6C3BFF]" },
            { label: "Disponíveis para Conectar",  value: integrations.length - connectedCount, color: "text-gray-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((int) => {
            const connected = isConnected(int.name);
            const viaMarket = isViaMarketplace(int.name);
            const appId = INTEGRATION_TO_APP_ID[int.name];
            const notInstalled = !!appId && !installedIds.has(appId);

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
                    <>
                      <button
                        onClick={() => setConfigModal(int)}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg font-medium bg-[#6C3BFF]/10 text-[#6C3BFF] hover:bg-[#6C3BFF]/20 transition-colors flex items-center justify-center gap-1"
                      >
                        <Settings size={11} /> Configurar
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-lg transition-colors">
                        <ExternalLink size={13} />
                      </button>
                    </>
                  ) : notInstalled ? (
                    <button
                      onClick={() => router.push("/marketplace")}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg font-medium border border-[#6C3BFF] text-[#6C3BFF] hover:bg-[#6C3BFF]/5 transition-colors flex items-center justify-center gap-1"
                    >
                      <Store size={11} /> Instalar no Marketplace <ArrowRight size={11} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setConnectModal(int)}
                      className="flex-1 text-xs px-3 py-1.5 rounded-lg font-medium bg-[#6C3BFF] text-white hover:bg-[#5930e8] transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus size={11} /> Conectar
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
