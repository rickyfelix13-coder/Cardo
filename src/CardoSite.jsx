import { useState, useEffect, useRef } from "react";

const tracks = [
  { id: 1,  title: "THROW IT IN", bpm: 87,  key: "", lease: 29.99, exclusive: 149.99, tag: "LEASE",     duration: "3:00", sc: "https://soundcloud.com/ricky_felix/throw-it-in-1" },
  { id: 2,  title: "PLANE SITE",  bpm: 128, key: "", lease: 29.99, exclusive: 149.99, tag: "LEASE",     duration: "3:00", sc: "https://soundcloud.com/ricky_felix/plane-site" },
  { id: 3,  title: "NEED YOU",    bpm: 157, key: "", lease: 29.99, exclusive: 149.99, tag: "EXCLUSIVE", duration: "3:00", sc: "https://soundcloud.com/ricky_felix/needyou" },
  { id: 4,  title: "I KNOW",      bpm: 140, key: "", lease: 29.99, exclusive: 149.99, tag: "LEASE",     duration: "3:00", sc: "https://soundcloud.com/ricky_felix/i-know" },
  { id: 5,  title: "GOONIES",     bpm: 142, key: "", lease: 29.99, exclusive: 149.99, tag: "LEASE",     duration: "3:00", sc: "https://soundcloud.com/ricky_felix/goonies" },
  { id: 6,  title: "COMEBACK",    bpm: 133, key: "", lease: 29.99, exclusive: 149.99, tag: "LEASE",     duration: "3:00", sc: "https://soundcloud.com/ricky_felix/comeback" },
  { id: 7,  title: "BLUE WORK",   bpm: 136, key: "", lease: 29.99, exclusive: 149.99, tag: "LEASE",     duration: "3:00", sc: "https://soundcloud.com/ricky_felix/blue-work" },
  { id: 8,  title: "BLOW IT OFF", bpm: 160, key: "", lease: 29.99, exclusive: 149.99, tag: "EXCLUSIVE", duration: "3:00", sc: "https://soundcloud.com/ricky_felix/blowitoff" },
  { id: 9,  title: "2030 SOUND",  bpm: 130, key: "", lease: 29.99, exclusive: 149.99, tag: "LEASE",     duration: "3:00", sc: "https://soundcloud.com/ricky_felix/2030sound" },
  { id: 10, title: "TURKISH",     bpm: 147, key: "", lease: 29.99, exclusive: 149.99, tag: "LEASE",     duration: "3:00", sc: "https://soundcloud.com/ricky_felix/turkish" },
];

const posts = [
  { date: "MAY 04", year: "2026", title: "The site is live. The beats are ready.", body: "Built the website from scratch today and finished 5 beats the same night. Blue Work, Goonies, I Know, Need You, Throw It In — all available in the store now. This is what the grind looks like. No days off." },
  { date: "APR 14", year: "2026", title: "New era, same discipline.", body: "Spent the last month restructuring everything. The sound is more intentional now. Less noise, more weight. You'll hear it soon. The gym and the studio are running parallel — both are transforming." },
];

function Waveform({ playing, progress, onSeek }) {
  const heights = useRef(Array.from({ length: 72 }, () => 15 + Math.random() * 85));
  return (
    <div
      onClick={e => { const r = e.currentTarget.getBoundingClientRect(); onSeek((e.clientX - r.left) / r.width); }}
      style={{ display:"flex", alignItems:"center", gap:"2px", height:"44px", cursor:"pointer", flex:1 }}
    >
      {heights.current.map((h, i) => {
        const filled = i / heights.current.length <= progress;
        return (
          <div key={i} style={{
            flex:1, height:`${h}%`, borderRadius:"1px",
            backgroundColor: filled ? "#e8d5b0" : "#1c1810",
            transition:"background-color 0.08s",
            animation: playing && filled ? `wf ${0.3+(i%7)*0.08}s ease-in-out infinite alternate` : "none",
            animationDelay:`${i*0.02}s`,
          }}/>
        );
      })}
    </div>
  );
}

