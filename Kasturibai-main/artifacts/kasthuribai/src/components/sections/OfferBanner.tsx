import { useEffect, useState } from "react";

function getTimeLeft() {
  const target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(23, 59, 59, 999);
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { d: "00", h: "00", m: "00", s: "00" };
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return {
    d: String(d).padStart(2, "0"),
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

export function OfferBanner() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 relative overflow-hidden bg-primary">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <span className="inline-block px-4 py-1.5 border border-gold text-gold rounded-full text-xs font-body font-bold uppercase tracking-widest mb-6">
          🔥 Limited Time Offer
        </span>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
          Get Up To <span className="gold-gradient-text">50% OFF</span>
          <br />
          <span className="text-3xl md:text-4xl font-light italic">On Festive Collections</span>
        </h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto text-base font-body">
          Celebrate this season with Kasthuribai's exclusive festive collection. Premium quality at prices you'll love.
        </p>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-3 md:gap-5 mb-10">
          {[
            { label: "Days", val: time.d },
            { label: "Hours", val: time.h },
            { label: "Mins", val: time.m },
            { label: "Secs", val: time.s },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 mb-2">
                <span className="text-2xl md:text-3xl font-display font-bold">{t.val}</span>
              </div>
              <span className="text-xs font-body text-white/60 uppercase tracking-wider">{t.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => document.querySelector('#collections')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center gap-2 bg-gold text-black font-body font-bold px-8 py-4 rounded-full hover:bg-gold-light transition-colors text-sm uppercase tracking-wider shadow-lg"
        >
          Shop the Sale →
        </button>
      </div>
    </section>
  );
}
