import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartToast } from "@/components/CartToast";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Star,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Clock,
  Calendar,
  Phone,
  User,
  Sparkles,
  ShoppingBag,
  Eye,
  Shirt,
  Baby,
  Users,
  ChevronRight,
  Info,
} from "lucide-react";

// ── Constants ────────────────────────────────────────────────────────────────
// Set VITE_WHATSAPP_NUMBER in your .env (e.g. 919876543210) before deploying.
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, "") || "919876543210";

const CONSULTANTS = [
  {
    id: 1,
    name: "Priya Devi",
    role: "Women's & Bridal Expert",
    experience: "9 years",
    rating: 4.9,
    reviews: 312,
    specialties: ["Sarees", "Kurtis", "Bridal Wear", "Festival Outfits"],
    languages: ["Tamil", "English"],
    icon: Shirt,
    color: "from-rose-400 to-pink-600",
    available: true,
  },
  {
    id: 2,
    name: "Ramesh Kumar",
    role: "Men's Fashion Consultant",
    experience: "7 years",
    rating: 4.8,
    reviews: 245,
    specialties: ["Shirts", "Dhotis", "Formal Wear", "Traditional"],
    languages: ["Tamil", "Telugu", "English"],
    icon: Users,
    color: "from-blue-400 to-blue-700",
    available: true,
  },
  {
    id: 3,
    name: "Anbu Selvi",
    role: "Kids Wear Specialist",
    experience: "5 years",
    rating: 4.9,
    reviews: 189,
    specialties: ["Kids Ethnic", "School Wear", "Party Outfits", "Uniforms"],
    languages: ["Tamil", "English"],
    icon: Baby,
    color: "from-green-400 to-emerald-600",
    available: true,
  },
  {
    id: 4,
    name: "Vijay Anand",
    role: "Silver & Accessories Expert",
    experience: "6 years",
    rating: 4.7,
    reviews: 156,
    specialties: ["Silver Jewellery", "Bangles", "Anklets", "Gifting"],
    languages: ["Tamil", "English"],
    icon: Eye,
    color: "from-amber-400 to-yellow-600",
    available: false,
  },
];

const TIME_SLOTS = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Pick a Consultant",
    desc: "Choose an expert based on what you want to shop — women's wear, men's, kids, or silver jewellery.",
    icon: User,
  },
  {
    step: 2,
    title: "Select Date & Time",
    desc: "Choose a convenient slot. We're available Monday to Saturday, 10 AM – 5 PM.",
    icon: Calendar,
  },
  {
    step: 3,
    title: "Confirm on WhatsApp",
    desc: "Your booking message is sent directly to our WhatsApp. We'll confirm within 30 minutes.",
    icon: MessageCircle,
  },
  {
    step: 4,
    title: "Video Call & Shop",
    desc: "At the scheduled time, we call you on WhatsApp Video. Browse, ask questions, and order live.",
    icon: Video,
  },
];

const BENEFITS = [
  "See fabric texture, drape & colour on camera — no surprises",
  "Ask us to hold up any item, zoom in, or show multiple options",
  "Get honest styling advice from experienced consultants",
  "Place your order during the call — no need to visit the store",
  "WhatsApp Video — no app install required",
  "Sessions in Tamil & English",
];

