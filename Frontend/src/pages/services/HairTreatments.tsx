import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useAnimations';

const treatments = [
  { name: 'Keratin Treatment', desc: 'Smoothens and strengthens hair, reducing frizz for up to 6 months.' },
  { name: 'Cysteine Treatment', desc: 'Formaldehyde-free smoothing treatment for natural-looking straight hair.' },
  { name: 'Botox Treatment', desc: 'Repairs damaged hair, adds volume, and restores shine.' },
  { name: 'Hair Relaxer', desc: 'Permanently straightens curly or wavy hair for a sleek finish.' },
  { name: 'Hair Spa', desc: 'Deep nourishment treatment for dry, damaged, or stressed hair.' },
  { name: 'Deep Conditioning', desc: 'Intensive moisture therapy for soft, silky, manageable hair.' },
  { name: 'Hot Oil Treatment', desc: 'Traditional warm oil massage to strengthen roots and promote growth.' },
  { name: 'Olaplex Treatment', desc: 'Bond-building treatment that repairs hair at the molecular level.' },
  { name: 'Scalp Treatments', desc: 'Targeted solutions for dandruff, dryness, and scalp health.' },
  { name: 'Detox Treatment', desc: 'Removes product buildup and impurities for a fresh, clean scalp.' },
  { name: 'Color Protection', desc: 'Shields and maintains vibrancy of color-treated hair.' },
  { name: 'Anti-Breakage Treatment', desc: 'Strengthens fragile hair and reduces breakage and split ends.' },
  { name: 'Hair Styling', desc: 'Professional styling for events — blowouts, curls, updos, and braids.' },
];

const HairTreatments = () => {
  const { ref, isInView } = useInView();

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[hsl(30,20%,97%)] via-[hsl(350,30%,96%)] to-[hsl(0,0%,100%)]" />
      <div className="fixed bottom-1/4 left-1/3 -z-10 w-[500px] h-[500px] rounded-full bg-[hsl(350,30%,85%)] opacity-[0.12] blur-[120px]" />

      <section ref={ref} className="section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Hair Treatments</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold">Professional Hair Treatments</h1>
            <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">Advanced treatments for every hair type and concern.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
              >
                <h3 className="font-heading text-lg font-semibold mb-2">{t.name}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 luxury-glow shadow-lg"
            >
              Book a Treatment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HairTreatments;
