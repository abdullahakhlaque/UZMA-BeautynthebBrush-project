import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Award, Heart, Sparkles, ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useInView, useAnimatedCounter } from '@/hooks/useAnimations';
import { services, testimonials } from '@/data/siteData';
import heroSlide1 from '@/assets/hero-slide-1.jpg';
import heroSlide2 from '@/assets/hero-slide-2.jpg';
import heroSlide4 from '@/assets/hero-slide-4.jpg';
import salonInterior from '@/assets/salon-interior.jpg';
import salonSetup from '@/assets/salon-setup.jpg';
import soapProduct1 from '@/assets/soap-product-1.jpg';
import soapProduct2 from '@/assets/soap-product-2.jpg';
import soapProduct3 from '@/assets/soap-product-3.jpg';
// Static fallback images for portfolio preview
import bridalMakeup from '@/assets/bridal-makeup.jpg';
import engagementMakeup from '@/assets/engagement-makeup.jpg';
import partyMakeup from '@/assets/party-makeup.jpg';
import hairStyling from '@/assets/hair-styling.jpg';
import HomeBlogSection from '@/components/Homeblogsection';
import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { apiUrl, resolveMediaUrl } from '@/lib/api';

const SoapScrollSection = lazy(() => import('@/components/SoapScrollSection'));

// ✅ Removed heroBg1 & heroBg2 (blurry slots 5 & 6) — now 5 crisp slides
const heroSlides = [heroSlide1, heroSlide2, heroSlide4, salonInterior, salonSetup];

// Static fallback for when no portfolio items uploaded yet
const FALLBACK_PORTFOLIO = [
  { id: 'f1', url: bridalMakeup, type: 'image' },
  { id: 'f2', url: engagementMakeup, type: 'image' },
  { id: 'f3', url: partyMakeup, type: 'image' },
  { id: 'f4', url: hairStyling, type: 'image' },
];

