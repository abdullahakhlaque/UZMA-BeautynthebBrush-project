import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, ChevronRight, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── IMPORTANT ───────────────────────────────────────────────────────────────
// Save your logo image to: src/assets/logo.png
// Then this import will work automatically.
// If your file has a different name (e.g. logo.jpg), change it below.
let logoImg: string | null = null;
try {
  // @ts-ignore
  logoImg = new URL('../assets/logo.png', import.meta.url).href;
} catch {
  logoImg = null;
}
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_PRIMARY = '919148768958';
const WHATSAPP_SECONDARY = '919731102448';
const INSTAGRAM_URL = 'https://www.instagram.com/beautyandthebrush2026';
const WHATSAPP_MESSAGE = 'Hello%20I%20want%20to%20inquire%20about%20your%20services';

const serviceCategories = [
  { label: 'Salon Services', path: '/services/salon', description: 'Skin & hair care treatments' },
  { label: 'Makeup & Hair (MUH)', path: '/services/makeup-hair', description: 'Bridal & party makeup' },
  { label: 'Styling', path: '/services/styling', description: 'Saree draping & general styling' },
  { label: 'Hair Treatments', path: '/services/hair-treatments', description: 'Keratin, spa & more' },
];

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Our Services', path: '/services', children: serviceCategories },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location]);

  const isTransparent = isHomePage && !scrolled;

  const navBg = isTransparent
    ? 'bg-black/20 backdrop-blur-sm border-b border-transparent'
    : 'bg-white/98 backdrop-blur-xl border-b border-[hsl(35,30%,88%)]';

  const navShadow = isTransparent ? '' : 'shadow-[0_2px_24px_rgba(180,140,100,0.13)]';
  const linkBase = isTransparent
    ? 'text-white hover:text-white/75 drop-shadow-sm'
    : 'text-[hsl(20,15%,22%)] hover:text-[hsl(350,40%,52%)]';
  const linkActive = isTransparent
    ? 'text-white font-semibold drop-shadow-sm'
    : 'text-[hsl(350,40%,52%)] font-semibold';
  const toggleColor = isTransparent ? 'text-white' : 'text-[hsl(20,15%,22%)]';

  const showLogo = logoImg && !logoError;

  // ── Ampersand color: gold on transparent, gradient on white bg ──
  const ampersandStyle: React.CSSProperties = isTransparent
    ? { color: '#f5d08a' }
    : {
        background: 'linear-gradient(135deg, hsl(350,55%,58%), hsl(30,60%,55%))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
      };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${navBg} ${navShadow}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ── LOGO: image + text ───────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {showLogo && (
              <img
                src={logoImg!}
                alt=""
                aria-hidden="true"
                onError={() => setLogoError(true)}
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
              />
            )}
            <span
              className={`font-heading text-lg md:text-xl font-bold tracking-wide transition-colors duration-300 leading-tight ${
                isTransparent ? 'text-white' : 'text-[hsl(20,15%,18%)]'
              }`}
            >
              Beauty{' '}
              <span style={ampersandStyle}>&amp;</span>
              {' '}the Brush
            </span>
          </Link>

          {/* ── DESKTOP NAV ───────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => {
                  if (hoverTimeout) clearTimeout(hoverTimeout);
                  if (link.children) setServicesOpen(true);
                }}
                onMouseLeave={() => {
                  const t = setTimeout(() => setServicesOpen(false), 200);
                  setHoverTimeout(t);
                }}
              >
                {link.children ? (
                  <button className={`flex items-center gap-1.5 text-sm font-body font-medium tracking-wide transition-colors duration-200 ${linkBase}`}>
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`text-sm font-body font-medium tracking-wide transition-colors duration-200 ${
                      location.pathname === link.path ? linkActive : linkBase
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Luxury White Dropdown */}
                {link.children && (
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 rounded-2xl z-50 overflow-hidden"
                        style={{
                          background: 'hsl(0,0%,100%)',
                          border: '1px solid hsl(35,35%,88%)',
                          boxShadow: '0 8px 40px rgba(180,130,90,0.13), 0 2px 8px rgba(0,0,0,0.06)',
                        }}
                      >
                        <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, hsl(350,45%,62%), hsl(35,55%,58%), hsl(350,45%,62%))' }} />
                        <div className="p-2">
                          {link.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group/item"
                              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'hsl(35,40%,97%)')}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                            >
                              <div>
                                <p className="font-medium font-heading text-sm" style={{ color: 'hsl(20,15%,22%)' }}>{child.label}</p>
                                <p className="text-xs mt-0.5 font-body" style={{ color: 'hsl(20,10%,55%)' }}>{child.description}</p>
                              </div>
                              <ChevronRight
                                className="w-4 h-4 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200"
                                style={{ color: 'hsl(350,40%,58%)' }}
                              />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Instagram icon */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="@beautyandthebrush2026"
              className={`transition-colors duration-200 ${isTransparent ? 'text-white hover:text-pink-300' : 'text-[hsl(20,15%,35%)] hover:text-pink-500'}`}
            >
              <Instagram className="w-5 h-5" />
            </a>

            <div className="flex items-center gap-2">
              <Link
                to="/booking"
                className="px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, hsl(350,45%,58%), hsl(350,50%,48%))',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(180,70,80,0.25)',
                }}
              >
                Book Now
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_PRIMARY}?text=${WHATSAPP_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(34,197,94,0.22)',
                }}
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className={`lg:hidden p-2 transition-colors ${toggleColor}`}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 rounded-2xl z-50 overflow-hidden"
            style={{
              background: 'hsl(0,0%,100%)',
              border: '1px solid hsl(35,35%,88%)',
              boxShadow: '0 8px 40px rgba(180,130,90,0.14)',
            }}
          >
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, hsl(350,45%,62%), hsl(35,55%,58%), hsl(350,45%,62%))' }} />
            <div className="px-3 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <button
                        onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 font-body rounded-xl text-sm font-medium"
                        style={{ color: 'hsl(20,15%,25%)' }}
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} style={{ color: 'hsl(350,40%,58%)' }} />
                      </button>
                      <AnimatePresence>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-2"
                          >
                            {link.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className="flex flex-col px-4 py-2.5 rounded-xl transition-colors"
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'hsl(35,40%,97%)')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                              >
                                <span className="block font-medium text-sm font-body" style={{ color: 'hsl(20,15%,22%)' }}>{child.label}</span>
                                <span className="block text-xs font-body" style={{ color: 'hsl(20,10%,55%)' }}>{child.description}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className="block px-4 py-3 font-body rounded-xl text-sm font-medium transition-colors"
                      style={{
                        color: location.pathname === link.path ? 'hsl(350,45%,52%)' : 'hsl(20,15%,25%)',
                        background: location.pathname === link.path ? 'hsl(350,40%,97%)' : 'transparent',
                        fontWeight: location.pathname === link.path ? 600 : 400,
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile contact info */}
              <div className="px-4 py-3 border-t mt-1" style={{ borderColor: 'hsl(35,30%,90%)' }}>
                <p className="text-xs font-body mb-2" style={{ color: 'hsl(20,10%,55%)' }}>Get in touch</p>
                <div className="space-y-1.5">
                  <a href={`https://wa.me/${WHATSAPP_PRIMARY}?text=${WHATSAPP_MESSAGE}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-body" style={{ color: 'hsl(20,15%,25%)' }}>
                    <Phone className="w-3.5 h-3.5 text-green-500" /> +91 91487 68958
                  </a>
                  <a href={`https://wa.me/${WHATSAPP_SECONDARY}?text=${WHATSAPP_MESSAGE}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-body" style={{ color: 'hsl(20,15%,25%)' }}>
                    <Phone className="w-3.5 h-3.5 text-green-500" /> +91 97311 02448
                  </a>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-body" style={{ color: 'hsl(20,15%,25%)' }}>
                    <Instagram className="w-3.5 h-3.5 text-pink-500" /> @beautyandthebrush2026
                  </a>
                </div>
              </div>

              <div className="pt-2 pb-1 space-y-2 px-2">
                <Link
                  to="/booking"
                  className="block w-full text-center px-5 py-2.5 text-sm font-semibold rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, hsl(350,45%,58%), hsl(350,50%,48%))' }}
                >
                  Book Appointment
                </Link>
                <a
                  href={`https://wa.me/${WHATSAPP_PRIMARY}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-5 py-2.5 text-sm font-semibold text-white rounded-full flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                >
                  <Phone className="w-3.5 h-3.5" /> WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;