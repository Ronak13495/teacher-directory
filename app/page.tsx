import Link from "next/link";

export default function Home() {
  const instruments = [
    "Piano", "Guitar", "Violin", "Drums", "Vocals",
    "Flute", "Saxophone", "Cello", "Trumpet", "Bass",
  ];

  const features = [
    {
      icon: "🎼",
      title: "Expert Teachers",
      description: "Connect with passionate, experienced music educators across all instruments and skill levels.",
    },
    {
      icon: "📍",
      title: "Local & Online",
      description: "Find teachers who can come to you, or learn from the comfort of your home online.",
    },
    {
      icon: "🎵",
      title: "All Instruments",
      description: "From classical piano to electric guitar — whatever you want to learn, we have a teacher for it.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: "#f4f7f2", fontFamily: "Georgia, serif" }}>

      {/* Floating music notes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {["♩", "♪", "♫", "♬", "𝄞", "♩", "♪", "♫", "♬"].map((note, i) => (
          <span
            key={i}
            className="absolute select-none animate-pulse"
            style={{
              fontSize: `${40 + (i * 17) % 60}px`,
              left: `${(i * 23 + 5) % 95}%`,
              top: `${(i * 31 + 10) % 85}%`,
              color: `rgba(90, 120, 80, ${0.04 + (i % 3) * 0.02})`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          >
            {note}
          </span>
        ))}
      </div>

      {/* Hero */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6">

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(90,120,80,0.1)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(190,100,70,0.08)" }} />

        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide"
          style={{ border: "1px solid rgba(90,120,80,0.35)", background: "rgba(90,120,80,0.08)", color: "#4a7040" }}
        >
          <span>🎶</span> Find your perfect music teacher
        </div>

        {/* Heading */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-none" style={{ color: "#1e2e1a" }}>
          Learn Music
          <span
            className="block"
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundImage: "linear-gradient(135deg, #b85c3a, #d4784e, #c06040)",
            }}
          >
            From the Best
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed" style={{ color: "#5a6e52" }}>
          Browse our directory of skilled music teachers or join our community and share your passion for music with students near you.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/directory"
            className="group px-8 py-4 font-bold rounded-full text-lg transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #b85c3a, #d4784e)",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(184,92,58,0.3)",
            }}
          >
            Find a Teacher
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/join"
            className="px-8 py-4 font-semibold rounded-full text-lg transition-all duration-200"
            style={{
              border: "1.5px solid rgba(90,120,80,0.45)",
              color: "#3d6035",
              background: "rgba(255,255,255,0.6)",
            }}
          >
            Join as Teacher
          </Link>
        </div>

      {/* Scrolling instruments */}
        <div className="mt-16 w-full overflow-hidden">
          <div
            className="flex gap-3"
            style={{
              width: "max-content",
              animation: "scroll 22s linear infinite",
            }}
          >
            {/* Three copies ensures seamless loop at any screen width */}
            {[...instruments, ...instruments, ...instruments].map((instrument, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full text-sm whitespace-nowrap"
                style={{
                  border: "1px solid rgba(90,120,80,0.2)",
                  background: "rgba(90,120,80,0.07)",
                  color: "#4a6e40",
                }}
              >
                {instrument}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: "#1e2e1a" }}>
          Everything you need to{" "}
          <span style={{ color: "#b85c3a" }}>start playing</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl transition-all duration-300"
              style={{
                border: "1px solid rgba(90,120,80,0.15)",
                background: "rgba(240,245,238,0.85)",
                boxShadow: "0 2px 16px rgba(90,120,80,0.07)",
              }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#1e2e1a" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#5a6e52" }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{
            background: "linear-gradient(135deg, #e8f0e4, #d8e8d0)",
            border: "1px solid rgba(90,120,80,0.2)",
            boxShadow: "0 4px 32px rgba(90,120,80,0.1)",
          }}
        >
          <div className="absolute top-4 right-6 text-6xl opacity-10" style={{ color: "#4a7040" }}>𝄞</div>
          <div className="absolute bottom-4 left-6 text-5xl opacity-10" style={{ color: "#4a7040" }}>♪</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1e2e1a" }}>
            Are you a music teacher?
          </h2>
          <p className="text-lg mb-8" style={{ color: "#5a6e52" }}>
            Join our growing directory and connect with students in your area.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-full text-lg transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #b85c3a, #d4784e)",
              color: "#fff",
              boxShadow: "0 8px 24px rgba(184,92,58,0.3)",
            }}
          >
            Get Listed Today →
          </Link>
        </div>
      </section>

    <style>{`
      @keyframes scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-33.333%); }
      }
    `}</style>
    </div>
  );
}