import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-heading text-2xl text-background mb-4">
              Beauty <span className="text-blush">&</span> The Brush
            </h3>
            <p className="text-sm leading-relaxed text-background/60 font-body">
              Enhancing beauty with artistry. Premium makeup & salon services in Bangalore for your most special moments.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg text-background mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: 'About', path: '/about' },
                { label: 'Services', path: '/services' },
                { label: 'Portfolio', path: '/portfolio' },
                { label: 'Blog', path: '/blog' },
                { label: 'Contact', path: '/contact' },
                { label: 'Book Appointment', path: '/booking' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="block text-sm text-background/60 hover:text-blush transition-colors font-body"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg text-background mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blush mt-0.5 shrink-0" />
                <span className="text-sm text-background/60 font-body">
                  #173/2, 2nd Cross Road, Emerald Layout, Shakti Nagar, Bangalore 560077
                </span>
              </div>
              <a
                href="https://wa.me/919148768958?text=Hello%20I%20want%20to%20inquire%20about%20your%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-blush transition-colors"
              >
                <Phone className="w-4 h-4 text-blush shrink-0" />
                <span className="text-sm text-background/60 font-body">+91 91487 68958</span>
              </a>
              <a
                href="mailto:shaziatheshaikh@gmail.com?subject=Service%20Inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-blush transition-colors"
              >
                <Mail className="w-4 h-4 text-blush shrink-0" />
                <span className="text-sm text-background/60 font-body">shaziatheshaikh@gmail.com</span>
              </a>
            </div>
          </div>

          {/* ✅ INSTAGRAM ONLY — Facebook and YouTube removed */}
          <div>
            <h4 className="font-heading text-lg text-background mb-4">Follow Us</h4>
            <a
              href="https://www.instagram.com/artisteshaikh/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:border-blush hover:text-blush transition-all">
                <Instagram className="w-4 h-4" />
              </div>
              <span className="text-sm text-background/60 group-hover:text-blush transition-colors font-body">
                @artisteshaikh
              </span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center">
          <p className="text-sm text-background/40 font-body">
            © 2026 Beauty And The Brush. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;