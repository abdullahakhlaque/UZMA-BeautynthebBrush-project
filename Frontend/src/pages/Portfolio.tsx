import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useAnimations';
import salonImg from '@/assets/salon-interior.jpg';
import { apiUrl, resolveMediaUrl } from '@/lib/api';

interface PortfolioItem {
  id: string;
  url: string;
  type: 'image' | 'video';
}

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const { ref, isInView } = useInView();

  useEffect(() => {
    fetch(apiUrl('/api/portfolio'))
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const navigate = (dir: 1 | -1) => {
    if (selected === null) return;
    setSelected((selected + dir + items.length) % items.length);
  };

  return (
    <div className="min-h-screen" style={{ background: 'hsl(30, 20%, 98%)' }}>

      {/* ── HERO BANNER ── */}
      <div className="relative h-64 md:h-80 flex items-end justify-center overflow-hidden">
        <img src={salonImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)' }} />
        <div className="relative z-10 text-center px-4 pb-10 md:pb-14">
          {/* Thin gold rule */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #c9a96e)' }} />
            <span className="font-accent tracking-[0.35em] uppercase text-xs" style={{ color: '#c9a96e' }}>Our Work</span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #c9a96e)' }} />
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-light text-white tracking-wide">Portfolio</h1>
          <p className="font-body text-white/60 mt-3 text-sm tracking-widest uppercase">A curated collection of our finest artistry</p>
        </div>
      </div>

      {/* ── GALLERY ── */}
      <section ref={ref} className="px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          {loading && (
            <div className="flex items-center justify-center py-32">
              <div className="flex gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full"
                    style={{ background: '#c9a96e', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="text-center py-32">
              <div className="w-16 h-px mx-auto mb-8" style={{ background: '#c9a96e' }} />
              <p className="font-heading text-2xl font-light text-gray-400 mb-2">No items yet</p>
              <p className="font-body text-sm text-gray-400">Upload images from the admin panel to populate the gallery.</p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <>
              {/* Count indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-12"
              >
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, #c9a96e, transparent)' }} />
                <span className="font-accent text-xs tracking-[0.3em] uppercase" style={{ color: '#c9a96e' }}>
                  {items.length} {items.length === 1 ? 'Creation' : 'Creations'}
                </span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, #c9a96e, transparent)' }} />
              </motion.div>

              {/* Masonry-style grid with varied sizes */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5 space-y-0">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: Math.min(i * 0.06, 0.5) }}
                    onClick={() => setSelected(i)}
                    className="break-inside-avoid mb-4 md:mb-5 group cursor-pointer"
                  >
                    <div
                      className="relative overflow-hidden"
                      style={{
                        borderRadius: '4px',
                        boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                        transition: 'box-shadow 0.4s ease, transform 0.4s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 48px rgba(0,0,0,0.18)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={resolveMediaUrl(item.url)}
                          className="w-full h-auto block"
                          alt="Portfolio"
                          loading="lazy"
                          style={{ display: 'block' }}
                        />
                      ) : (
                        <video
                          src={resolveMediaUrl(item.url)}
                          className="w-full h-auto block"
                          muted
                          playsInline
                        />
                      )}

                      {/* Hover overlay — gold tinted */}
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'rgba(201,169,110,0.15)', backdropFilter: 'blur(1px)' }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center border"
                          style={{ borderColor: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.2)' }}
                        >
                          <span className="text-white text-lg">{item.type === 'video' ? '▶' : '+'}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selected !== null && items[selected] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(10,8,6,0.96)', backdropFilter: 'blur(16px)' }}
            onClick={() => setSelected(null)}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 flex items-center gap-2 transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <X className="w-5 h-5" />
              <span className="font-body text-xs tracking-widest uppercase">Close</span>
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 font-accent text-xs tracking-[0.25em]" style={{ color: '#c9a96e' }}>
              {String(selected + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </div>

            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Media */}
            <motion.div
              key={selected}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={e => e.stopPropagation()}
            >
              {items[selected].type === 'image' ? (
                <img
                  src={resolveMediaUrl(items[selected].url)}
                  className="max-w-full max-h-[82vh] object-contain"
                  style={{ borderRadius: '3px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
                  alt="Portfolio"
                />
              ) : (
                <video
                  src={resolveMediaUrl(items[selected].url)}
                  controls
                  className="max-w-full max-h-[82vh]"
                  style={{ borderRadius: '3px' }}
                />
              )}
            </motion.div>

            {/* Gold bottom rule */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <div className="h-px w-8" style={{ background: 'linear-gradient(to right, transparent, #c9a96e)' }} />
              <span className="font-accent text-xs tracking-[0.3em] uppercase" style={{ color: '#c9a96e40' }}>Beauty & The Brush</span>
              <div className="h-px w-8" style={{ background: 'linear-gradient(to left, transparent, #c9a96e)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;