// ─────────────────────────────────────────
// HERO
// ─────────────────────────────────────────
const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {heroSlides.map((bg, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms]" style={{ opacity: current === i ? 1 : 0 }}>
          <img src={bg} alt="" className="w-full h-full object-cover"
            style={{ animation: current === i ? 'kenBurns 15s ease-in-out forwards' : 'none' }}
            {...(i === 0 ? {} : { loading: 'lazy' as const })} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="font-accent text-lg md:text-xl tracking-[0.3em] uppercase text-white/80 mb-4">
          Beauty And The Brush
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Enhancing Beauty<br />
          <span className="text-blush italic font-normal">With Artistry.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
          className="font-body text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Premium makeup artistry for brides, engagements & celebrations in Bangalore
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/booking" className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/60 text-white rounded-full font-medium hover:bg-white hover:text-foreground transition-all duration-500 tracking-wide">
            Book Appointment
          </Link>
          <a href="https://wa.me/919148768958?text=Hello%20I%20want%20to%20inquire%20about%20your%20services"
            target="_blank" rel="noopener noreferrer"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white rounded-full font-medium hover:bg-white hover:text-foreground transition-all duration-500 tracking-wide">
            WhatsApp Us
          </a>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${current === i ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// COUNTERS
// ─────────────────────────────────────────
const CounterItem = ({ end, suffix, label }: { end: number; suffix: string; label: string }) => {
  const { ref, isInView } = useInView();
  const count = useAnimatedCounter(end, 2500, isInView);
  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-4xl md:text-5xl font-bold text-primary">{count.toLocaleString()}{suffix}</div>
      <p className="font-body text-muted-foreground mt-2 text-sm tracking-wide uppercase">{label}</p>
    </div>
  );
};

const CountersSection = () => {
  const { ref, isInView } = useInView();
  return (
    <section ref={ref} className="section-padding bg-cream">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        <CounterItem end={20} suffix="+" label="Years Experience" />
        <CounterItem end={30000} suffix="+" label="Happy Clients" />
        <CounterItem end={1000} suffix="+" label="Bridal Looks" />
        <CounterItem end={500} suffix="+" label="Party Makeovers" />
      </motion.div>
    </section>
  );
};

// ─────────────────────────────────────────
// SERVICES PREVIEW
// ─────────────────────────────────────────
const ServicesPreview = () => {
  const { ref, isInView } = useInView();
  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">What We Offer</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold">Our Services</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden luxury-shadow-card hover:luxury-glow transition-all duration-500">
              <div className="relative h-56 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-4 right-4 font-heading text-xl font-bold text-white">{service.price}</span>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold mb-2">{service.title}</h3>
                <p className="font-body text-muted-foreground text-sm mb-4 leading-relaxed">{service.description}</p>
                <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
                  View Details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// PORTFOLIO PREVIEW
// ─────────────────────────────────────────
interface PortfolioItem { id: string; url: string; type: string; }

const PortfolioPreview = () => {
  const { ref, isInView } = useInView();
  const [items, setItems] = useState<PortfolioItem[]>(FALLBACK_PORTFOLIO);

  useEffect(() => {
    fetch('http://localhost:5000/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="section-padding bg-cream">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Our Work</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold">Portfolio</h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto">A glimpse of our finest transformations.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] luxury-shadow hover:shadow-lg transition-all duration-500">
              {item.type === 'video' ? (
                <video src={item.url} className="w-full h-full object-cover" muted playsInline />
              ) : (
                <img src={item.url} alt="Portfolio" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            View Full Portfolio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// VIDEO SECTION
// Left: uploaded local video player
// Right: Instagram reel card (unchanged)
// ─────────────────────────────────────────

// ✅ Put your video in public/videos/ and set the filename here
const VIDEO_FILE_NAME = 'reel.mp4';
const INSTAGRAM_REEL_URL = 'https://www.instagram.com/reel/DW1lsCWgT-G/?igsh=cHhjeTF3emRndzR5';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/beautyandthebrush2026';

const VideoSection = () => {
  const { ref, isInView } = useInView();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); setStarted(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Watch</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold">Our Work in Motion</h2>
        </motion.div>

        {/* Two cards side by side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-10"
        >

          {/* ── LEFT: Local video player ── */}
          <div className="flex flex-col items-center w-full md:w-auto">
            <div className="relative group" style={{ width: '100%', maxWidth: '260px' }}>
              {/* Glow ring */}
              <div
                className="absolute -inset-1 rounded-3xl opacity-50 blur-md"
                style={{ background: 'linear-gradient(135deg, hsl(350,45%,68%), hsl(35,55%,62%))' }}
              />
              {/* Player */}
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  aspectRatio: '9/16',
                  background: 'hsl(20,15%,10%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
                }}
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  src={`/videos/${VIDEO_FILE_NAME}`}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  onEnded={() => setPlaying(false)}
                />

                {/* Play overlay when not started */}
                {!started && (
                  <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center gap-3">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        border: '2px solid rgba(255,255,255,0.55)',
                      }}
                    >
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                    <p className="font-body text-white/70 text-xs">Tap to play</p>
                  </div>
                )}

                {/* Controls on hover once started */}
                {started && (
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
                  >
                    <button onClick={togglePlay} className="text-white hover:text-white/80 transition-colors">
                      {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>
                    <button onClick={toggleMute} className="text-white hover:text-white/80 transition-colors">
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                {/* Label badge */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-[10px] font-body font-semibold tracking-wide"
                  style={{ background: 'linear-gradient(135deg, hsl(350,45%,58%), hsl(35,55%,52%))' }}
                >
                  ✦ Our Reel
                </div>
              </div>
            </div>
            <p className="font-body text-muted-foreground text-xs mt-3 text-center">
              Behind the brush ✨
            </p>
          </div>

          {/* ── RIGHT: Instagram reel card (original, unchanged) ── */}
          <div className="flex flex-col items-center w-full md:w-auto">
            <div style={{ width: '100%', maxWidth: '260px' }}>
              <a
                href={INSTAGRAM_REEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl overflow-hidden"
                style={{
                  aspectRatio: '9/16',
                  background: 'linear-gradient(135deg, hsl(350,30%,15%) 0%, hsl(20,15%,10%) 100%)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(350,40%,20%)] via-[hsl(20,20%,12%)] to-[hsl(350,30%,8%)]" />

                {/* Animated shimmer */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, hsl(350,50%,60%) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                    animation: 'shimmer 3s ease-in-out infinite',
                  }}
                />

                {/* Instagram icon + branding */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
                    style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>

                  {/* Play button */}
                  <div className="w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all duration-300 bg-white/10 backdrop-blur-sm">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>

                  <div className="text-center px-6">
                    <p className="font-heading text-white text-lg font-semibold mb-1">Watch on Instagram</p>
                    <p className="font-body text-white/60 text-sm">Tap to view our latest reel</p>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>

            {/* Caption below */}
            <p className="text-center font-body text-muted-foreground text-sm mt-4">
              Follow us{' '}
              <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                @beautyandthebrush2026
              </a>{' '}
              for more
            </p>
          </div>

        </motion.div>
      </div>

      {/* Keyframe for shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 200%; }
          50% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
      `}</style>
    </section>
  );
};

// ─────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────
const products = [
  { name: 'Almond & Honey Soap', image: soapProduct1 },
  { name: 'Rose Petal Soap', image: soapProduct2 },
  { name: 'Lavender Bliss Soap', image: soapProduct3 },
];

const ProductSection = () => {
  const { ref, isInView } = useInView();
  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Launching Soon</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold">Our Products</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div key={product.name} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden luxury-shadow hover:luxury-shadow-card transition-all duration-500">
              <div className="aspect-square overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-5 text-center">
                <h3 className="font-heading text-lg font-semibold mb-2">{product.name}</h3>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-body font-medium tracking-wider uppercase">Coming Soon</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// COUNTDOWN
// ─────────────────────────────────────────
const CountdownTimer = () => {
  const { ref, isInView } = useInView();
  const targetDate = new Date('2026-08-15T00:00:00');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60), seconds: Math.floor((diff / 1000) % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <section ref={ref} className="py-16 bg-cream">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto text-center px-4">
        <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-3">Product Launch</p>
        <h3 className="font-heading text-2xl md:text-3xl font-semibold mb-8">Launching August 2026</h3>
        <div className="flex justify-center gap-4 md:gap-8">
          {[{ label: 'Days', value: timeLeft.days }, { label: 'Hours', value: timeLeft.hours }, { label: 'Minutes', value: timeLeft.minutes }, { label: 'Seconds', value: timeLeft.seconds }].map(u => (
            <div key={u.label} className="bg-card rounded-xl p-4 md:p-6 luxury-shadow min-w-[70px] md:min-w-[90px]">
              <div className="font-heading text-2xl md:text-4xl font-bold text-primary tabular-nums">{String(u.value).padStart(2, '0')}</div>
              <p className="font-body text-xs text-muted-foreground mt-1 uppercase tracking-wider">{u.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ─────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────
const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const { ref, isInView } = useInView();
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
          <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-12">What Our Clients Say</h2>
        </motion.div>
        <div className="relative min-h-[200px]">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={false} animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 20 }}
              transition={{ duration: 0.6 }} className={`absolute inset-0 ${active !== i ? 'pointer-events-none' : ''}`}>
              <div className="flex justify-center mb-4">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-5 h-5 text-primary fill-primary" />)}</div>
              <p className="font-accent text-xl md:text-2xl italic text-foreground/80 leading-relaxed mb-6">"{t.text}"</p>
              <p className="font-body text-sm font-medium tracking-wide uppercase text-muted-foreground">— {t.name}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${active === i ? 'bg-primary w-8' : 'bg-border'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// WHY CHOOSE US
// ─────────────────────────────────────────
const WhyChooseUs = () => {
  const { ref, isInView } = useInView();
  const reasons = [
    { icon: Award, title: '20+ Years Expertise', desc: 'Two decades of perfecting the art of beauty.' },
    { icon: Heart, title: 'Premium Products', desc: 'Only the finest international brands used.' },
    { icon: Sparkles, title: 'Personalized Service', desc: 'Every look is tailored to your unique beauty.' },
    { icon: Star, title: 'Trusted by Thousands', desc: '30,000+ happy clients and counting.' },
  ];
  return (
    <section ref={ref} className="section-padding bg-cream">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Why Us</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold">Why Choose Beauty And The Brush</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <motion.div key={r.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center p-6 bg-card rounded-2xl luxury-shadow hover:luxury-glow transition-all duration-500">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4"><r.icon className="w-6 h-6 text-primary" /></div>
              <h3 className="font-heading text-lg font-semibold mb-2">{r.title}</h3>
              <p className="font-body text-muted-foreground text-sm">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// BLOG PREVIEW — 4 posts from backend
// ─────────────────────────────────────────
interface BlogPost { id?: string; _id?: string; title: string; content: string; createdAt?: string; date?: string; mediaUrl?: string; mediaType?: string; }

const BlogPreview = () => {
  const { ref, isInView } = useInView();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(apiUrl('/api/blog'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPosts(data.slice(0, 4));
      })
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section ref={ref} className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Latest</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold">From Our Blog</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, i) => {
            const postId = post.id || post._id;
            const postDate = post.createdAt || post.date;
            return (
              <motion.div key={postId} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden luxury-shadow hover:luxury-shadow-card transition-all duration-500 hover:-translate-y-1 cursor-pointer">
                <Link to={`/blog/${postId}`} className="block h-full">
                  {post.mediaUrl && post.mediaType === 'image' && (
                    <div className="h-40 overflow-hidden">
                      <img src={resolveMediaUrl(post.mediaUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  {!post.mediaUrl && (
                    <div className="h-28 bg-gradient-to-br from-[hsl(350,30%,92%)] to-[hsl(30,20%,90%)]" />
                  )}
                  <div className="p-5">
                    {postDate && (
                      <p className="text-xs text-muted-foreground font-body mb-2">
                        {new Date(postDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    <h3 className="font-heading text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    <p className="font-body text-muted-foreground text-xs leading-relaxed line-clamp-3">{post.content}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-3 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link to="/blog" className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────
const Index = () => (
  <>
    <HeroSection />
    <CountersSection />
    <ServicesPreview />
    <PortfolioPreview />
    <VideoSection />
    <ProductSection />
    <CountdownTimer />
    <Suspense fallback={<div className="h-screen bg-cream" />}>
      <SoapScrollSection />
    </Suspense>
    <TestimonialsSection />
    <WhyChooseUs />
    <HomeBlogSection />
  </>
);

export default Index;
 