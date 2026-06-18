import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle, Send, Clock, Store } from "lucide-react";

export function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi! I'm ${form.name}. My phone: ${form.phone}. Message: ${form.message}`;
    window.open(`https://wa.me/919025415399?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="text-gold font-semibold text-xs sm:text-sm uppercase tracking-wider">Get in Touch</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-2 mb-3 sm:mb-4">Contact Us</h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-gold rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-display font-bold mb-4 sm:mb-6">Visit Our Store</h3>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">Store Address</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">Kasthuribai Ready Mades<br />NMP Group, Chidambaram<br />Tamil Nadu - 608001</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">Phone Number</h4>
                    <a href="tel:+919876543210" className="text-muted-foreground hover:text-gold transition-colors text-xs sm:text-sm">+91 98765 43210</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">Store Hours</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">Mon – Sat: 9:00 AM – 9:00 PM<br />Sunday: 10:00 AM – 7:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Store className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-sm sm:text-base">Legacy</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">Serving the community since the 1930s<br />NMP Group Heritage</p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 bg-[#25D366] text-white font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-[#22c55e] transition-colors shadow-lg text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Map embed */}
            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-border h-40 sm:h-48 md:h-56">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31526.90671023698!2d79.67497!3d11.39915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5518d52d6fc3d9%3A0x8b57e3a11b8f5d2!2sChidambaram%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1699000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Chidambaram Map"
              />
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm"
          >
            <h3 className="text-xl sm:text-2xl font-display font-bold mb-2">Send a Message</h3>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-xs sm:text-sm">We'll get back to you via WhatsApp instantly!</p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="What can we help you with?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-secondary border border-border rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-black font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
              >
                {sent ? "Message Sent! ✓" : (
                  <>
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Send via WhatsApp
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
