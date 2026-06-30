import { Link } from "wouter";

export function Hero() {
  return (
    <section
      id="home"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0205",
      }}
    >
      <video
        src="/hero.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,2,5,0.25) 0%, rgba(10,2,5,0.15) 40%, rgba(10,2,5,0.65) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.04em",
            textShadow: "0 2px 24px rgba(0,0,0,0.55)",
            lineHeight: 1.15,
          }}
        >
          Kasthuribai Ready Mades
        </h1>

        <p
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(1rem, 2vw, 1.35rem)",
            color: "rgba(255,235,200,0.92)",
            letterSpacing: "0.12em",
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
            fontStyle: "italic",
          }}
        >
          Luxury Textiles &amp; Silver Jewellery
        </p>

        <Link href="/collections">
          <button
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem 2.5rem",
              background: "transparent",
              border: "1.5px solid rgba(229,199,107,0.85)",
              color: "#E5C76B",
              fontFamily: "'Playfair Display', 'Georgia', serif",
              fontSize: "1rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              cursor: "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(229,199,107,0.15)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5C76B";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(229,199,107,0.85)";
            }}
          >
            Shop Now
          </button>
        </Link>
      </div>
    </section>
  );
}
