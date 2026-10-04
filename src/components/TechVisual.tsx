import React, { useEffect, useRef, useState } from 'react';
import {
  Layers,
  Cpu,
  RefreshCw,
  Server,
  Database,
  Cloud,
  Shield,
  Activity,
  Zap,
  Terminal,
} from 'lucide-react';

interface TechVisualProps {
  onStartProject?: () => void;
}

type TopologyMode = 'cloud' | 'ai' | 'retail';

interface SystemNode {
  id: string;
  label: string;
  role: string;
  tech: string;
  status: 'active' | 'synced' | 'routing';
  x: number; // percentage
  y: number; // percentage
  icon: 'server' | 'database' | 'cloud' | 'cpu' | 'shield' | 'zap';
}

export const TechVisual: React.FC<TechVisualProps> = ({ onStartProject }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<TopologyMode>('cloud');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pingLatency, setPingLatency] = useState(11.4);

  // Live fluctuating ping latency for technical realism
  useEffect(() => {
    const interval = setInterval(() => {
      setPingLatency(Number((10 + Math.random() * 3.5).toFixed(1)));
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Neural canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    const count = 30;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.6 + 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect near particles
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - dist / 90) * 0.2})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const topologies: Record<
    TopologyMode,
    {
      title: string;
      throughput: string;
      reliability: string;
      nodes: SystemNode[];
      connections: [string, string][];
    }
  > = {
    cloud: {
      title: 'Cloud Microservices Architecture',
      throughput: '14.8k req/sec',
      reliability: '99.99% Uptime',
      nodes: [
        { id: 'edge', label: 'Edge CDN', role: 'Anycast DNS / SSL', tech: 'Cloudflare Edge', status: 'active', x: 14, y: 50, icon: 'cloud' },
        { id: 'gateway', label: 'API Gateway', role: 'Rate Limiting & Auth', tech: 'Envoy / Go', status: 'active', x: 38, y: 30, icon: 'shield' },
        { id: 'compute', label: 'Microservices Cluster', role: 'Stateless Workers', tech: 'Docker & K8s', status: 'routing', x: 64, y: 30, icon: 'server' },
        { id: 'cache', label: 'Redis Cluster', role: 'Sub-ms In-Memory', tech: 'Redis Sentinel', status: 'active', x: 50, y: 75, icon: 'zap' },
        { id: 'db', label: 'Primary DB', role: 'ACID Replicated', tech: 'PostgreSQL 16', status: 'synced', x: 86, y: 55, icon: 'database' },
      ],
      connections: [
        ['edge', 'gateway'],
        ['gateway', 'compute'],
        ['gateway', 'cache'],
        ['compute', 'cache'],
        ['compute', 'db'],
      ],
    },
    ai: {
      title: 'Autonomous AI Agent Mesh',
      throughput: '86 tokens/sec',
      reliability: 'Context 128k',
      nodes: [
        { id: 'input', label: 'Query Ingest', role: 'Intent Parser', tech: 'FastAPI / Async', status: 'active', x: 14, y: 50, icon: 'zap' },
        { id: 'embed', label: 'Embedding Engine', role: 'Vectorization', tech: 'Dense Embeddings', status: 'active', x: 38, y: 30, icon: 'cpu' },
        { id: 'vector', label: 'Vector Store', role: 'Semantic Retrieval', tech: 'pgvector / HNSW', status: 'synced', x: 50, y: 75, icon: 'database' },
        { id: 'orchestrator', label: 'Agent Core', role: 'Multi-Step Planner', tech: 'LLM Orchestration', status: 'routing', x: 66, y: 30, icon: 'server' },
        { id: 'tools', label: 'Tool Sandbox', role: 'Action Execution', tech: 'Isolated MicroVM', status: 'active', x: 86, y: 55, icon: 'shield' },
      ],
      connections: [
        ['input', 'embed'],
        ['embed', 'vector'],
        ['embed', 'orchestrator'],
        ['vector', 'orchestrator'],
        ['orchestrator', 'tools'],
      ],
    },
    retail: {
      title: 'Omni-Channel Sync Engine',
      throughput: '< 45ms Sync',
      reliability: 'Zero Shelf Discrepancy',
      nodes: [
        { id: 'pos', label: 'Store Cloud POS', role: 'Counter Checkout', tech: 'Local SQLite / Sync', status: 'active', x: 14, y: 50, icon: 'server' },
        { id: 'sync', label: 'Sync Broker', role: 'Real-Time Pipeline', tech: 'WebSocket Mesh', status: 'routing', x: 38, y: 30, icon: 'zap' },
        { id: 'catalog', label: 'Catalog Engine', role: 'Live Stock Ledger', tech: 'In-Memory State', status: 'synced', x: 64, y: 30, icon: 'database' },
        { id: 'app', label: 'Customer App', role: 'Mobile Storefront', tech: 'React Native 60fps', status: 'active', x: 50, y: 75, icon: 'cloud' },
        { id: 'dispatch', label: 'Rider Telemetry', role: 'Runner Allocation', tech: 'Redis Geo / GPS', status: 'active', x: 86, y: 55, icon: 'shield' },
      ],
      connections: [
        ['pos', 'sync'],
        ['sync', 'catalog'],
        ['catalog', 'app'],
        ['sync', 'dispatch'],
        ['catalog', 'dispatch'],
      ],
    },
  };

  const activeTopology = topologies[mode];

  const getNodeIcon = (iconName: SystemNode['icon']) => {
    switch (iconName) {
      case 'server':
        return <Server className="w-3.5 h-3.5 text-cyan-400" />;
      case 'database':
        return <Database className="w-3.5 h-3.5 text-cyan-300" />;
      case 'cloud':
        return <Cloud className="w-3.5 h-3.5 text-sky-400" />;
      case 'cpu':
        return <Cpu className="w-3.5 h-3.5 text-emerald-400" />;
      case 'shield':
        return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
      case 'zap':
        return <Zap className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const selectedNodeData = activeTopology.nodes.find((n) => n.id === selectedNode);

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto rounded-3xl overflow-hidden border border-cyan-500/25 bg-slate-950/85 backdrop-blur-xl shadow-2xl shadow-cyan-950/50 group">
      {/* Background Neural Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-70 pointer-events-none" />

      {/* Futuristic Background Liquid Ribbon Asset */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-25 mix-blend-screen overflow-hidden">
        <img
          src="/images/hero_liquid_ribbon.jpg"
          alt="Abstract Digital Topology"
          className="w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
      </div>

      {/* Major Technical Line for Dashboard: High-Throughput Real-Time Infrastructure */}
      <div className="relative z-20 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-cyan-950/90 via-slate-900/95 to-blue-950/90 border-b border-cyan-500/25 flex items-center justify-between text-[11px] font-mono shadow-[0_4px_20px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-2 text-cyan-300">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-bold tracking-wider text-white">SYSTEM TELEMETRY ENGINE</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-cyan-400 font-medium">HIGH-CONCURRENCY DISTRIBUTED RUNTIME</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold text-[10px] tracking-widest uppercase">99.99% UPTIME // TLS 1.3</span>
        </div>
      </div>

      {/* Top Header Bar: Architecture Selector Tabs */}
      <div className="relative z-20 px-5 pt-4 pb-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10">
          <button
            onClick={() => {
              setMode('cloud');
              setSelectedNode(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'cloud'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cloud</span>
          </button>

          <button
            onClick={() => {
              setMode('ai');
              setSelectedNode(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'ai'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Mesh</span>
          </button>

          <button
            onClick={() => {
              setMode('retail');
              setSelectedNode(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              mode === 'retail'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>

        {/* Live Network Status Telemetry */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tabular-nums font-semibold">{pingLatency}ms</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 uppercase text-[10px]">LIVE</span>
        </div>
      </div>

      {/* Main Interactive Topology SVG Canvas Area */}
      <div className="relative z-10 w-full h-[270px] sm:h-[290px] p-4 select-none">
        {/* SVG Connection Lines & Pulsing Data Packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {activeTopology.connections.map(([fromId, toId], idx) => {
            const fromNode = activeTopology.nodes.find((n) => n.id === fromId);
            const toNode = activeTopology.nodes.find((n) => n.id === toId);
            if (!fromNode || !toNode) return null;

            return (
              <g key={`${fromId}-${toId}`}>
                {/* Background Track */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="rgba(6, 182, 212, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Animated Data Pulse Indicator */}
                <circle r="2.5" fill="#22d3ee" className="animate-ping" opacity="0.7">
                  <animate
                    attributeName="cx"
                    values={`${fromNode.x}%;${toNode.x}%`}
                    dur={`${2.2 + idx * 0.4}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${fromNode.y}%;${toNode.y}%`}
                    dur={`${2.2 + idx * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Interactive Node Anchors */}
        {activeTopology.nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node"
            >
              <div
                className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-cyan-500/25 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-110'
                    : 'bg-slate-900/90 border-white/15 hover:border-cyan-400 hover:scale-105'
                } border backdrop-blur-md`}
              >
                {getNodeIcon(node.icon)}
                {/* Active Status Pip */}
                <span
                  className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-slate-950 ${
                    node.status === 'active'
                      ? 'bg-emerald-400'
                      : node.status === 'routing'
                      ? 'bg-cyan-400 animate-pulse'
                      : 'bg-sky-400'
                  }`}
                />
              </div>

              {/* Node Mini Label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-[10px] font-mono font-medium text-slate-300 group-hover/node:text-cyan-300 transition-colors pointer-events-none drop-shadow">
                {node.label}
              </div>
            </div>
          );
        })}

        {/* Selected Node Spec Inspector Drawer */}
        {selectedNodeData ? (
          <div className="absolute bottom-3 left-4 right-4 p-3 rounded-xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150 z-30 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-tight">
                  {selectedNodeData.label}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  {selectedNodeData.tech}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Role: {selectedNodeData.role}
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 pointer-events-none">
            <span>Click any node to inspect architecture</span>
            <span className="text-cyan-400">{activeTopology.throughput}</span>
          </div>
        )}
      </div>

      {/* Bottom Technical Benchmarks Strip */}
      <div className="relative z-20 px-5 py-3 border-t border-white/10 bg-slate-950/90 backdrop-blur-md flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase text-cyan-400">BENCHMARK</span>
          <span className="font-semibold text-white tracking-tight">
            {activeTopology.title}
          </span>
        </div>

        {onStartProject && (
          <button
            onClick={onStartProject}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer group/cta"
          >
            <span>Scope Tech</span>
            <Zap className="w-3.5 h-3.5 group-hover/cta:scale-110 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
