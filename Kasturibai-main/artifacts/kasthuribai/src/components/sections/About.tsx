import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-14 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-body font-semibold tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3 block">Our Story</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-5 text-foreground leading-tight">
              A Legacy of <span className="italic font-medium text-gold">Trust</span> & Style.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base font-body mb-3 sm:mb-4 leading-relaxed">
              Kasthuribai Ready Mades is built on decades of trust and experience from the renowned NMP group. Serving customers since the <strong>1930s</strong> in Chidambaram, we have evolved from a humble textile store to a premier destination for ready-made fashion.
            </p>
            <p className="text-gray-600 text-sm sm:text-base font-body mb-6 sm:mb-8 leading-relaxed">
              We offer stylish, affordable clothing for men, women, and kids with an unwavering focus on quality, comfort, and customer satisfaction.
            </p>

            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 md:mb-10">
              {[
                "Premium Quality Fabrics at Affordable Prices",
                "Wide Range of Men, Women & Kids Collections",
                "Free Alteration Service at Store",
                "90+ Years of Community Trust",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 sm:gap-3 text-foreground font-body font-medium text-sm sm:text-base">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-primary w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center gap-2 bg-primary text-white font-body font-semibold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full hover:bg-primary/90 transition-colors text-xs sm:text-sm uppercase tracking-wider"
            >
              Visit Our Store
            </a>
          </motion.div>

          {/* Stats & Images */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm text-center">
                <span className="block text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">🏆</span>
                <h4 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-0.5 sm:mb-1">90+</h4>
                <p className="text-[10px] sm:text-sm font-body text-muted-foreground uppercase tracking-wider">Years Legacy</p>
              </div>
              <div className="h-32 sm:h-40 md:h-48 rounded-xl sm:rounded-2xl overflow-hidden">
                <img src="/images/kasturi5.jpeg" alt="Our store" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="h-32 sm:h-40 md:h-48 rounded-xl sm:rounded-2xl overflow-hidden">
                <img src="/images/store-2.png" alt="Store inside" className="w-full h-full object-cover" />
              </div>
              <div className="bg-primary p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg text-center text-white">
                <span className="block text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">❤️</span>
                <h4 className="text-2xl sm:text-3xl font-display font-bold mb-0.5 sm:mb-1">1000+</h4>
                <p className="text-[10px] sm:text-sm font-body font-semibold uppercase tracking-wider">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
