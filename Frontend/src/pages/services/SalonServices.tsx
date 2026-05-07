import { motion } from 'framer-motion';
import { PremiumReveal } from '@/components/PremiumReveal';
import { StaggerText } from '@/components/StaggerText';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useAnimations';
import salonBg from '@/assets/salon-interior.jpg';

const skinServices = [
  {
    category: 'Facials',
    items: ['Deep Cleansing Facial', 'Hydrating Facial', 'Anti-aging Facial', 'Gold Facial', 'Diamond Facial'],
  },
  {
    category: 'Clean-ups',
    items: ['Basic Clean-up', 'Deep Pore Clean-up', 'Fruit Clean-up'],
  },
  {
    category: 'Exfoliation',
    items: ['Microdermabrasion', 'Chemical Exfoliation', 'Enzyme Peel'],
  },
  {
    category: 'Acne Treatments',
    items: ['Acne Facial', 'Blue Light Therapy', 'Extraction Treatment'],
  },
  {
    category: 'Advanced Treatments',
    items: ['Chemical Peel', 'Botox', 'Fillers', 'PRP Treatment'],
  },
  {
    category: 'Skin Brightening',
    items: ['Glutathione Treatment', 'Vitamin C Infusion', 'Brightening Facial'],
  },
  {
    category: 'Hair Removal',
    items: ['Waxing', 'Threading', 'Laser Hair Removal', 'Upper Lip & Chin'],
  },
  {
    category: 'Body Treatments',
    items: ['Body Polishing', 'Body Wraps', 'De-tan Treatment'],
  },
];

const hairServices = [
  {
    category: 'Haircuts & Styling',
    items: ['Women\'s Haircut', 'Blow Dry & Styling', 'Updos & Event Hair'],
  },
  {
    category: 'Hair Coloring',
    items: ['Global Color', 'Highlights', 'Balayage', 'Root Touch-up', 'Fashion Colors'],
  },
  {
    category: 'Hair Spa & Treatments',
    items: ['Hair Spa', 'Deep Conditioning', 'Keratin Treatment', 'Protein Treatment'],
  },
  {
    category: 'Texture Services',
    items: ['Hair Smoothening', 'Permanent Straightening', 'Perm & Waves'],
  },
  {
    category: 'Extensions',
    items: ['Clip-in Extensions', 'Tape-in Extensions', 'Micro-ring Extensions'],
  },
];

const ServiceCategoryCard = ({ category, items, index }: { category: string; items: string[]; index: number }) => {
  const { ref, isInView } = useInView();
  return (
    <PremiumReveal delay={index * 0.1}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
      >
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">{category}</h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="font-body text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </PremiumReveal>
  );
};

const SalonServices = () => {
  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10" style={{ backgroundImage: 'url(' + salonBg + ')', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="fixed top-1/4 left-1/4 -z-10 w-[500px] h-[500px] rounded-full bg-[hsl(350,30%,85%)] opacity-[0.12] blur-[120px]" />
      <div className="fixed bottom-1/4 right-1/4 -z-10 w-[400px] h-[400px] rounded-full bg-[hsl(30,20%,90%)] opacity-[0.15] blur-[100px]" />

      <PremiumReveal>
          <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Salon Services</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold">Skin & Hair Care</h1>
            <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">Premium salon treatments to pamper your skin and hair.</p>
          </motion.div>

          {/* Skin Section */}
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-2xl md:text-3xl font-semibold mb-8 flex items-center gap-3"
            >
              <span className="w-10 h-1 bg-primary rounded-full" />
              Skin Treatments
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {skinServices.map((s, i) => (
                <ServiceCategoryCard key={s.category} category={s.category} items={s.items} index={i} />
              ))}
            </div>
          </div>

          {/* Hair Section */}
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-2xl md:text-3xl font-semibold mb-8 flex items-center gap-3"
            >
              <span className="w-10 h-1 bg-primary rounded-full" />
              Hair Services
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hairServices.map((s, i) => (
                <ServiceCategoryCard key={s.category} category={s.category} items={s.items} index={i} />
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 luxury-glow shadow-lg"
            >
              Book a Treatment
            </Link>
          </div>
        </div>
      </section>
    </PremiumReveal>
    </div>
  );
};

export default SalonServices;
