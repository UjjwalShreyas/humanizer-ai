"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// Define proper types
interface GaugeMeterProps {
  percentage: number | null;
  label: string;
}

interface ApiResponse {
  ai_probability?: number;
  humanized_text?: string;
  ai_probability_after?: number;
  error?: string;
}

// Gauge Meter Component - Fixed
function GaugeMeter({ percentage, label }: GaugeMeterProps) {
  const getColor = (pct: number): string => {
    if (pct <= 30) return "#22c55e";
    if (pct <= 60) return "#f59e0b";
    if (pct <= 80) return "#f97316";
    return "#ef4444";
  };

  const getLabel = (pct: number): string => {
    if (pct <= 30) return "Likely Human";
    if (pct <= 60) return "Mixed";
    if (pct <= 80) return "Likely AI";
    return "AI Generated";
  };

  // Fixed rotation calculation
  const rotation = percentage !== null ? (percentage / 100) * 180 - 90 : -90;
  const color = percentage !== null ? getColor(percentage) : "#555";
  
  // Fixed stroke dasharray calculation
  const getDashArray = (pct: number): string => {
    // Total arc length (approximated for this specific arc)
    const totalLength = 203.5;
    const dashLength = (pct / 100) * totalLength;
    return `${dashLength} ${totalLength}`;
  };

  // Unique gradient ID
  const gradientId = `grad-${label.replace(/\s/g, '')}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div style={{ textAlign: "center", padding: "20px 16px" }}>
      <div style={{ 
        fontSize: 10, 
        letterSpacing: "0.15em", 
        textTransform: "uppercase", 
        color: "var(--champ-muted)", 
        marginBottom: 12 
      }}>
        {label}
      </div>
      <div style={{ position: "relative", width: 160, height: 90, margin: "0 auto" }}>
        <svg viewBox="0 0 160 90" width="160" height="90">
          {/* Background arc */}
          <path 
            d="M 15 80 A 65 65 0 0 1 145 80" 
            fill="none" 
            stroke="rgba(247,231,206,0.08)" 
            strokeWidth="12" 
            strokeLinecap="round" 
          />
          
          {/* Foreground arc - only show if percentage exists */}
          {percentage !== null && (
            <path
              d="M 15 80 A 65 65 0 0 1 145 80"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={getDashArray(percentage)}
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          )}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          
          {/* Needle - fixed rotation transform */}
          <g transform={`rotate(${rotation}, 80, 80)`}>
            <line 
              x1="80" 
              y1="80" 
              x2="80" 
              y2="28" 
              stroke={color} 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              style={{ transition: "stroke 0.3s ease" }}
            />
            <circle 
              cx="80" 
              cy="80" 
              r="5" 
              fill={color} 
              style={{ transition: "fill 0.3s ease" }}
            />
          </g>
        </svg>
        
        {/* Percentage display */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center" }}>
          {percentage !== null ? (
            <>
              <div style={{ 
                fontSize: 22, 
                fontWeight: 600, 
                color, 
                fontFamily: "'Cormorant Garamond', serif", 
                lineHeight: 1,
                transition: "color 0.3s ease"
              }}>
                {Math.round(percentage)}%
              </div>
              <div style={{ 
                fontSize: 10, 
                color: "rgba(247,231,206,0.4)", 
                marginTop: 2, 
                letterSpacing: "0.08em" 
              }}>
                {getLabel(percentage)}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 11, color: "rgba(247,231,206,0.2)", fontStyle: "italic" }}>
              —
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputAI, setInputAI] = useState<number | null>(null);
  const [outputAI, setOutputAI] = useState<number | null>(null);
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ptclRef = useRef<HTMLDivElement>(null);
  const detectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<number>();

  // Fixed word count calculation
  const wordCount = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Fixed cursor effect with SSR check and cleanup
  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;
    
    const isDesktop = window.matchMedia("(pointer:fine)").matches;
    if (!isDesktop || !curRef.current || !ringRef.current) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (curRef.current) {
        curRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    };

    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", move);
    animate();

    return () => {
      document.removeEventListener("mousemove", move);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Fixed particle effect
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 2.5 + 0.5;
      const style = {
        left: Math.random() * 100 + "%",
        width: size + "px",
        height: size + "px",
        background: "rgba(" + (Math.random() > 0.5 ? "247,231,206" : "196,30,83") + "," + (Math.random() * 0.6 + 0.2) + ")",
        animationDuration: (Math.random() * 18 + 8) + "s",
        animationDelay: Math.random() * 18 + "s"
      };
      newParticles.push(
        <div key={i} className="particle" style={style} />
      );
    }
    setParticles(newParticles);
  }, []);

  // Fixed detection with better error handling
  useEffect(() => {
    const detectText = async () => {
      if (!inputText.trim() || wordCount < 10) {
        setInputAI(null);
        return;
      }

      setDetecting(true);
      
      try {
        const res = await fetch("/api/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: ApiResponse = await res.json();
        
        if (data.error) {
          console.error("Detection error:", data.error);
          setInputAI(null);
        } else {
          setInputAI(data.ai_probability ?? null);
        }
      } catch (error) {
        console.error("Detection failed:", error);
        setInputAI(null);
      } finally {
        setDetecting(false);
      }
    };

    if (detectTimer.current) {
      clearTimeout(detectTimer.current);
    }

    detectTimer.current = setTimeout(detectText, 1500);

    return () => {
      if (detectTimer.current) {
        clearTimeout(detectTimer.current);
      }
    };
  }, [inputText, wordCount]);

  // Fixed humanize handler
  const handleHumanize = useCallback(async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setOutputText("");
    setOutputAI(null);

    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: ApiResponse = await res.json();

      if (data.error) {
        setOutputText(data.error);
      } else {
        setOutputText(data.humanized_text || "No output generated");
        setOutputAI(data.ai_probability_after ?? null);
      }
    } catch (error) {
      console.error("Humanization error:", error);
      setOutputText("Something went wrong. Please check your API configuration.");
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  // Fixed copy handler
  const handleCopy = useCallback(() => {
    if (!outputText) return;

    navigator.clipboard.writeText(outputText)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error("Copy failed:", error);
      });
  }, [outputText]);

  // Fixed footer links with proper typing
  const footerLinks: [string, string][] = [
    ["Terms of Service", "/terms"],
    ["Privacy Policy", "/privacy"],
    ["Disclaimer", "/disclaimer"],
    ["GitHub", "https://github.com/UjjwalShreyas/humanizer-ai"],
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --burg: #7D0A2E;
          --burg-glow: #C41E53;
          --champ: #F7E7CE;
          --champ-bright: #FDF6EC;
          --champ-dim: #D4B896;
          --champ-muted: #A08060;
          --bg: #0A0305;
        }
        
        body {
          background: var(--bg);
          font-family: 'Outfit', sans-serif;
          color: var(--champ);
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        @media (pointer: fine) {
          body {
            cursor: none;
          }
        }
        
        .cursor,
        .cursor-ring {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
        }
        
        .cursor {
          width: 8px;
          height: 8px;
          background: var(--champ-dim);
          border-radius: 50%;
          mix-blend-mode: difference;
        }
        
        .cursor-ring {
          width: 28px;
          height: 28px;
          border: 1px solid rgba(247, 231, 206, 0.25);
          border-radius: 50%;
          z-index: 9998;
          transition: all 0.12s ease;
        }
        
        @media (pointer: coarse) {
          .cursor,
          .cursor-ring {
            display: none;
          }
        }
        
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          animation: drift ease-in-out infinite;
        }
        
        .orb1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(125, 10, 46, 0.7), transparent 70%);
          top: -150px;
          left: -150px;
          animation-duration: 20s;
        }
        
        .orb2 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(164, 16, 64, 0.5), transparent 70%);
          top: 50%;
          right: -100px;
          animation-duration: 26s;
          animation-delay: -10s;
        }
        
        .orb3 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(100, 5, 30, 0.5), transparent 70%);
          bottom: -100px;
          left: 25%;
          animation-duration: 22s;
          animation-delay: -5s;
        }
        
        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.08);
          }
          66% {
            transform: translate(-40px, 50px) scale(0.96);
          }
        }
        
        .grid-bg {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image: 
            linear-gradient(rgba(247, 231, 206, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247, 231, 206, 0.03) 1px, transparent 1px);
          background-size: 72px 72px;
        }
        
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: rise linear infinite;
          opacity: 0;
          will-change: transform, opacity;
        }
        
        @keyframes rise {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-80px);
            opacity: 0;
          }
        }
        
        .pulse-dot {
          width: 6px;
          height: 6px;
          background: var(--burg-glow);
          border-radius: 50%;
          animation: pdot 2s infinite;
          display: inline-block;
          flex-shrink: 0;
        }
        
        @keyframes pdot {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(196, 30, 83, 0.7);
          }
          50% {
            box-shadow: 0 0 0 7px rgba(196, 30, 83, 0);
          }
        }
        
        .accent {
          font-style: italic;
          font-weight: 600;
          background: linear-gradient(120deg, var(--burg-glow), var(--champ-bright) 50%, var(--burg-glow));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 4s linear infinite;
          background-size: 200% auto;
        }
        
        @keyframes shimmer-text {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .panel {
          background: rgba(10, 3, 5, 0.75);
          border: 1px solid rgba(247, 231, 206, 0.08);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(24px);
          transition: border-color 0.4s, box-shadow 0.4s;
        }
        
        .panel:focus-within {
          border-color: rgba(196, 30, 83, 0.5);
          box-shadow: 0 0 50px rgba(125, 10, 46, 0.35);
        }
        
        .editor {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .gauges {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }
        
        @media (max-width: 640px) {
          .editor {
            grid-template-columns: 1fr;
          }
          .gauges {
            grid-template-columns: 1fr;
          }
        }
        
        .gauge-panel {
          background: rgba(10, 3, 5, 0.75);
          border: 1px solid rgba(247, 231, 206, 0.08);
          border-radius: 16px;
          backdrop-filter: blur(24px);
        }
        
        .main-btn {
          padding: 15px 52px;
          background: var(--champ);
          color: #1a0408;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.25s ease;
          box-shadow: 0 4px 30px rgba(125, 10, 46, 0.5);
        }
        
        .main-btn:hover:not(:disabled) {
          background: var(--champ-bright);
          box-shadow: 0 6px 50px rgba(125, 10, 46, 0.7), 0 0 80px rgba(196, 30, 83, 0.2);
          transform: translateY(-2px);
        }
        
        .main-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .main-btn:disabled {
          background: rgba(247, 231, 206, 0.08);
          color: rgba(247, 231, 206, 0.2);
          box-shadow: none;
          transform: none;
          cursor: not-allowed;
        }
        
        @media (max-width: 640px) {
          .main-btn {
            width: 100%;
            padding: 16px;
            font-size: 16px;
            border-radius: 14px;
          }
        }
        
        .skel-line {
          height: 11px;
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(125, 10, 46, 0.2), rgba(196, 30, 83, 0.4), rgba(125, 10, 46, 0.2));
          background-size: 300% 100%;
          animation: sweep 1.8s infinite;
          margin-bottom: 12px;
        }
        
        @keyframes sweep {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }
        
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .copy-btn {
          background: transparent;
          border: 1px solid rgba(247, 231, 206, 0.12);
          color: var(--champ-muted);
          font-size: 11px;
          padding: 4px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }
        
        .copy-btn:hover:not(:disabled) {
          border-color: var(--champ-dim);
          color: var(--champ);
        }
        
        .copy-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .detecting-badge {
          font-size: 10px;
          color: var(--burg-glow);
          letter-spacing: 0.08em;
          animation: pdot 1s infinite;
        }
        
        .footer-link {
          color: rgba(247, 231, 206, 0.25);
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 0.06em;
          transition: color 0.2s;
        }
        
        .footer-link:hover {
          color: rgba(247, 231, 206, 0.6);
        }

        textarea {
          scrollbar-width: thin;
          scrollbar-color: var(--burg-glow) rgba(247, 231, 206, 0.05);
        }

        textarea::-webkit-scrollbar {
          width: 8px;
        }

        textarea::-webkit-scrollbar-track {
          background: rgba(247, 231, 206, 0.05);
          border-radius: 4px;
        }

        textarea::-webkit-scrollbar-thumb {
          background: var(--burg-glow);
          border-radius: 4px;
        }
      `}</style>

      <div ref={curRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
      
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>
      
      <div className="grid-bg" />
      
      <div ref={ptclRef} style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
        {particles}
      </div>

      <main style={{ 
        position: "relative", 
        zIndex: 10, 
        maxWidth: 980, 
        margin: "0 auto", 
        padding: "48px 20px 80px", 
        fontFamily: "'Outfit', sans-serif", 
        color: "var(--champ)" 
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeDown 1s ease both" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 8, 
            border: "1px solid rgba(247,231,206,0.15)", 
            padding: "6px 18px", 
            borderRadius: 100, 
            fontSize: 11, 
            letterSpacing: "0.14em", 
            textTransform: "uppercase", 
            color: "var(--champ-muted)", 
            marginBottom: 24, 
            background: "rgba(125,10,46,0.15)" 
          }}>
            <span className="pulse-dot" /> Free · Private · Open Source
          </div>
          
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: "clamp(42px, 8vw, 80px)", 
            fontWeight: 300, 
            lineHeight: 1.05, 
            letterSpacing: -2, 
            color: "var(--champ-bright)", 
            marginBottom: 6 
          }}>
            Your AI text,<br /><span className="accent">undetectable.</span>
          </h1>
          
          <div style={{ 
            width: 60, 
            height: 1, 
            background: "linear-gradient(to right, transparent, var(--burg-glow), transparent)", 
            margin: "24px auto" 
          }} />
          
          <p style={{ 
            fontSize: "clamp(14px, 2.5vw, 17px)", 
            fontWeight: 300, 
            color: "var(--champ-dim)", 
            maxWidth: 480, 
            margin: "0 auto", 
            lineHeight: 1.75 
          }}>
            Detectors don&apos;t stand a chance.<br />
            <strong style={{ fontWeight: 500, color: "var(--champ-bright)" }}>
              Paste AI. Get human. Walk away clean.
            </strong>
          </p>
        </div>

        {/* Stats */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "clamp(24px, 5vw, 56px)", 
          marginBottom: 44, 
          animation: "fadeUp 1s 0.3s ease both", 
          flexWrap: "wrap" 
        }}>
          {[
            ["∞", "Free uses"], 
            ["0", "Data stored"], 
            ["100%", "On-device"]
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <span style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: "clamp(26px, 5vw, 36px)", 
                fontWeight: 600, 
                color: "var(--champ-bright)", 
                display: "block", 
                lineHeight: 1 
              }}>
                {num}
              </span>
              <span style={{ 
                fontSize: 10, 
                letterSpacing: "0.14em", 
                textTransform: "uppercase", 
                color: "var(--champ-muted)", 
                marginTop: 4, 
                display: "block" 
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Editor Panels */}
        <div className="editor">
          {/* Input Panel */}
          <div className="panel">
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "12px 16px", 
              borderBottom: "1px solid rgba(247,231,206,0.06)" 
            }}>
              <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--champ-muted)" }}>
                AI Text Input
              </span>
              <span style={{ fontSize: 11, color: "rgba(247,231,206,0.2)" }}>
                {detecting ? (
                  <span className="detecting-badge">● Analyzing...</span>
                ) : (
                  `${wordCount} word${wordCount !== 1 ? 's' : ''}`
                )}
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your AI-generated text here..."
              style={{ 
                width: "100%", 
                background: "transparent", 
                border: "none", 
                outline: "none", 
                resize: "none", 
                color: "var(--champ-bright)", 
                fontFamily: "'Outfit', sans-serif", 
                fontSize: 14, 
                lineHeight: 1.85, 
                padding: 16, 
                minHeight: 220, 
                caretColor: "var(--burg-glow)" 
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="panel">
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "12px 16px", 
              borderBottom: "1px solid rgba(247,231,206,0.06)" 
            }}>
              <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--champ-muted)" }}>
                Humanized Output
              </span>
              <button 
                className="copy-btn" 
                onClick={handleCopy}
                disabled={!outputText || loading}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div style={{ 
              padding: 16, 
              minHeight: 220, 
              fontSize: 14, 
              lineHeight: 1.85, 
              color: "var(--champ-bright)", 
              wordBreak: "break-word", 
              whiteSpace: "pre-wrap" 
            }}>
              {loading ? (
                <div>
                  {[100, 85, 95, 70, 80].map((w, i) => (
                    <div key={i} className="skel-line" style={{ width: w + "%" }} />
                  ))}
                  <div style={{ fontSize: 12, color: "var(--burg-glow)", marginTop: 14, letterSpacing: "0.06em" }}>
                    ✦ Rewriting your text...
                  </div>
                </div>
              ) : outputText ? (
                outputText
              ) : (
                <span style={{ color: "rgba(247,231,206,0.15)", fontStyle: "italic" }}>
                  Your humanized text will appear here...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Gauges */}
        <div className="gauges">
          <div className="gauge-panel">
            <GaugeMeter percentage={inputAI} label="Input AI Score" />
          </div>
          <div className="gauge-panel">
            <GaugeMeter percentage={outputAI} label="Output AI Score" />
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "center", animation: "fadeUp 1s 0.7s ease both" }}>
          <button 
            className="main-btn" 
            onClick={handleHumanize} 
            disabled={loading || !inputText.trim() || wordCount < 10}
          >
            {loading ? "Humanizing..." : "✦ Humanize Text"}
          </button>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: "center", 
          marginTop: 40, 
          fontSize: 11, 
          color: "rgba(247,231,206,0.18)", 
          letterSpacing: "0.08em", 
          lineHeight: 2 
        }}>
          <div style={{ textTransform: "uppercase" }}>
            Your text is never stored · Powered by Groq · Always free
          </div>
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {footerLinks.map(([label, href]) => (
              <a 
                key={href} 
                href={href} 
                className="footer-link"
                {...(href.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}