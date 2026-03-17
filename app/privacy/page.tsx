export default function Privacy() {
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
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--champ-muted)", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", marginBottom: 48, border: "1px solid rgba(247,231,206,0.1)", padding: "6px 16px", borderRadius: 100 }}>← Back</a>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 300, color: "var(--champ-bright)", marginBottom: 8, lineHeight: 1 }}>Privacy Policy</h1>
        <p style={{ fontSize: 12, color: "var(--champ-muted)", marginBottom: 48, letterSpacing: "0.08em" }}>Last updated: March 2026</p>

        {[
          ["Our Core Promise", "We do not store, log, sell, or share any text you submit to AI Humanizer. Your content is processed in memory and immediately discarded after your result is returned. We built this tool with privacy as a first principle, not an afterthought."],
          ["What We Collect", "We collect nothing. No account is required. No email, no name, no personal information of any kind is collected or stored. We do not use cookies for tracking. We do not run analytics that identify individual users."],
          ["How Your Text is Processed", "When you submit text, it is sent to Groq's API for processing. Groq processes your request and returns a result. We do not store your input or output on any server or database. Groq's own privacy policy governs their handling of API requests — you can review it at groq.com."],
          ["Third Party Services", "We use Groq as our AI processing provider. No other third party services have access to your text. We do not use advertising networks, tracking pixels, or analytics services that collect personal data."],
          ["Children's Privacy", "This service is not directed at children under 13. We do not knowingly collect any information from children."],
          ["Changes to This Policy", "We may update this policy occasionally. Any changes will be reflected on this page with an updated date. Continued use of the service constitutes acceptance."],
          ["Contact", "If you have any questions about this privacy policy, you may reach us through the website."],
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