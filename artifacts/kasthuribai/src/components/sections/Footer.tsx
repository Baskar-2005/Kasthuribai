import { Facebook, Instagram, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background dark:bg-black border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6">
            <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Kasthuribai<span className="text-gold">.</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
              Style Meets Comfort. Your premium fashion destination in Chidambaram offering decades of trust, quality, and affordable style for the whole family.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-colors">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-black transition-colors">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-bold font-display mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
              <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-gold transition-colors">Our Story</a></li>
              <li><a href="#collections" className="hover:text-gold transition-colors">Collections</a></li>
              <li><a href="#contact" className="hover:text-gold transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-base sm:text-lg font-bold font-display mb-4 sm:mb-6">Categories</h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-gold transition-colors">Men's Wear</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Women's Wear</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Kids Collection</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Traditional & Ethnic</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base sm:text-lg font-bold font-display mb-4 sm:mb-6">Contact Info</h4>
            <ul className="space-y-3 sm:space-y-4 text-gray-400 text-xs sm:text-sm">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0 mt-0.5" />
                <span>123 Market Street, Near Temple, Chidambaram, Tamil Nadu 608001</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
                <span>hello@kasthuribai.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Kasthuribai Ready Mades. NMP Group.</p>
          <p className="mt-2 md:mt-0">Designed with <span className="text-gold">♥</span> for Style.</p>
        </div>
      </div>
    </footer>
  );
}
