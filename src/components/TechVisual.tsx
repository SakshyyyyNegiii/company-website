import React, { useEffect, useRef, useState, useCallback, useId } from 'react';
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
  Sparkles,
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
  latency: string;
  load: string;
}

interface PulseParticle {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export const TechVisual: React.FC<TechVisualProps> = ({ onStartProject }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<TopologyMode>('cloud');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [pingLatency, setPingLatency] = useState(11.4);
  const [isSurging, setIsSurging] = useState(false);
  const [equalizerHeights, setEqualizerHeights] = useState<number[]>([40, 65, 85, 50, 95, 70, 80, 60]);
  const pulsesRef = useRef<PulseParticle[]>([]);

  const uniqueId = useId();
  const lineGradId = `lineGrad-${uniqueId.replace(/:/g, '')}`;
  const activeGradId = `activeGrad-${uniqueId.replace(/:/g, '')}`;

  // Fluctuating telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setPingLatency((prev) => {
        const delta = (Math.random() - 0.5) * 1.8;
        return Number(Math.max(3.5, Math.min(18, prev + delta)).toFixed(1));
      });

      // Fluctuate equalizer bars
      setEqualizerHeights(
        Array.from({ length: 8 }, () => Math.floor(Math.random() * 65 + 30))
      );
    }, 1800);
    return () => clearInterval(interval);
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
        { id: 'edge', label: 'Edge CDN', role: 'Anycast DNS / SSL Edge Caching', tech: 'Cloudflare Edge', status: 'active', x: 14, y: 50, icon: 'cloud', latency: '4ms', load: '32%' },
        { id: 'gateway', label: 'API Gateway', role: 'Rate Limiting & Auth Proxy', tech: 'Envoy / Go', status: 'active', x: 38, y: 30, icon: 'shield', latency: '8ms', load: '45%' },
        { id: 'compute', label: 'Microservices Cluster', role: 'Stateless Kubernetes Workers', tech: 'Docker & K8s', status: 'routing', x: 64, y: 30, icon: 'server', latency: '12ms', load: '68%' },
        { id: 'cache', label: 'Redis Cluster', role: 'Sub-ms In-Memory Key-Value', tech: 'Redis Sentinel', status: 'active', x: 50, y: 75, icon: 'zap', latency: '< 1ms', load: '24%' },
        { id: 'db', label: 'Primary DB', role: 'ACID Replicated High Availability', tech: 'PostgreSQL 16', status: 'synced', x: 86, y: 55, icon: 'database', latency: '9ms', load: '52%' },
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
        { id: 'input', label: 'Query Ingest', role: 'Streaming Intent Parser', tech: 'FastAPI / Async', status: 'active', x: 14, y: 50, icon: 'zap', latency: '6ms', load: '28%' },
        { id: 'embed', label: 'Embedding Engine', role: 'Dense Vector Transformations', tech: 'Dense Embeddings', status: 'active', x: 38, y: 30, icon: 'cpu', latency: '14ms', load: '58%' },
        { id: 'vector', label: 'Vector Store', role: 'Semantic Retrieval & Cosine Rank', tech: 'pgvector / HNSW', status: 'synced', x: 50, y: 75, icon: 'database', latency: '11ms', load: '36%' },
        { id: 'orchestrator', label: 'Agent Core', role: 'Multi-Step Autonomous Planner', tech: 'LLM Orchestration', status: 'routing', x: 66, y: 30, icon: 'server', latency: '22ms', load: '74%' },
        { id: 'tools', label: 'Tool Sandbox', role: 'Secure Function Execution', tech: 'Isolated MicroVM', status: 'active', x: 86, y: 55, icon: 'shield', latency: '15ms', load: '41%' },
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
        { id: 'pos', label: 'Store Cloud POS', role: 'Counter Checkout Terminal', tech: 'Local SQLite / Sync', status: 'active', x: 14, y: 50, icon: 'server', latency: '5ms', load: '22%' },
        { id: 'sync', label: 'Sync Broker', role: 'Bi-Directional Event Stream', tech: 'WebSocket Mesh', status: 'routing', x: 38, y: 30, icon: 'zap', latency: '9ms', load: '61%' },
        { id: 'catalog', label: 'Catalog Engine', role: 'Real-Time Stock Ledger', tech: 'In-Memory State', status: 'synced', x: 64, y: 30, icon: 'database', latency: '7ms', load: '48%' },
        { id: 'app', label: 'Customer App', role: '60fps Native Storefront', tech: 'React Native', status: 'active', x: 50, y: 75, icon: 'cloud', latency: '16ms', load: '53%' },
        { id: 'dispatch', label: 'Rider Telemetry', role: 'GPS Runner Allocation Engine', tech: 'Redis Geo / GPS', status: 'active', x: 86, y: 55, icon: 'shield', latency: '12ms', load: '39%' },
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

  // Trigger high-speed traffic pulse simulation
  const handleSimulateTraffic = useCallback(() => {
    setIsSurging(true);
    setPingLatency(3.8);

    // Spawn 15 rapid energy pulses
    const newPulses: PulseParticle[] = [];
    activeTopology.connections.forEach(([fromId, toId]) => {
      const fromNode = activeTopology.nodes.find((n) => n.id === fromId);
      const toNode = activeTopology.nodes.find((n) => n.id === toId);
      if (fromNode && toNode) {
        for (let i = 0; i < 3; i++) {
          newPulses.push({
            fromX: fromNode.x,
            fromY: fromNode.y,
            toX: toNode.x,
            toY: toNode.y,
            progress: -(i * 0.18),
            speed: 0.035 + Math.random() * 0.02,
            color: '#38bdf8',
            size: 3.5,
          });
        }
      }
    });

    pulsesRef.current = [...pulsesRef.current, ...newPulses];

    // Ramp equalizer heights
    setEqualizerHeights([95, 100, 90, 85, 100, 92, 88, 96]);

    setTimeout(() => {
      setIsSurging(false);
      setPingLatency(10.2);
    }, 1600);
  }, [activeTopology]);

  // High-performance canvas particle & pulse rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = Math.max(canvas.parentElement?.clientWidth || 600, 100));
    let height = (canvas.height = Math.max(canvas.parentElement?.clientHeight || 450, 100));

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = Math.max(canvas.parentElement.clientWidth, 100);
      height = canvas.height = Math.max(canvas.parentElement.clientHeight, 100);
    };
    window.addEventListener('resize', onResize);

    // Initialize regular connection pulses
    pulsesRef.current = [];
    activeTopology.connections.forEach(([fromId, toId]) => {
      const fromNode = activeTopology.nodes.find((n) => n.id === fromId);
      const toNode = activeTopology.nodes.find((n) => n.id === toId);
      if (fromNode && toNode) {
        pulsesRef.current.push({
          fromX: fromNode.x,
          fromY: fromNode.y,
          toX: toNode.x,
          toY: toNode.y,
          progress: Math.random(),
          speed: 0.008 + Math.random() * 0.006,
          color: '#22d3ee',
          size: 2.5,
        });
      }
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw active traveling photon pulses
      const pulses = pulsesRef.current;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;

        if (p.progress >= 0 && p.progress <= 1) {
          const px = (p.fromX + (p.toX - p.fromX) * p.progress) * 0.01 * width;
          const py = (p.fromY + (p.toY - p.fromY) * p.progress) * 0.01 * height;

          // Glowing photon circle
          const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3.5);
          grad.addColorStop(0, 'rgba(34, 211, 238, 0.95)');
          grad.addColorStop(0.4, 'rgba(6, 182, 212, 0.6)');
          grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, p.size * 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Loop continuous packets
        if (p.progress > 1) {
          p.progress = 0;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [activeTopology]);

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
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-cyan-950/60 group">
      {/* Background Neural Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />

      {/* Futuristic Background Liquid Ribbon Asset */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen overflow-hidden">
        <img
          src="/images/hero_liquid_ribbon.jpg"
          alt="Abstract Digital Topology"
          className="w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Dynamic Animated Ambient Neon Arc */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-28 bg-cyan-500/20 blur-[60px] pointer-events-none z-0" />

      {/* Major Technical Line for Dashboard: High-Throughput Real-Time Infrastructure */}
      <div className="relative z-20 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-cyan-950/90 via-slate-900/95 to-blue-950/90 border-b border-cyan-500/25 flex items-center justify-between text-[11px] font-mono shadow-[0_4px_20px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-2 text-cyan-300">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-bold tracking-wider text-white">SYSTEM TELEMETRY ENGINE</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-cyan-400 font-medium">DISTRIBUTED RUNTIME</span>
        </div>

        {/* Live Audio/Data Equalizer Activity Wave */}
        <div className="flex items-center gap-1.5 h-3.5" title="Network Activity Waveform">
          {equalizerHeights.map((h, idx) => (
            <span
              key={idx}
              style={{ height: `${h}%` }}
              className={`w-0.5 rounded-full transition-all duration-300 ${
                isSurging ? 'bg-cyan-300' : 'bg-cyan-500/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Top Header Bar: Architecture Selector Tabs + Interactive Traffic Simulator */}
      <div className="relative z-20 px-5 pt-3.5 pb-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
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

        {/* Interactive Simulate Surge Button + Live Latency */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSimulateTraffic}
            disabled={isSurging}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-all cursor-pointer ${
              isSurging
                ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)] scale-105'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border-cyan-500/30 hover:border-cyan-400'
            }`}
            title="Inject simulated load test packet into the mesh"
          >
            <Zap className={`w-3 h-3 ${isSurging ? 'animate-bounce' : 'text-amber-400'}`} />
            <span>{isSurging ? 'Surge 100k' : 'Simulate Load'}</span>
          </button>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isSurging ? 'bg-cyan-300 animate-ping' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span className="tabular-nums font-semibold">{pingLatency}ms</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Topology SVG Canvas Area */}
      <div className="relative z-10 w-full h-[280px] sm:h-[300px] p-4 select-none">
        {/* SVG Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={lineGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id={activeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {activeTopology.connections.map(([fromId, toId]) => {
            const fromNode = activeTopology.nodes.find((n) => n.id === fromId);
            const toNode = activeTopology.nodes.find((n) => n.id === toId);
            if (!fromNode || !toNode) return null;

            const isHighlighted =
              hoveredNode === fromId ||
              hoveredNode === toId ||
              selectedNode === fromId ||
              selectedNode === toId;

            return (
              <g key={`${fromId}-${toId}`}>
                {/* Circuit Track */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={isHighlighted || isSurging ? `url(#${activeGradId})` : 'rgba(6, 182, 212, 0.28)'}
                  strokeWidth={isHighlighted || isSurging ? '2.5' : '1.5'}
                  strokeDasharray={isHighlighted || isSurging ? 'none' : '3 3'}
                  className="transition-all duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* Interactive Node Anchors */}
        {activeTopology.nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          const isHovered = hoveredNode === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node z-20"
            >
              {/* Outer Pulse Halo on Hover or Selection */}
              {(isSelected || isHovered) && (
                <div className="absolute -inset-2 rounded-2xl bg-cyan-400/20 blur-md animate-pulse pointer-events-none" />
              )}

              <div
                className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-cyan-500/30 border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)] scale-120'
                    : isHovered
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110'
                    : 'bg-slate-900/90 border-white/15 hover:border-cyan-400'
                } border backdrop-blur-md`}
              >
                {getNodeIcon(node.icon)}
                {/* Active Status Pip */}
                <span
                  className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-slate-950 ${
                    node.status === 'active'
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : node.status === 'routing'
                      ? 'bg-cyan-400 animate-pulse'
                      : 'bg-sky-400'
                  }`}
                />
              </div>

              {/* Node Mini Label with live latency badge */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap flex flex-col items-center pointer-events-none drop-shadow">
                <span className="text-[10px] font-mono font-medium text-slate-300 group-hover/node:text-cyan-300 transition-colors">
                  {node.label}
                </span>
                <span className="text-[9px] font-mono text-cyan-400/80">
                  {node.latency}
                </span>
              </div>
            </div>
          );
        })}

        {/* Selected Node Spec Inspector Drawer */}
        {selectedNodeData ? (
          <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-slate-950/95 border border-cyan-500/50 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-tight">
                  {selectedNodeData.label}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {selectedNodeData.tech}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  Load: {selectedNodeData.load}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                {selectedNodeData.role} · SLA Latency: {selectedNodeData.latency}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {onStartProject && (
                <button
                  onClick={onStartProject}
                  className="text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Deploy Node
                </button>
              )}
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 pointer-events-none">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Click or hover any node to inspect architecture</span>
            </span>
            <span className="text-cyan-400 font-semibold">{activeTopology.throughput}</span>
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