function CheckoutModal({ track, onClose }) {
  const [tier, setTier] = useState("lease");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const price = tier === "lease" ? track.lease : track.exclusive;

  const tiers = [
    { id:"lease",     label:"LEASE",     price:track.lease,     perks:["MP3 Tagged","Non-Exclusive","Up to 5,000 streams","1 music video"] },
    { id:"exclusive", label:"EXCLUSIVE", price:track.exclusive, perks:["WAV Untagged","Full Exclusivity","Unlimited streams","Stems included","Full ownership transfer"] },
  ];

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beatTitle: track.title, tier, price }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)",animation:"fadeIn 0.2s ease" }}>
      <div style={{ background:"#0c0c0a",border:"1px solid #1c1810",width:"100%",maxWidth:"500px",margin:"20px",animation:"slideUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding:"26px 32px",borderBottom:"1px solid #141410",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"3px",color:"#3a3028",marginBottom:"4px" }}>LICENSING</p>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"22px",letterSpacing:"1px" }}>{track.title}</h3>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#3a3028",cursor:"pointer",fontSize:"18px",lineHeight:1 }}>✕</button>
        </div>

        {step === 1 && (
          <div style={{ padding:"28px 32px" }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"24px" }}>
              {tiers.map(t => (
                <div key={t.id} onClick={() => setTier(t.id)} style={{
                  padding:"20px",border:`1px solid ${tier===t.id?"#6a5f50":"#1c1810"}`,
                  cursor:"pointer",transition:"border-color 0.2s",background:tier===t.id?"#111":""
                }}>
                  <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"3px",color:tier===t.id?"#8a7060":"#3a3028",marginBottom:"6px" }}>{t.label}</p>
                  <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"28px",letterSpacing:"1px",color:"#e8d5b0",marginBottom:"14px" }}>${t.price}</p>
                  {t.perks.map(p => (
                    <p key={p} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",color:"#4a4035",display:"flex",gap:"6px",alignItems:"center",marginBottom:"4px" }}>
                      <span style={{ color:tier===t.id?"#6a5f50":"#2a2a2a" }}>—</span>{p}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} style={{ width:"100%",padding:"15px",fontFamily:"'DM Sans',sans-serif",fontSize:"11px",letterSpacing:"3px",fontWeight:"500",background:"#e8d5b0",color:"#080808",border:"none",cursor:"pointer",textTransform:"uppercase" }}>
              Continue — ${price}
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding:"28px 32px" }}>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"3px",color:"#3a3028",marginBottom:"20px" }}>ORDER SUMMARY</p>
            <div style={{ background:"#0a0a08",border:"1px solid #1c1810",padding:"20px",marginBottom:"20px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"8px" }}>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",letterSpacing:"1px" }}>{track.title}</p>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",color:"#8a7060" }}>${price}</p>
              </div>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",color:"#3a3028",letterSpacing:"2px" }}>{tier.toUpperCase()} LICENSE</p>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",color:"#2a2520",marginTop:"8px" }}>
                {tier === "lease" ? "MP3 Tagged · Non-Exclusive · Up to 5,000 streams" : "WAV Untagged · Full Exclusivity · Unlimited streams · Stems included"}
              </p>
            </div>
            <button onClick={handlePay} disabled={loading} style={{ width:"100%",padding:"15px",fontFamily:"'DM Sans',sans-serif",fontSize:"11px",letterSpacing:"3px",fontWeight:"500",background:loading?"#1c1810":"#e8d5b0",color:loading?"#3a3028":"#080808",border:"none",cursor:loading?"not-allowed":"pointer",textTransform:"uppercase",transition:"all 0.2s" }}>
              {loading ? "REDIRECTING TO CHECKOUT..." : `PAY $${price}`}
            </button>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"2px",color:"#1c1810",textAlign:"center",marginTop:"10px" }}>SECURED BY STRIPE · INSTANT DELIVERY TO YOUR EMAIL</p>
          </div>
        )}


      </div>
    </div>
  );
}

