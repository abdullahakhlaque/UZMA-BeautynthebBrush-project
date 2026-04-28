import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { services } from '@/data/siteData';
import { useInView } from '@/hooks/useAnimations';

const Services = () => {
  const { ref, isInView } = useInView();

  return (
    <div className="pt-20">
      <section ref={ref} className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">What We Offer</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold">Our Services</h1>
            <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">Every service is crafted with precision, passion, and the finest products to make you look and feel extraordinary.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden luxury-shadow-card hover:luxury-glow transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                  <span className="absolute bottom-4 right-4 font-heading text-2xl font-bold text-background">{service.price}</span>
                </div>
                <div className="p-6">
                  <h2 className="font-heading text-xl font-semibold mb-2">{service.title}</h2>
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
    </div>
  );
};

export default Services;
