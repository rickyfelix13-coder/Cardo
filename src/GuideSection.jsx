import { useState, useEffect } from "react";

// ─── EDIT THESE TWO IF YOU WANT ─────────────────────────────
const GUIDE_PRICE = 14;                              // change the price here
const GUIDE_PDF = "/the-discipline-blueprint.pdf";   // file lives in /public
// ────────────────────────────────────────────────────────────

const INCLUDED = [
  ["01", "The four rules of fat loss", "The only principles that actually matter — everything else is noise."],
  ["02", "Find YOUR numbers", "How to calculate your own calories, deficit and protein. Built for your body, not mine."],
  ["03", "How I ate", "Protein-first meals, the satiety hacks, the planned treat, and honest tracking."],
  ["04", "How I trained", "The Push/Pull/Legs system, progressive overload, and how to start where you actually are."],
  ["05", "The recovery playbook", "The part nobody teaches — how I avoid burnout and keep it off for good."],
  ["06", "Your first 7 days", "A day-by-day starting plan so you're moving by tonight, not 'someday'."],
];

export default function GuideSection() {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  // Show the download panel if the buyer just came back from Stripe checkout.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true" && params.get("product") === "guide") {
      setPurchased(true);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "guide",
          productName: "THE DISCIPLINE BLUEPRINT",
          productDesc: "How I lost 150 lbs — the full system. Instant PDF download.",
          price: GUIDE_PRICE,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ─── SUCCESS / DOWNLOAD PANEL ───────────────────────────────
  if (purchased) {
    return (
      <div className="section-enter" style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ width: "48px", height: "48px", border: "1px solid #3a3028", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span style={{ color: "#8a7060", fontSize: "20px" }}>✓</span>
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "44px", letterSpacing: "2px", marginBottom: "12px" }}>YOU'RE IN.</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: "300", color: "#5a5040", lineHeight: "1.9", marginBottom: "32px", maxWidth: "420px", margin: "0 auto 32px" }}>
          The Discipline Blueprint is yours. Download it below and start on day one tonight. No days off.
        </p>
        <a href={GUIDE_PDF} download className="buy-btn" style={{ display: "inline-block", padding: "15px 32px", background: "#e8d5b0", color: "#080808", textDecoration: "none" }}>
          DOWNLOAD THE GUIDE
        </a>
      </div>
    );
  }

  // ─── SALES PAGE ─────────────────────────────────────────────
  return (
    <div className="section-enter">
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#3a3028", marginBottom: "8px" }}>150 LBS DOWN · THE FULL SYSTEM</p>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "52px", letterSpacing: "1px", lineHeight: 1 }}>THE DISCIPLINE<br />BLUEPRINT</h2>
      </div>

      {/* Pitch block */}
      <div style={{ background: "linear-gradient(140deg,#0f0f0d 0%,#0a0a08 100%)", border: "1px solid #1c1810", padding: "40px", marginBottom: "2px" }}>
        {[
          "I lost 150 pounds. Not with a secret, a tea, or a 21-day shred — with a system I ran, consistently, for a long time.",
          "This is that system, written down. What I ate, how I trained, how I stayed consistent when it got slow, and how I keep it off. Built so you can find YOUR numbers and follow it in a real life with a real job.",
          "No fluff. No guru pricing. Just the exact blueprint — so you can stop guessing and start tonight.",
        ].map((t, i) => (
          <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: "300", lineHeight: "1.9", color: "#5a5040", marginBottom: "14px" }}>{t}</p>
        ))}
      </div>

      {/* What's inside */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "#0f0f0d", marginTop: "2px" }}>
        {INCLUDED.map(([num, title, desc]) => (
          <div key={num} style={{ background: "#080806", padding: "24px 32px", display: "flex", gap: "24px", alignItems: "flex-start" }}>
            <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "22px", letterSpacing: "1px", color: "#3a3028", flexShrink: 0, minWidth: "32px" }}>{num}</p>
            <div>
              <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "20px", letterSpacing: "1px", marginBottom: "6px" }}>{title}</h4>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: "300", lineHeight: "1.8", color: "#4a4035" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Buy bar */}
      <div style={{ marginTop: "36px", border: "1px solid #1c1810", padding: "40px", textAlign: "center", background: "#050504" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", letterSpacing: "4px", color: "#3a3028", marginBottom: "10px" }}>INSTANT PDF DOWNLOAD</p>
        <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "56px", letterSpacing: "1px", color: "#e8d5b0", lineHeight: 1, marginBottom: "24px" }}>${GUIDE_PRICE}</p>
        <button
          onClick={handleBuy}
          disabled={loading}
          style={{ width: "100%", maxWidth: "360px", padding: "16px", fontFamily: "'DM Sans',sans-serif", fontSize: "11px", letterSpacing: "3px", fontWeight: "500", background: loading ? "#1c1810" : "#e8d5b0", color: loading ? "#3a3028" : "#080808", border: "none", cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase", transition: "all 0.2s" }}
        >
          {loading ? "REDIRECTING TO CHECKOUT..." : "GET THE BLUEPRINT"}
        </button>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "9px", letterSpacing: "2px", color: "#1c1810", marginTop: "14px" }}>SECURED BY STRIPE · INSTANT DELIVERY</p>
      </div>

      {/* Honest disclaimer — keep this */}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", fontWeight: "300", lineHeight: "1.8", color: "#2a2520", textAlign: "center", marginTop: "24px", maxWidth: "560px", margin: "24px auto 0" }}>
        This guide is my personal experience and general information only — not medical, nutrition, or fitness advice, and not a substitute for a professional. Talk to your doctor before starting any diet or exercise program. Results vary from person to person.
      </p>
    </div>
  );
}
