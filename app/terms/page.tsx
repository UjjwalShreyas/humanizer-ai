export default function Terms() {
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

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 300, color: "var(--champ-bright)", marginBottom: 8, lineHeight: 1 }}>Terms of Service</h1>
        <p style={{ fontSize: 12, color: "var(--champ-muted)", marginBottom: 48, letterSpacing: "0.08em" }}>Last updated: March 2026</p>

        {[
          ["1. Acceptance of Terms", "By accessing or using AI Humanizer, you agree to be bound by these Terms of Service. If you do not agree, please do not use this service."],
          ["2. Description of Service", "AI Humanizer is a free tool that rewrites AI-generated text to sound more natural and human. The service is provided as-is with no guarantees of specific outcomes including but not limited to bypassing any particular AI detection system."],
          ["3. Acceptable Use", "You agree to use this service only for lawful purposes. You must not use AI Humanizer to engage in academic dishonesty, fraud, deception of employers or institutions, creation of misleading content intended to harm others, or any activity that violates applicable laws or regulations. You are solely responsible for how you use the output of this service."],
          ["4. No Liability for Misuse", "AI Humanizer is a text rewriting tool. We are not responsible for how users choose to use the rewritten text. By using this service, you acknowledge that you are solely responsible for any consequences arising from your use of the output. This tool is intended for legitimate purposes such as improving readability, adapting writing style, and learning."],
          ["5. No Warranties", "This service is provided on an as-is and as-available basis without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or that results will meet your specific requirements."],
          ["6. Intellectual Property", "You retain full ownership of any text you submit to this service. We do not claim any rights over your input or output content."],
          ["7. Changes to Terms", "We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms."],
          ["8. Contact", "For any questions regarding these terms, you may contact us through the website."],
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