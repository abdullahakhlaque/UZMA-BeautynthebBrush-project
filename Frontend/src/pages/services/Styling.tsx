import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useAnimations';
import sareeDraping from '@/assets/saree-draping.jpg';
import hairStyling from '@/assets/hair-styling.jpg';

const stylingServices = [
  {
    title: 'Saree Draping',
    description: 'Expert saree draping in multiple styles, including Nivi, Bengali, Gujarati, Maharashtrian, and contemporary fusion drapes. Secured with precision for comfort and elegance.',
    price: 'Rs. 1,000',
    image: sareeDraping,
    styles: ['Nivi Style', 'Bengali Style', 'Gujarati Style', 'Maharashtrian Style', 'Lehenga Saree', 'Contemporary Drape'],
  },
  {
    title: 'General Styling',
    description: 'Complete outfit styling and consultation for any occasion. We help you put together the perfect look from accessories to overall presentation.',
    price: 'Rs. 1,500',
    image: hairStyling,
    styles: ['Outfit Consultation', 'Accessory Pairing', 'Hair Styling Advice', 'Occasion-Based Styling', 'Finishing Touch Guidance'],
  },
];

const Styling = () => {
  const { ref, isInView } = useInView();

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[hsl(30,20%,97%)] via-[hsl(350,30%,96%)] to-[hsl(0,0%,100%)]" />
      <div className="fixed top-1/3 right-1/4 -z-10 w-[400px] h-[400px] rounded-full bg-[hsl(350,30%,85%)] opacity-[0.1] blur-[120px]" />

      <section ref={ref} className="section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Styling</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold">Styling Services</h1>
            <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">Expert draping and styling to complete your look.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stylingServices.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-500"
              >
                {service.image && (
                  <div className="h-60 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-xl font-semibold">{service.title}</h2>
                    <span className="font-heading text-xl text-primary font-bold">{service.price}</span>
                  </div>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.styles.map((style) => (
                      <span key={style} className="px-3 py-1.5 text-xs font-body bg-accent/50 text-foreground/70 rounded-full">{style}</span>
                    ))}
                  </div>
                  <Link to="/booking" className="inline-flex px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 luxury-glow">
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Styling;
