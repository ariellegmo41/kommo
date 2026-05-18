"use client";

import { useState } from "react";
import { Bell, Search, Plus, MessageSquare, User, Zap, X, Check } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

const notifications = [
  { id: 1, type: "msg",  text: "Nova mensagem de Maria Fernanda", sub: "WhatsApp · agora", read: false, icon: MessageSquare, color: "text-green-500 bg-green-50" },
  { id: 2, type: "lead", text: "Lead qualificado automaticamente pela IA", sub: "João Paulo · 5 min", read: false, icon: Zap, color: "text-[#6C3BFF] bg-[#6C3BFF]/10" },
  { id: 3, type: "msg",  text: "Carla Mendes fechou 1 negócio — R$ 4.200", sub: "CRM · 20 min", read: false, icon: Zap, color: "text-amber-500 bg-amber-50" },
  { id: 4, type: "user", text: "Diego Santos entrou na conversa #1042", sub: "Inbox · 1h", read: true,  icon: User, color: "text-blue-500 bg-blue-50" },
  { id: 5, type: "msg",  text: "Automação 'Follow-up 24h' disparou 12x", sub: "Automações · 2h", read: true,  icon: Zap, color: "text-purple-500 bg-purple-50" },
];

export default function Topbar({ title, subtitle, action }: TopbarProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const unread = items.filter((n) => !n.read).length;

  function markAll() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0 relative z-30">
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-[#111827] truncate">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 focus:border-[#6C3BFF] w-48 transition-all"
          />
        </div>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                {unread}
              </span>
            )}
          </button>

          {/* Notification panel */}
          {open && (
            <>
              <div className="fixed inset-0" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-10 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Notificações</p>
                    {unread > 0 && <p className="text-xs text-gray-400">{unread} não lidas</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {unread > 0 && (
                      <button onClick={markAll} className="text-xs text-[#6C3BFF] hover:underline flex items-center gap-1">
                        <Check size={10} /> Marcar todas
                      </button>
                    )}
                    <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <X size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {items.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => setItems((prev) => prev.map((i) => i.id === n.id ? { ...i, read: true } : i))}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? "bg-[#6C3BFF]/5" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${n.color} flex items-center justify-center flex-shrink-0`}>
                        <n.icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!n.read ? "font-medium text-[#111827]" : "text-gray-600"}`}>{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.sub}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-[#6C3BFF] flex-shrink-0 mt-1.5" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs text-[#6C3BFF] hover:underline">Ver todas as notificações</button>
                </div>
              </div>
            </>
          )}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors"
          >
            <Plus size={14} />
            {action.label}
          </button>
        )}
      </div>
    </header>
  );
}