export default function CardoSite() {
  const [active, setActive]   = useState("BEATS");
  const [playing, setPlaying] = useState(null);
  const [progress, setProgress] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [checkout, setCheckout] = useState(null);
  const [successBeat, setSuccessBeat] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setSuccessBeat(params.get("beat") || "your beat");
      window.history.replaceState({}, "", "/");
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (playing !== null) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          const cur = p[playing] ?? 0;
          if (cur >= 1) { clearInterval(intervalRef.current); setPlaying(null); return { ...p, [playing]: 0 }; }
          return { ...p, [playing]: cur + 0.0025 };
        });
      }, 80);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  const togglePlay = id => setPlaying(p => p === id ? null : id);
  const navItems = ["BEATS","MUSIC","JOURNAL","ABOUT"];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#080806;color:#e8d5b0}
    ::-webkit-scrollbar{width:3px}
    ::-webkit-scrollbar-track{background:#080806}
    ::-webkit-scrollbar-thumb{background:#1c1810;border-radius:2px}
    input::placeholder{color:#2a2520}
    input:focus{border-color:#3a3028!important;outline:none}

    @keyframes wf{from{transform:scaleY(0.35)}to{transform:scaleY(1)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes grain{0%,100%{transform:translate(0,0)}20%{transform:translate(-2%,-3%)}40%{transform:translate(3%,2%)}60%{transform:translate(-1%,4%)}80%{transform:translate(2%,-2%)}}}

    .grain-overlay{position:fixed;inset:-50%;width:200%;height:200%;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      opacity:0.032;pointer-events:none;z-index:9998;animation:grain 8s steps(10) infinite}

    .nav-link{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;letter-spacing:3px;text-transform:uppercase;cursor:pointer;border:none;background:none;transition:color 0.2s;padding:0}
    .nav-link:hover{color:#e8d5b0!important}

    .beat-row{display:grid;grid-template-columns:44px 1fr auto auto;align-items:center;gap:20px;padding:18px 24px;border-bottom:1px solid #0f0f0d;cursor:pointer;transition:background 0.2s}
    .beat-row:hover{background:rgba(232,213,176,0.025)}

    .play-btn{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:transparent;cursor:pointer;transition:all 0.2s;flex-shrink:0}
    .play-btn:hover{border-color:#e8d5b0!important}

    .buy-btn{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;letter-spacing:2px;padding:9px 18px;border:1px solid #2a2520;background:transparent;color:#e8d5b0;cursor:pointer;transition:all 0.2s;text-transform:uppercase;white-space:nowrap}
    .buy-btn:hover{background:#e8d5b0;color:#080806;border-color:#e8d5b0}

    .section-enter{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both}

    .journal-card{border:1px solid #0f0f0d;padding:36px;transition:border-color 0.3s;background:#080806}
    .journal-card:hover{border-color:#1c1810}
  `;

  const PlayBtn = ({ id, size = 36 }) => (
    <button
      className="play-btn"
      onClick={() => togglePlay(id)}
      style={{ border:`1px solid ${playing===id?"#e8d5b0":"#1c1810"}`, background:playing===id?"#e8d5b0":"transparent", width:size, height:size }}
    >
      {playing===id
        ? <svg width="10" height="12" viewBox="0 0 10 12" fill="#080806"><rect x="0" y="0" width="3" height="12"/><rect x="7" y="0" width="3" height="12"/></svg>
        : <svg width="10" height="12" viewBox="0 0 10 12" fill="#e8d5b0"><polygon points="0,0 10,6 0,12"/></svg>
      }
    </button>
  );

  const renderBeats = () => (
    <div className="section-enter">
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"48px" }}>
        <div>
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",letterSpacing:"4px",color:"#3a3028",marginBottom:"8px" }}>AVAILABLE NOW</p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"52px",letterSpacing:"1px" }}>BEAT STORE</h2>
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",color:"#2a2520",letterSpacing:"1px" }}>{tracks.length} BEATS</p>
      </div>

      <div style={{ border:"1px solid #0f0f0d" }}>
        {tracks.map(t => (
          <div key={t.id} style={{ borderBottom:"1px solid #0f0f0d", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(232,213,176,0.02)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >
            {/* Top row */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr auto auto",alignItems:"center",gap:"20px",padding:"16px 24px 8px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:"10px",minWidth:0 }}>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",letterSpacing:"1px",whiteSpace:"nowrap" }}>{t.title}</p>
                <span style={{ border:`1px solid ${t.tag==="EXCLUSIVE"?"#3a3020":"#1c1810"}`,color:t.tag==="EXCLUSIVE"?"#7a6850":"#3a3028",fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"2px",padding:"3px 7px",flexShrink:0 }}>{t.tag}</span>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",color:"#2a2520",letterSpacing:"2px",whiteSpace:"nowrap" }}>{t.bpm} BPM</p>
              </div>
              <div style={{ display:"flex",gap:"12px",alignItems:"center",flexShrink:0 }}>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"11px",color:"#5a5040",whiteSpace:"nowrap" }}>
                  L <span style={{ color:"#8a7060" }}>${t.lease}</span>
                  <span style={{ color:"#2a2520",margin:"0 6px" }}>·</span>
                  E <span style={{ color:"#4a3f2a" }}>${t.exclusive}</span>
                </p>
              </div>
              <button className="buy-btn" onClick={()=>setCheckout(t)}>License</button>
            </div>
            {/* SoundCloud player — dark themed */}
            <div style={{ padding:"0 24px 14px", position:"relative" }}>
              <div style={{ borderRadius:"2px", overflow:"hidden", background:"#0a0a08", border:"1px solid #141410" }}>
                <iframe
                  width="100%"
                  height="52"
                  scrolling="no"
                  frameBorder="no"
                  allow="autoplay"
                  src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(t.sc)}&color=%23e8d5b0&inverse=true&auto_play=false&show_user=false&show_artwork=false&show_comments=false&show_reposts=false&show_teaser=false&hide_related=true`}
                  style={{ display:"block", background:"#0a0a08" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"3px",color:"#1a1810",textAlign:"center",marginTop:"18px" }}>UNTAGGED WAV + STEMS ON EXCLUSIVE · INSTANT EMAIL DELIVERY</p>
    </div>
  );

  const renderMusic = () => (
    <div className="section-enter">
      <div style={{ marginBottom:"48px" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",letterSpacing:"4px",color:"#3a3028",marginBottom:"8px" }}>LATEST DROPS</p>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"52px",letterSpacing:"1px" }}>MUSIC</h2>
      </div>

      {/* Featured */}
      <div style={{ background:"linear-gradient(140deg,#0f0f0d 0%,#0a0a08 100%)",border:"1px solid #1c1810",padding:"40px",marginBottom:"2px" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"4px",color:"#3a3028",marginBottom:"14px" }}>LATEST RELEASE</p>
        <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"38px",letterSpacing:"2px",marginBottom:"4px" }}>REMIX TAPE VOL. 1</h3>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"11px",fontStyle:"italic",color:"#3a3028",marginBottom:"28px" }}>12 tracks · 2026</p>
        <div style={{ display:"flex",alignItems:"center",gap:"18px",marginBottom:"24px" }}>
          <PlayBtn id="feat" size={48} />
          <Waveform playing={playing==="feat"} progress={progress["feat"]??0} onSeek={v=>setProgress(p=>({...p,feat:v}))} />
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",color:"#2a2520",minWidth:"32px" }}>
            {String(Math.floor(((progress["feat"]??0)*187)/60)).padStart(2,"0")}:{String(Math.floor(((progress["feat"]??0)*187)%60)).padStart(2,"0")}
          </p>
        </div>
        <div style={{ display:"flex",gap:"10px" }}>
          <button className="buy-btn">SOUNDCLOUD</button>
          <button className="buy-btn">DATPIFF</button>
        </div>
      </div>

      {[{t:"SIGNAL",sub:"SINGLE · 2026"},{t:"NOCTURNE",sub:"EP · 2025"}].map((item,i)=>(
        <div key={i} style={{ background:"#080806",border:"1px solid #0f0f0d",borderTop:"none",padding:"26px 40px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"3px",color:"#2a2520",marginBottom:"5px" }}>{item.sub}</p>
            <h4 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"24px",letterSpacing:"1px" }}>{item.t}</h4>
          </div>
          <button className="buy-btn">STREAM</button>
        </div>
      ))}

      <div style={{ marginTop:"36px",padding:"48px",border:"1px solid #0f0f0d",textAlign:"center",background:"#050504" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"5px",color:"#141410",marginBottom:"10px" }}>INCOMING</p>
        <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"68px",letterSpacing:"4px",color:"#0f0f0d",lineHeight:1 }}>UNTITLED</h3>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",letterSpacing:"2px",color:"#141410",fontStyle:"italic",marginTop:"14px" }}>2026</p>
      </div>
    </div>
  );

  const renderJournal = () => (
    <div className="section-enter">
      <div style={{ marginBottom:"48px" }}>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",letterSpacing:"4px",color:"#3a3028",marginBottom:"8px" }}>THE PROCESS</p>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"52px",letterSpacing:"1px" }}>JOURNAL</h2>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:"1px",background:"#0f0f0d" }}>
        {posts.map((p,i)=>(
          <div key={i} className="journal-card">
            <div style={{ display:"flex",gap:"32px",alignItems:"flex-start" }}>
              <div style={{ flexShrink:0,textAlign:"center",minWidth:"52px" }}>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"24px",color:"#e8d5b0",lineHeight:1 }}>{p.date}</p>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",color:"#2a2520",letterSpacing:"2px" }}>{p.year}</p>
              </div>
              <div style={{ width:"1px",background:"linear-gradient(to bottom,transparent,#1c1810,transparent)",alignSelf:"stretch" }}/>
              <div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"22px",letterSpacing:"1px",marginBottom:"10px" }}>{p.title}</h3>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"13px",fontWeight:"300",lineHeight:"1.9",color:"#5a5040" }}>{p.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="section-enter">
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"56px",alignItems:"start" }}>
        <div>
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",letterSpacing:"4px",color:"#3a3028",marginBottom:"8px" }}>THE STORY</p>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"52px",letterSpacing:"1px",marginBottom:"28px" }}>CARDO</h2>
          {[
            "Producer. Artist. In the process of becoming something bigger than both.",
            "10 years in FL Studio. The craft came first — before any audience, before any income. Just the obsession with building sound from nothing.",
            "Everything here is documentation. The music, the journal, the grind. You're watching it happen in real time.",
          ].map((t,i)=>(
            <p key={i} style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"14px",fontWeight:"300",lineHeight:"1.9",color:"#5a5040",marginBottom:"14px" }}>{t}</p>
          ))}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:"1px",background:"#0f0f0d" }}>
          {[["SINCE","2015"],["DAW","FL STUDIO"],["STATUS","BUILDING"],["GOAL","LEGACY"]].map(([l,v])=>(
            <div key={l} style={{ background:"#080806",padding:"20px 26px",display:"flex",justifyContent:"space-between" }}>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"3px",color:"#2a2520" }}>{l}</p>
              <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",letterSpacing:"2px",color:"#6a5f50" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop:"56px",paddingTop:"36px",borderTop:"1px solid #0f0f0d",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <div>
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"3px",color:"#2a2520",marginBottom:"4px" }}>BOOKINGS & LICENSING</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"13px",color:"#4a3f2a" }}>cardo@email.com</p>
        </div>
        <button className="buy-btn">GET IN TOUCH</button>
      </div>
    </div>
  );

  const sections = { BEATS:renderBeats, MUSIC:renderMusic, JOURNAL:renderJournal, ABOUT:renderAbout };

  return (
    <div style={{ background:"#080806",minHeight:"100vh",color:"#e8d5b0" }}>
      <style>{css}</style>
      <div className="grain-overlay"/>

      {/* NAV */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:500,
        padding:"20px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",
        background:scrolled?"rgba(8,8,6,0.96)":"transparent",
        borderBottom:scrolled?"1px solid #0f0f0d":"1px solid transparent",
        backdropFilter:scrolled?"blur(16px)":"none",
        transition:"all 0.4s",
      }}>
        <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"22px",letterSpacing:"5px" }}>CARDO</p>
        <div style={{ display:"flex",gap:"36px" }}>
          {navItems.map(item=>(
            <button key={item} className="nav-link" onClick={()=>setActive(item)} style={{ color:active===item?"#e8d5b0":"#2a2520" }}>{item}</button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position:"relative",height:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 48px 72px",overflow:"hidden" }}>
        {/* BG image — dark gym / barbell focus */}
        <div style={{
          position:"absolute",inset:0,zIndex:0,
          backgroundImage:"url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&fit=crop&crop=center')",
          backgroundSize:"cover",backgroundPosition:"center 40%",
          filter:"brightness(0.18) contrast(1.15) saturate(0.6)",
        }}/>
        {/* Vignette */}
        <div style={{ position:"absolute",inset:0,zIndex:1,background:"linear-gradient(to top,#080806 0%,rgba(8,8,6,0.65) 45%,rgba(8,8,6,0.1) 100%)" }}/>
        {/* Scanlines */}
        <div style={{ position:"absolute",inset:0,zIndex:2,pointerEvents:"none",backgroundImage:"repeating-linear-gradient(to bottom,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)" }}/>
        {/* Side rule */}
        <div style={{ position:"absolute",left:"48px",top:"120px",bottom:"80px",zIndex:3,width:"1px",background:"linear-gradient(to bottom,transparent,#1c1810 30%,#1c1810 70%,transparent)" }}/>

        <div style={{ position:"relative",zIndex:4 }}>
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"10px",letterSpacing:"6px",color:"#4a3f2a",marginBottom:"16px",animation:"fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}>PRODUCER · ARTIST · BUSINESSMAN</p>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(96px,17vw,210px)",lineHeight:0.85,letterSpacing:"-2px",color:"#e8d5b0",animation:"fadeUp 1s cubic-bezier(0.16,1,0.3,1) both" }}>CARDO</h1>
          <div style={{ marginTop:"32px",display:"flex",gap:"36px",alignItems:"center",animation:"fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.25s both" }}>
            {navItems.map(item=>(
              <button key={item} className="nav-link" onClick={()=>setActive(item)} style={{ color:active===item?"#8a7060":"#2a2520",borderBottom:active===item?"1px solid #4a3f2a":"1px solid transparent",paddingBottom:"4px",fontSize:"10px" }}>{item}</button>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position:"absolute",bottom:"28px",left:"50%",transform:"translateX(-50%)",zIndex:4,display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",animation:"fadeIn 2s ease 1.2s both" }}>
          <div style={{ width:"1px",height:"36px",background:"linear-gradient(to bottom,transparent,#2a2520)" }}/>
          <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"8px",letterSpacing:"3px",color:"#2a2520" }}>SCROLL</p>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding:"72px 48px 120px",maxWidth:"960px" }}>
        {sections[active]?.()}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:"1px solid #0d0d0b",padding:"26px 48px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"15px",letterSpacing:"5px",color:"#181612" }}>CARDO</p>
        <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"9px",letterSpacing:"2px",color:"#181612" }}>© 2026 · ALL RIGHTS RESERVED</p>
      </div>

      {checkout && <CheckoutModal track={checkout} onClose={()=>setCheckout(null)} />}

      {/* SUCCESS BANNER */}
      {successBeat && (
        <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.93)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)" }}>
          <div style={{ background:"#0c0c0a",border:"1px solid #1c1810",width:"100%",maxWidth:"440px",margin:"20px",padding:"48px 32px",textAlign:"center" }}>
            <div style={{ width:"48px",height:"48px",border:"1px solid #3a3028",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px" }}>
              <span style={{ color:"#8a7060",fontSize:"20px" }}>✓</span>
            </div>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"30px",letterSpacing:"2px",marginBottom:"12px",color:"#e8d5b0" }}>YOU'RE GOOD.</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:"12px",fontWeight:"300",color:"#5a5040",lineHeight:"1.8",marginBottom:"28px" }}>
              {decodeURIComponent(successBeat)} has been sent to your inbox.<br/>Go make something real with it.
            </p>
            <button onClick={()=>setSuccessBeat(null)} className="buy-btn">CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}
