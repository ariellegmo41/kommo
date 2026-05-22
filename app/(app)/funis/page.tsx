"use client";

import { useState, useCallback } from "react";
import Topbar from "@/components/Topbar";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Connection,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Zap, MessageSquare, User, GitBranch, Clock, Globe,
  Bot, Plus, Play, Pause, Pencil, Trash2, ChevronRight, X, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Node types ─── */

function TriggerNode({ data }: NodeProps) {
  const label = String(data.label ?? "");
  const detail = data.detail ? String(data.detail) : null;
  return (
    <div className="bg-white border-2 border-blue-400 rounded-xl shadow-lg min-w-[180px]">
      <div className="bg-blue-50 px-3 py-2 rounded-t-xl flex items-center gap-2 border-b border-blue-100">
        <Zap size={14} className="text-blue-500" />
        <span className="text-xs font-semibold text-blue-700">Gatilho</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-[#111827]">{label}</p>
        {detail && <p className="text-xs text-gray-400 mt-0.5">{detail}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}

function ActionNode({ data }: NodeProps) {
  const colors: Record<string, string> = {
    message: "border-[#6C3BFF] bg-[#6C3BFF]/5",
    task: "border-green-400 bg-green-50",
    assign: "border-amber-400 bg-amber-50",
    move: "border-orange-400 bg-orange-50",
    ai: "border-purple-400 bg-purple-50",
    webhook: "border-gray-400 bg-gray-50",
  };
  const iconColors: Record<string, string> = {
    message: "text-[#6C3BFF]", task: "text-green-600", assign: "text-amber-600",
    move: "text-orange-600", ai: "text-purple-600", webhook: "text-gray-600",
  };
  const icons: Record<string, typeof MessageSquare> = {
    message: MessageSquare, task: Plus, assign: User, move: GitBranch, ai: Bot, webhook: Globe,
  };
  const type = String(data.type ?? "message");
  const label = String(data.label ?? "");
  const detail = data.detail ? String(data.detail) : null;
  const Icon = icons[type] || MessageSquare;

  return (
    <div className={`bg-white border-2 ${colors[type] ?? "border-gray-200"} rounded-xl shadow-lg min-w-[180px]`}>
      <Handle type="target" position={Position.Top} className="!bg-[#6C3BFF] !w-3 !h-3 !border-2 !border-white" />
      <div className="px-3 py-2.5 flex items-start gap-2">
        <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={12} className={iconColors[type] ?? "text-gray-500"} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ação</p>
          <p className="text-sm font-medium text-[#111827]">{label}</p>
          {detail && <p className="text-xs text-gray-400 mt-0.5">{detail}</p>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-[#6C3BFF] !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}

function ConditionNode({ data }: NodeProps) {
  const label = String(data.label ?? "");
  const detail = data.detail ? String(data.detail) : null;
  return (
    <div className="bg-white border-2 border-rose-400 rounded-xl shadow-lg min-w-[180px]">
      <Handle type="target" position={Position.Top} className="!bg-rose-400 !w-3 !h-3 !border-2 !border-white" />
      <div className="bg-rose-50 px-3 py-2 rounded-t-xl flex items-center gap-2 border-b border-rose-100">
        <GitBranch size={14} className="text-rose-500" />
        <span className="text-xs font-semibold text-rose-700">Condição</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium text-[#111827]">{label}</p>
        {detail && <p className="text-xs text-gray-400 mt-0.5">{detail}</p>}
      </div>
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: "30%" }} className="!bg-green-400 !w-3 !h-3 !border-2 !border-white" />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: "70%" }} className="!bg-red-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
}

const nodeTypes = { trigger: TriggerNode, action: ActionNode, condition: ConditionNode };

/* ─── Initial flow ─── */

const initialNodes = [
  { id: "1", type: "trigger", position: { x: 200, y: 50 }, data: { label: "Nova mensagem recebida", detail: "WhatsApp · Instagram" } },
  { id: "2", type: "action", position: { x: 200, y: 200 }, data: { type: "message", label: "Enviar boas-vindas", detail: "Template: onboarding_v2" } },
  { id: "3", type: "condition", position: { x: 200, y: 360 }, data: { label: "É lead qualificado?", detail: "Score ≥ 70" } },
  { id: "4", type: "action", position: { x: 50, y: 520 }, data: { type: "assign", label: "Atribuir ao SDR", detail: "Round-robin — equipe vendas" } },
  { id: "5", type: "action", position: { x: 360, y: 520 }, data: { type: "ai", label: "Qualificação com IA", detail: "Fluxo: qualificacao_leads" } },
  { id: "6", type: "action", position: { x: 200, y: 680 }, data: { type: "move", label: "Mover para Qualificando", detail: "Pipeline: Vendas B2C" } },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#6C3BFF", strokeWidth: 2 } },
  { id: "e2-3", source: "2", target: "3", style: { stroke: "#6C3BFF", strokeWidth: 2 } },
  { id: "e3-4", source: "3", target: "4", sourceHandle: "yes", label: "Sim", style: { stroke: "#10B981", strokeWidth: 2 }, labelStyle: { fill: "#10B981", fontWeight: 600, fontSize: 11 } },
  { id: "e3-5", source: "3", target: "5", sourceHandle: "no", label: "Não", style: { stroke: "#EF4444", strokeWidth: 2 }, labelStyle: { fill: "#EF4444", fontWeight: 600, fontSize: 11 } },
  { id: "e4-6", source: "4", target: "6", style: { stroke: "#6C3BFF", strokeWidth: 2 } },
  { id: "e5-6", source: "5", target: "6", style: { stroke: "#6C3BFF", strokeWidth: 2 } },
];

/* ─── Automation list ─── */

const automations = [
  { id: "1", name: "Boas-vindas automático", trigger: "Nova mensagem", active: true, runs: 1432 },
  { id: "2", name: "Follow-up após 24h", trigger: "Inatividade", active: true, runs: 287 },
  { id: "3", name: "Qualificação com IA", trigger: "Lead criado", active: true, runs: 654 },
  { id: "4", name: "Campanha pós-proposta", trigger: "Mudança de etapa", active: false, runs: 89 },
];

const palette = [
  { type: "trigger", label: "Nova mensagem", icon: MessageSquare, color: "border-blue-200 bg-blue-50 text-blue-700" },
  { type: "trigger", label: "Lead criado", icon: User, color: "border-blue-200 bg-blue-50 text-blue-700" },
  { type: "trigger", label: "Inatividade", icon: Clock, color: "border-blue-200 bg-blue-50 text-blue-700" },
  { type: "action", label: "Enviar mensagem", icon: MessageSquare, color: "border-[#6C3BFF]/30 bg-[#6C3BFF]/5 text-[#6C3BFF]" },
  { type: "action", label: "Criar tarefa", icon: Plus, color: "border-green-200 bg-green-50 text-green-700" },
  { type: "action", label: "Chamar IA", icon: Bot, color: "border-purple-200 bg-purple-50 text-purple-700" },
  { type: "action", label: "Enviar webhook", icon: Globe, color: "border-gray-200 bg-gray-50 text-gray-600" },
  { type: "condition", label: "Condição", icon: GitBranch, color: "border-rose-200 bg-rose-50 text-rose-700" },
];

export default function FunisPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [list, setList] = useState(automations);
  const [selected, setSelected] = useState(automations[0].id);
  const [view, setView] = useState<"canvas" | "list">("canvas");
  const [saved, setSaved] = useState(false);
  const [showNewAuto, setShowNewAuto] = useState(false);
  const [newAutoName, setNewAutoName] = useState("");

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, style: { stroke: "#6C3BFF", strokeWidth: 2 } }, eds));
  }, [setEdges]);

  function toggle(id: string) {
    setList((prev) => prev.map((a) => a.id === id ? { ...a, active: !a.active } : a));
  }

  function saveFlow() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addAutomation() {
    if (!newAutoName.trim()) return;
    const newAuto = { id: String(Date.now()), name: newAutoName, trigger: "Nova mensagem", active: false, runs: 0 };
    setList((prev) => [...prev, newAuto]);
    setSelected(newAuto.id);
    setNewAutoName("");
    setShowNewAuto(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Automações"
        subtitle="Builder visual no-code"
        action={{ label: "Nova Automação", onClick: () => setShowNewAuto(true) }}
      />

      {showNewAuto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNewAuto(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[360px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">Nova Automação</h3>
              <button onClick={() => setShowNewAuto(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Nome</label>
                <input value={newAutoName} onChange={(e) => setNewAutoName(e.target.value)} placeholder="Ex: Follow-up após 48h" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
              </div>
              <button onClick={addAutomation} className="w-full py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors">Criar Automação</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex">
        {/* Left panel */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* View toggle */}
          <div className="p-3 border-b border-gray-100">
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button onClick={() => setView("canvas")} className={cn("flex-1 text-xs py-1.5 rounded-md font-medium transition-colors", view === "canvas" ? "bg-white text-[#6C3BFF] shadow-sm" : "text-gray-500")}>Canvas</button>
              <button onClick={() => setView("list")} className={cn("flex-1 text-xs py-1.5 rounded-md font-medium transition-colors", view === "list" ? "bg-white text-[#6C3BFF] shadow-sm" : "text-gray-500")}>Lista</button>
            </div>
          </div>

          {view === "canvas" ? (
            <>
              {/* Automation list for canvas */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1 mb-2">Automações</p>
                {list.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelected(a.id)}
                    className={cn("w-full text-left px-3 py-2.5 rounded-lg transition-colors", selected === a.id ? "bg-[#6C3BFF]/10 border border-[#6C3BFF]/20" : "hover:bg-gray-50")}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-[#111827] truncate">{a.name}</span>
                      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0 ml-1", a.active ? "bg-[#10B981]" : "bg-gray-300")} />
                    </div>
                    <span className="text-[10px] text-gray-400">{a.runs.toLocaleString("pt-BR")} execuções</span>
                  </button>
                ))}
                <button onClick={() => setShowNewAuto(true)} className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-lg border-2 border-dashed border-gray-200 hover:border-[#6C3BFF]/30 transition-all text-xs">
                  <Plus size={12} /> Nova automação
                </button>
              </div>

              {/* Palette */}
              <div className="border-t border-gray-100 p-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Adicionar nó</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {palette.map((p) => (
                    <div
                      key={p.label}
                      draggable
                      className={cn("flex flex-col items-center gap-1 p-2 rounded-lg border cursor-grab text-center transition-all hover:shadow-sm", p.color)}
                    >
                      <p.icon size={14} />
                      <span className="text-[9px] font-medium leading-tight">{p.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {list.map((a) => (
                <div key={a.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#111827] truncate">{a.name}</span>
                    <button onClick={() => toggle(a.id)} className={cn("p-1 rounded-lg transition-colors", a.active ? "bg-[#10B981]/10 text-[#10B981]" : "bg-gray-100 text-gray-400")}>
                      {a.active ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">{a.trigger}</span>
                    <span className="text-[10px] text-gray-400 ml-auto">{a.runs.toLocaleString("pt-BR")}×</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e5e7eb" gap={20} size={1} />
            <Controls className="!shadow-sm !border !border-gray-200 !rounded-xl" />
            <MiniMap
              className="!rounded-xl !border !border-gray-200 !shadow-sm"
              nodeColor={(n) => n.type === "trigger" ? "#3b82f6" : n.type === "condition" ? "#f43f5e" : "#6C3BFF"}
            />
          </ReactFlow>

          {/* Canvas toolbar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-200 px-3 py-2">
            <span className="text-xs text-gray-500">Boas-vindas automático</span>
            <div className="w-px h-4 bg-gray-200" />
            <button className="text-xs text-gray-500 hover:text-[#6C3BFF] flex items-center gap-1 transition-colors"><Play size={12} /> Testar</button>
            <button onClick={saveFlow} className={cn("text-xs px-3 py-1 rounded-lg transition-colors", saved ? "bg-[#10B981] text-white" : "bg-[#6C3BFF] text-white hover:bg-[#5930e8]")}>{saved ? "✓ Salvo!" : "Salvar"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
