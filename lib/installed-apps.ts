"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "idea_installed_apps";

// Apps pré-instalados por padrão
const DEFAULT_INSTALLED = ["1", "2", "5", "7", "12"];

export function useInstalledApps() {
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set(DEFAULT_INSTALLED));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setInstalledIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  const installApp = useCallback((id: string) => {
    setInstalledIds((prev) => {
      const next = new Set(prev).add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const uninstallApp = useCallback((id: string) => {
    setInstalledIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { installedIds, installApp, uninstallApp };
}

// O que cada app desbloqueia ao ser instalado
export const APP_UNLOCKS: Record<string, string[]> = {
  "1":  ["Canal WhatsApp ativo no Inbox", "Templates Meta aprovados disponíveis", "Multi-número habilitado"],
  "2":  ["Link de pagamento em Pedidos", "Checkout seguro Stripe integrado", "Webhook de confirmação ativo"],
  "3":  ["Novos gatilhos em Automações", "500+ conectores externos disponíveis", "Fluxos avançados habilitados"],
  "4":  ["PIX automático em Pedidos", "Boleto bancário gerado pelo CRM", "Pagamentos nacionais ativos"],
  "5":  ["Modelo GPT-4o no Playground IA", "Qualificação avançada de leads", "Respostas automáticas inteligentes"],
  "6":  ["Exportação Power BI no Analytics", "Relatórios agendados habilitados", "Dashboard BI sincronizado"],
  "7":  ["Agenda Google sincronizada", "Eventos exportados automaticamente", "Reuniões Google Meet integradas"],
  "8":  ["Logs de auditoria em Configurações", "Relatório de conformidade LGPD", "Controle de acesso avançado"],
  "9":  ["Alertas de leads no Slack", "Canal #bella-modas-crm conectado", "Notificações de vendas em tempo real"],
  "10": ["5.000+ apps disponíveis em Funis", "Zapier triggers ativos", "Automações sem código habilitadas"],
  "11": ["Rastreamento de pedidos no Estoque", "Sincronização com loja online", "Status de entrega automático"],
  "12": ["Canal Telegram ativo no Inbox", "Bot de notificações configurado", "Mensagens automáticas habilitadas"],
};

// Mapeamento: nome da integração → ID do app no Marketplace
export const INTEGRATION_TO_APP_ID: Record<string, string> = {
  "WhatsApp Business API": "1",
  "Stripe":                "2",
  "n8n":                   "3",
  "Mercado Pago":          "4",
  "Google Calendar":       "7",
  "Zapier":                "10",
  "Telegram":              "12",
};
