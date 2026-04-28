import { motion } from 'framer-motion';
import { useInView, useAnimatedCounter } from '@/hooks/useAnimations';
import aboutImg from '@/assets/about-artist.png';
import makeupTools from '@/assets/makeup-tools.jpg';

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

const About = () => {
  const { ref, isInView } = useInView();
  const { ref: ref2, isInView: isInView2 } = useInView();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section-padding bg-cream">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">About</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold">About Beauty And The Brush</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <img src={aboutImg} alt="Beauty And The Brush - Professional Makeup Artist" className="rounded-2xl luxury-shadow-card w-full" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6">A Passion for <span className="luxury-text-gradient">Perfection</span></h2>
              <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                <p>With over two decades of experience in the beauty industry, Beauty And The Brush has established itself as one of Bangalore's most sought-after makeup studios. Based in Yelahanka, the studio has become a haven for brides and beauty enthusiasts alike.</p>
                <p>Our philosophy is simple: every woman is beautiful, and our role is to enhance that natural beauty. We combine traditional techniques with contemporary trends, using only the finest international products to create looks that are both timeless and modern.</p>
                <p>Having worked with over 30,000 clients, including some of the city's most prominent families, we bring an unparalleled level of expertise, attention to detail, and personal care to every appointment.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <CounterItem end={20} suffix="+" label="Years Experience" />
          <CounterItem end={30000} suffix="+" label="Happy Clients" />
          <CounterItem end={1000} suffix="+" label="Bridal Looks" />
          <CounterItem end={500} suffix="+" label="Party Makeovers" />
        </div>
      </section>

      {/* Tools section */}
      <section ref={ref} className="section-padding bg-cream">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Our Kit</p>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-6">Premium Products & Tools</h2>
            <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>We use only the best international brands including MAC, Bobbi Brown, Charlotte Tilbury, Huda Beauty, and many more. Our professional airbrush system ensures flawless, long-lasting coverage.</p>
              <p>Every tool in our kit is sanitized and maintained to the highest standards. We believe that great artistry starts with great tools.</p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              {['MAC', 'Bobbi Brown', 'Charlotte Tilbury', 'Huda Beauty', 'Urban Decay', 'NARS'].map((brand) => (
                <span key={brand} className="px-4 py-2 text-xs font-body tracking-wide bg-card border border-border rounded-full text-muted-foreground">{brand}</span>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
            <img src={makeupTools} alt="Premium makeup tools" className="rounded-2xl luxury-shadow-card w-full" />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
