import Link from "next/link";

export default function Disclaimer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=Outfit:wght@300;400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--burg:#7D0A2E;--burg-glow:#C41E53;--champ:#F7E7CE;--champ-bright:#FDF6EC;--champ-dim:#D4B896;--champ-muted:#A08060;--bg:#0A0305}
        body{background:var(--bg);font-family:'Outfit',sans-serif;color:var(--champ);min-height:100vh}
        .orb{position:fixed;border-radius:50%;filter:blur(90px);animation:drift ease-in-out infinite;z-index:0}
        .orb1{width:500px;height:500px;background:radial-gradient(circle,rgba(125,10,46,0.5),transparent 70%);top:-100px;left:-100px;animation-duration:20s}
        .orb2{width:400px;height:400px;background:radial-gradient(circle,rgba(164,16,64,0.3),transparent 70%);bottom:-100px;right:-100px;animation-duration:26s}
        @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-30px)}}
      `}</style>

      <div className="orb orb1" /><div className="orb orb2" />

      <main style={{ position: "relative", zIndex: 10, maxWidth: 760, margin: "0 auto", padding: "64px 24px 80px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--champ-muted)", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", marginBottom: 48, border: "1px solid rgba(247,231,206,0.1)", padding: "6px 16px", borderRadius: 100 }}>← Back</Link>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 300, color: "var(--champ-bright)", marginBottom: 8, lineHeight: 1 }}>Disclaimer</h1>
        <p style={{ fontSize: 12, color: "var(--champ-muted)", marginBottom: 48, letterSpacing: "0.08em" }}>Last updated: March 2026</p>

        {[
          ["Intended Use", "AI Humanizer is designed for legitimate purposes including improving the readability of AI-assisted drafts, adapting writing tone and style, learning how to write more naturally, and processing your own original content."],
          ["User Responsibility", "You are solely responsible for how you use this tool and its output. AI Humanizer does not endorse, encourage, or facilitate academic dishonesty, fraud, or any deceptive practices. Any misuse of this tool is entirely the responsibility of the user."],
          ["No Guarantee of Results", "AI detection technology is constantly evolving. We do not guarantee that text processed through AI Humanizer will pass any specific AI detector. Results may vary depending on the detector used, the length of text, and other factors outside our control."],
          ["Not Legal Advice", "Nothing on this website constitutes legal advice. If you have concerns about the legality of using AI-generated content in your specific context, consult a qualified legal professional."],
          ["Accuracy of Output", "While we strive for high quality output, AI Humanizer may occasionally produce text that contains errors, awkward phrasing, or unintended changes in meaning. Always review the output before use."],
        ].map(([title, body]) => (
          <div key={title} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid rgba(247,231,206,0.06)" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "var(--champ-bright)", marginBottom: 12 }}>{title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--champ-dim)", fontWeight: 300 }}>{body}</p>
          </div>
        ))}
      </main>
    </>
  );
}