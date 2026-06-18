import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "/images/kasturi2.png",
    overlayFrom: "from-black/80",
    overlayTo: "to-black/20",
  },
  {
    image: "/images/kasturi3.jpg",
    overlayFrom: "from-black/70",
    overlayTo: "to-black/10",
  },
  {
    image: "/images/store-2.png",
    overlayFrom: "from-black/75",
    overlayTo: "to-black/15",
  },
  {
    image: "/images/kasturi4.jpg",
    overlayFrom: "from-black/80",
    overlayTo: "to-black/20",
  },
  {
    image: "/images/kasturi5.jpeg",
    overlayFrom: "from-black/75",
    overlayTo: "to-black/25",
  },
];

const TYPING_WORDS = ["Comfort", "Elegance", "Affordability", "Legacy"];

function useTypingEffect(words: string[], speed = 80, pause = 2000) {
  const [currentWord, setCurrentWord] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setCurrentWord((prev) => (prev + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, currentWord, words, speed, pause]);

  return displayed;
}

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right-to-left, -1 for left-to-right
  const typedWord = useTypingEffect(TYPING_WORDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      x: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
    }),
  };

  return (
    <section id="home" className="relative h-[80vh] sm:h-[85vh] md:h-[90vh] min-h-[500px] sm:min-h-[550px] md:min-h-[620px] flex items-center justify-center overflow-hidden">
      {/* Slideshow - No mode="wait" to prevent white flash */}
      <AnimatePresence custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={SLIDES[current].image}
            alt="Fashion"
            className="w-full h-full object-cover object-center"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${SLIDES[current].overlayFrom} ${SLIDES[current].overlayTo}`} />
        </motion.div>
      </AnimatePresence>

      {/* Slide dots */}
      <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "bg-gold w-6 sm:w-8" : "bg-white/40 w-2 sm:w-3"
            }`}
          />
        ))}
      </div>

      {/* Prev/Next Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          className="max-w-2xl"
        >
          <span className="inline-block text-gold font-body font-semibold tracking-[0.25em] uppercase text-[10px] sm:text-xs md:text-sm mb-3 sm:mb-5 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gold/30">
            Since 1930s · NMP Group · Chidambaram
          </span>

          {/* Tamil Big Text - Main heading for family audience */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gold mb-3 sm:mb-4 leading-tight">
            ஸ்டைலும் பாரம்பரியமும் ஒன்றாக ✨
          </h1>

          {/* English Heading - Reduced font size */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2 sm:mb-3 leading-tight">
            Style Meets
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 leading-tight">
            <span className="gold-gradient-text typing-cursor">{typedWord}</span>
          </h2>
          
          {/* Subtext with family emoji */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-body font-semibold mb-2 sm:mb-3">
            Complete Family Shopping in One Place 👨‍👩‍👧
          </p>
          
          {/* Small English line */}
          <p className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 max-w-xl font-body font-light leading-relaxed">
            Trendy fashion for Men, Women & Kids at affordable prices.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={() => scrollTo('#collections')}
              className="inline-flex items-center justify-center bg-gold text-black font-body font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gold-light transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-gold/30 hover:scale-105"
            >
              Shop Now
            </button>
            <button
              onClick={() => scrollTo('#about')}
              className="inline-flex items-center justify-center border-2 border-white/60 text-white font-body font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white hover:text-foreground transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider"
            >
              Our Legacy
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5 grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 text-center">
          {[
            { en: "✨ 90+ Years Legacy", ta: "✨ 90+ ஆண்டுகள் பாரம்பரியம்" },
            { en: "🏆 1000+ Happy Customers", ta: "🏆 1000+ மகிழ்ச்சியான வாடிக்கையாளர்கள்" },
            { en: "💰 Affordable Prices", ta: "💰 மலிவு விலை" },
            { en: "👔 4 Collections", ta: "👔 4 தொகுப்புகள்" }
          ].map((item) => (
            <div key={item.en} className="flex flex-col">
              <span className="text-white/80 text-[9px] sm:text-xs font-body font-medium tracking-widest uppercase">{item.en}</span>
              <span className="text-gold/70 text-[8px] sm:text-[10px] font-body font-medium mt-0.5">{item.ta}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
