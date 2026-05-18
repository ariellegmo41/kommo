"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Kanban,
  GitBranch,
  Megaphone,
  Bot,
  Sparkles,
  BarChart3,
  Calendar,
  Plug,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inbox", label: "Inbox", icon: MessageSquare, badge: 12 },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/crm", label: "CRM", icon: Kanban },
  { href: "/funis", label: "Funis", icon: GitBranch },
  { href: "/campanhas", label: "Campanhas", icon: Megaphone },
  { href: "/salesbot", label: "Salesbot", icon: Bot },
  { href: "/ia", label: "IA", icon: Sparkles },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/calendario", label: "Calendário", icon: Calendar },
  { href: "/integracoes", label: "Integrações", icon: Plug },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] min-h-screen bg-[#111827] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C3BFF] to-[#7B61FF] flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">IDEA Atende</p>
            <p className="text-white/40 text-[10px] mt-0.5">CRM Conversacional</p>
          </div>
        </div>
      </div>

      {/* Workspace selector */}
      <div className="px-3 py-3 border-b border-white/10">
        <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-6 h-6 rounded bg-[#6C3BFF] flex items-center justify-center text-white text-[10px] font-bold">
            M
          </div>
          <span className="text-white/70 text-xs flex-1 text-left">Minha Empresa</span>
          <ChevronDown size={12} className="text-white/40 group-hover:text-white/60" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
                active
                  ? "bg-[#6C3BFF] text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={16} className={cn(active ? "text-white" : "text-white/50 group-hover:text-white/80")} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
                  active ? "bg-white/20 text-white" : "bg-[#6C3BFF] text-white"
                )}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user area */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C3BFF] to-[#7B61FF] flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Admin</p>
            <p className="text-white/40 text-[10px] truncate">admin@empresa.com</p>
          </div>
          <button className="text-white/40 hover:text-white/70 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
