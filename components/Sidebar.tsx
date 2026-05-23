"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, MessageSquare, Users, Kanban, GitBranch, Megaphone,
  Bot, Sparkles, BarChart3, Calendar, Plug, Settings, LogOut, ChevronDown,
  Store, Code2, Palette, Crown, Video, Radio, Tag, ClipboardList, Package, X, Check,
  BookOpen, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inbox",     label: "Inbox",      icon: MessageSquare, badge: 12 },
  { href: "/leads",     label: "Leads",      icon: Users },
  { href: "/crm",       label: "CRM",        icon: Kanban },
  { href: "/funis",     label: "Automações", icon: GitBranch },
  { href: "/campanhas", label: "Campanhas",  icon: Megaphone },
  { href: "/salesbot",  label: "Salesbot",   icon: Bot },
  { href: "/ia",        label: "IA",         icon: Sparkles },
  { href: "/analytics", label: "Analytics",  icon: BarChart3 },
  { href: "/calendario",label: "Calendário", icon: Calendar },
  { href: "/integracoes",label: "Integrações",icon: Plug },
];

const phase3Nav = [
  { href: "/white-label", label: "White-label", icon: Palette },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/api",         label: "API Pública",  icon: Code2 },
];

const superliveNav = [
  { href: "/lives",      label: "Lives",      icon: Video,         liveNow: false },
  { href: "/ao-vivo",    label: "Ao Vivo",    icon: Radio,         liveNow: true  },
  { href: "/produtos",   label: "Produtos",   icon: Tag,           liveNow: false },
  { href: "/pedidos",    label: "Pedidos",    icon: ClipboardList, liveNow: false },
  { href: "/estoque",    label: "Estoque",    icon: Package,       liveNow: false },
  { href: "/catalogo",   label: "Catálogo",   icon: BookOpen,      liveNow: false },
  { href: "/financeiro", label: "Financeiro", icon: Wallet,        liveNow: false },
];

const bottomNav = [
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

const workspaces = ["Bella Modas", "Moda Chique", "Estilo & Elegância"];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState("Bella Modas");

  const NavItem = ({ href, label, icon: Icon, badge, liveNow }: {
    href: string; label: string; icon: typeof LayoutDashboard; badge?: number; liveNow?: boolean;
  }) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
          active ? "bg-[#6C3BFF] text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
        )}
      >
        <Icon size={15} className={cn(active ? "text-white" : "text-white/50 group-hover:text-white/80")} />
        <span className="flex-1 truncate">{label}</span>
        {badge && (
          <span className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center",
            active ? "bg-white/20 text-white" : "bg-[#6C3BFF] text-white"
          )}>{badge}</span>
        )}
        {liveNow && !badge && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
        )}
      </Link>
    );
  };

  return (
    <aside className="w-[220px] min-h-screen bg-[#111827] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C3BFF] to-[#7B61FF] flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Superlive</p>
            <p className="text-white/40 text-[10px] mt-0.5">Plataforma de Lives</p>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="px-3 py-3 border-b border-white/10 relative">
        <button onClick={() => setShowWorkspace((v) => !v)} className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-6 h-6 rounded bg-[#6C3BFF] flex items-center justify-center text-white text-[10px] font-bold">{activeWorkspace[0]}</div>
          <span className="text-white/70 text-xs flex-1 text-left truncate">{activeWorkspace}</span>
          <ChevronDown size={12} className={cn("text-white/40 group-hover:text-white/60 flex-shrink-0 transition-transform", showWorkspace && "rotate-180")} />
        </button>
        {showWorkspace && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowWorkspace(false)} />
            <div className="absolute left-3 right-3 top-full mt-1 z-20 bg-[#1f2937] rounded-xl shadow-xl overflow-hidden border border-white/10">
              {workspaces.map((w) => (
                <button key={w} onClick={() => { setActiveWorkspace(w); setShowWorkspace(false); }} className={cn("w-full flex items-center gap-2 px-3 py-2.5 text-xs text-left transition-colors", w === activeWorkspace ? "bg-[#6C3BFF]/20 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}>
                  <div className="w-5 h-5 rounded bg-[#6C3BFF]/60 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">{w[0]}</div>
                  {w}
                  {w === activeWorkspace && <Check size={10} className="ml-auto text-[#6C3BFF]" />}
                </button>
              ))}
              <div className="border-t border-white/10">
                <button className="w-full px-3 py-2.5 text-xs text-white/40 hover:text-white/60 text-left">+ Novo workspace</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {mainNav.map((item) => <NavItem key={item.href} {...item} />)}

        {/* Phase 3 section */}
        <div className="pt-3 pb-1">
          <div className="flex items-center gap-1.5 px-3 mb-1.5">
            <Crown size={10} className="text-amber-400" />
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Avançado</span>
          </div>
          {phase3Nav.map((item) => <NavItem key={item.href} {...item} />)}
        </div>

        {/* Superlive section */}
        <div className="pt-3 pb-1">
          <div className="flex items-center gap-1.5 px-3 mb-1.5">
            <Video size={10} className="text-red-400" />
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">Superlive</span>
          </div>
          {superliveNav.map((item) => <NavItem key={item.href} {...item} />)}
        </div>

        {bottomNav.map((item) => <NavItem key={item.href} {...item} />)}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C3BFF] to-[#7B61FF] flex items-center justify-center text-white text-xs font-bold">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Carla Mendes</p>
            <p className="text-white/40 text-[10px] truncate">carla@bellamodas.com.br</p>
          </div>
          <button onClick={() => setShowLogout(true)} className="text-white/40 hover:text-white/70 transition-colors"><LogOut size={14} /></button>

          {showLogout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowLogout(false)} />
              <div className="relative bg-white rounded-2xl shadow-2xl w-80 p-6 text-center">
                <LogOut size={32} className="text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-[#111827] mb-1">Sair da conta?</h3>
                <p className="text-sm text-gray-400 mb-5">Você será desconectado do sistema.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowLogout(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
                  <button onClick={() => router.push("/dashboard")} className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">Sair</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