// ── Helper: get next 7 days ──────────────────────────────────────────────────
function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString("en-IN", { month: "short" });
    const isSunday = d.getDay() === 0;
    days.push({ date: d, dayName, dayNum, month, isSunday, label: `${dayNum} ${month}` });
  }
  return days;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function VideoShopping() {
  const [step, setStep] = useState<"select" | "book" | "confirmed">("select");
  const [selectedConsultant, setSelectedConsultant] = useState<typeof CONSULTANTS[0] | null>(null);
  const [selectedDay, setSelectedDay] = useState<ReturnType<typeof getNext7Days>[0] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [formError, setFormError] = useState("");

  const days = getNext7Days();

  function handleSelectConsultant(c: typeof CONSULTANTS[0]) {
    if (!c.available) return;
    setSelectedConsultant(c);
    setStep("book");
    setTimeout(() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) return setFormError("Please enter your name.");
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, "")))
      return setFormError("Please enter a valid 10-digit Indian mobile number.");
    if (!selectedDay) return setFormError("Please select a date.");
    if (!selectedSlot) return setFormError("Please select a time slot.");

    const dateStr = `${selectedDay.dayName}, ${selectedDay.label}`;
    const msg = [
      `🛍️ *Video Shopping Booking – Kasthuribai Ready Mades*`,
      ``,
      `👤 *Name:* ${name.trim()}`,
      `📱 *My WhatsApp:* +91 ${phone.trim()}`,
      `👗 *Consultant:* ${selectedConsultant!.name} (${selectedConsultant!.role})`,
      `📅 *Date:* ${dateStr}`,
      `⏰ *Time:* ${selectedSlot}`,
      interest.trim() ? `🛒 *Looking for:* ${interest.trim()}` : "",
      ``,
      `Please confirm my video shopping session. Thank you! 🙏`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setStep("confirmed");
  }

  function handleReset() {
    setStep("select");
    setSelectedConsultant(null);
    setSelectedDay(null);
    setSelectedSlot(null);
    setName("");
    setPhone("");
    setInterest("");
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf7]">
      <Navbar />

      <main className="flex-1 pt-0">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-[#5c1a1a] via-[#7a2020] to-[#3d1010] overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Live Video Shopping
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Shop Live with Our
              <span className="block text-amber-400 mt-1">Fashion Experts</span>
            </h1>
            <p className="text-white/75 text-lg sm:text-xl font-body max-w-2xl mx-auto mb-10 leading-relaxed">
              Book a free WhatsApp video call. Our consultants will show you products live,
              answer your questions, and help you shop — all from your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById("consultants")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#3d1010] font-bold px-8 py-4 rounded-full shadow-xl shadow-amber-400/20 transition-all duration-300 text-base"
              >
                <Video className="w-5 h-5" />
                Book a Free Session
              </button>
              <button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 border-2 border-white/25 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all duration-300 text-base"
              >
                How It Works
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {[
                { icon: "📞", text: "WhatsApp Video — no app needed" },
                { icon: "🆓", text: "100% Free consultation" },
                { icon: "🕐", text: "Response in 30 minutes" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-white/65 text-sm font-body">
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">How It Works</h2>
              <p className="text-muted-foreground font-body text-base max-w-xl mx-auto">
                Four simple steps between you and a live shopping session
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative text-center p-6 rounded-2xl bg-[#fdfaf7] border border-gray-100"
                >
                  {idx < HOW_IT_WORKS.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 z-10" />
                  )}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-[#7a2020] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Step {item.step}</div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Consultants ───────────────────────────────────────────────── */}
        <section id="consultants" className="py-16 sm:py-20 bg-[#fdfaf7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-3">Our Consultants</h2>
              <p className="text-muted-foreground font-body text-base max-w-xl mx-auto">
                Choose the expert who matches what you're looking for
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CONSULTANTS.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`relative rounded-2xl bg-white border-2 overflow-hidden transition-all duration-300 ${
                    !c.available
                      ? "opacity-55 border-gray-100"
                      : selectedConsultant?.id === c.id
                      ? "border-primary shadow-xl shadow-primary/10"
                      : "border-gray-100 hover:border-primary/40 hover:shadow-lg cursor-pointer"
                  }`}
                  role={c.available ? "button" : undefined}
                  tabIndex={c.available ? 0 : undefined}
                  aria-label={c.available ? `Book session with ${c.name}` : `${c.name} is currently unavailable`}
                  aria-pressed={selectedConsultant?.id === c.id}
                  onClick={() => handleSelectConsultant(c)}
                  onKeyDown={(e) => { if (c.available && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); handleSelectConsultant(c); } }}
                >
                  {/* colour header */}
                  <div className={`h-28 bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <c.icon className="w-9 h-9 text-white" />
                    </div>
                  </div>

                  {/* availability badge */}
                  <div className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    c.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {c.available ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Available
                      </span>
                    ) : "Busy"}
                  </div>

                  <div className="p-5">
                    <h3 className="font-display font-bold text-foreground text-base mb-0.5">{c.name}</h3>
                    <p className="text-xs text-muted-foreground font-body mb-3">{c.role}</p>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-bold text-foreground">{c.rating}</span>
                        <span className="text-xs text-muted-foreground">({c.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="w-3 h-3" />
                        {c.experience}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {c.specialties.map((s) => (
                        <span key={s} className="text-[10px] bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="text-[10px] text-muted-foreground mb-4 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {c.languages.join(" · ")}
                    </div>

                    <button
                      disabled={!c.available}
                      onClick={(e) => { e.stopPropagation(); handleSelectConsultant(c); }}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        c.available
                          ? "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-primary/25"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {c.available ? (
                        <span className="flex items-center justify-center gap-2">
                          <Video className="w-4 h-4" /> Book Session
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" /> Unavailable
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Booking Form ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {step === "book" && selectedConsultant && (
            <motion.section
              id="booking-form"
              key="booking-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.35 }}
              className="py-16 sm:py-20 bg-white border-t border-gray-100"
            >
              <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* selected consultant summary */}
                <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/15">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedConsultant.color} flex items-center justify-center flex-shrink-0`}>
                    <selectedConsultant.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-body">You picked</p>
                    <p className="font-display font-bold text-foreground">{selectedConsultant.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedConsultant.role}</p>
                  </div>
                  <button
                    onClick={() => { setStep("select"); setSelectedConsultant(null); }}
                    className="text-xs text-primary font-semibold hover:underline flex-shrink-0"
                  >
                    Change
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
                  Book Your Session
                </h2>
                <p className="text-muted-foreground font-body mb-8 text-sm">
                  Fill in the details below. Clicking "Confirm Booking" will open WhatsApp with your booking message pre-filled — just hit send!
                </p>

                <form onSubmit={handleBook} className="space-y-6">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="e.g. Kavitha"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm font-body bg-white transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-1.5">WhatsApp Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="10-digit mobile"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm font-body bg-white transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Select Date * <span className="text-muted-foreground font-normal">(Mon – Sat)</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {days.map((d) => (
                        <button
                          key={d.label}
                          type="button"
                          disabled={d.isSunday}
                          onClick={() => { setSelectedDay(d); setSelectedSlot(null); }}
                          className={`flex flex-col items-center px-3 py-2 rounded-xl border-2 text-sm font-body transition-all min-w-[60px] ${
                            d.isSunday
                              ? "opacity-30 cursor-not-allowed border-gray-100 bg-gray-50"
                              : selectedDay?.label === d.label
                              ? "border-primary bg-primary text-white shadow-md"
                              : "border-gray-200 hover:border-primary/40 bg-white"
                          }`}
                        >
                          <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">{d.dayName}</span>
                          <span className="font-bold text-base">{d.dayNum}</span>
                          <span className="text-[10px] opacity-70">{d.month}</span>
                          {d.isSunday && <span className="text-[9px] text-red-400 font-medium">Closed</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slot */}
                  {selectedDay && !selectedDay.isSunday && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25 }}
                    >
                      <label className="block text-sm font-semibold text-foreground mb-2">Select Time *</label>
                      <div className="flex flex-wrap gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-3 py-2 rounded-lg border text-sm font-body transition-all ${
                              selectedSlot === slot
                                ? "border-primary bg-primary text-white shadow-sm"
                                : "border-gray-200 hover:border-primary/40 bg-white text-foreground"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Interest */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      What are you looking for? <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <ShoppingBag className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea
                        placeholder="e.g. Silk sarees for a wedding, boys party wear aged 5–8, silver bangles as gift..."
                        value={interest}
                        onChange={(e) => setInterest(e.target.value)}
                        rows={2}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none text-sm font-body bg-white transition resize-none"
                      />
                    </div>
                  </div>

                  {/* Info box */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                    <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800 font-body leading-relaxed">
                      Clicking <strong>"Confirm Booking"</strong> will open WhatsApp with your booking details pre-filled. Just hit <strong>Send</strong> — we'll confirm your slot within 30 minutes and call you on WhatsApp Video at the booked time.
                    </p>
                  </div>

                  {/* Error */}
                  {formError && (
                    <p className="text-sm text-red-500 font-body bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                      {formError}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-green-500/20 transition-all duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Confirm Booking on WhatsApp
                  </button>
                </form>
              </div>
            </motion.section>
          )}

          {/* ── Confirmed ─────────────────────────────────────────────── */}
          {step === "confirmed" && (
            <motion.section
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="py-24 bg-white border-t border-gray-100"
            >
              <div className="max-w-lg mx-auto px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                  Booking Sent!
                </h2>
                <p className="text-muted-foreground font-body text-base mb-2">
                  Your booking message has been sent to our WhatsApp. We'll confirm your slot within 30 minutes.
                </p>
                <p className="text-sm text-muted-foreground font-body mb-8">
                  At the scheduled time, <strong>{selectedConsultant?.name}</strong> will call you on WhatsApp Video at <strong>+91 {phone}</strong>.
                </p>

                <div className="bg-[#fdfaf7] rounded-2xl border border-gray-100 p-5 text-left mb-8 space-y-3">
                  {[
                    ["Consultant", selectedConsultant?.name],
                    ["Date", selectedDay ? `${selectedDay.dayName}, ${selectedDay.label}` : ""],
                    ["Time", selectedSlot],
                    ["Your Number", `+91 ${phone}`],
                  ].map(([label, value]) => value && (
                    <div key={label} className="flex items-center justify-between text-sm font-body">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold text-foreground">{value}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
                >
                  Book another session
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Benefits ──────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#5c1a1a] via-[#7a2020] to-[#4a1010]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                  Why shop this way?
                </h2>
                <p className="text-white/65 font-body mb-8 leading-relaxed">
                  Our video shopping sessions bring the in-store experience to your home — with knowledgeable staff, real products, and honest advice.
                </p>
                <ul className="space-y-3.5">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-white/85 text-sm font-body">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/8 backdrop-blur-sm rounded-3xl p-8 border border-white/12">
                <p className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-4">Session details</p>
                <div className="space-y-4">
                  {[
                    { icon: Clock, label: "Duration", value: "15 – 30 minutes" },
                    { icon: MessageCircle, label: "Platform", value: "WhatsApp Video Call" },
                    { icon: Calendar, label: "Available", value: "Mon – Sat, 10 AM to 5 PM" },
                    { icon: Star, label: "Cost", value: "Completely Free" },
                    { icon: Phone, label: "Languages", value: "Tamil & English" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4.5 h-4.5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-white/50 text-xs font-body">{item.label}</p>
                        <p className="text-white font-semibold text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setStep("select");
                    document.getElementById("consultants")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-[#3d1010] font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg"
                >
                  <Video className="w-4 h-4" />
                  Book a Free Session Now
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <CartDrawer />
      <CartToast />
      <FloatingWhatsApp />
    </div>
  );
}
