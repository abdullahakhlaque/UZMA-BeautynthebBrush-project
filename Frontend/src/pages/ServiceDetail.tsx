import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Phone, ArrowLeft } from 'lucide-react';
import { services } from '@/data/siteData';

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="pt-20 section-padding text-center">
        <h1 className="font-heading text-3xl">Service not found</h1>
        <Link to="/services" className="text-primary font-body mt-4 inline-block">← Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[hsl(30,20%,97%)] via-[hsl(350,30%,96%)] to-[hsl(0,0%,100%)]" />
      <div className="fixed top-1/3 right-1/4 -z-10 w-[400px] h-[400px] rounded-full bg-[hsl(350,30%,85%)] opacity-[0.1] blur-[120px]" />

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <img src={service.image} alt={service.title} className="rounded-2xl luxury-shadow-card w-full" />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Service</p>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold mb-2">{service.title}</h1>
              <p className="font-heading text-2xl text-primary font-bold mb-6">{service.price}</p>
              <p className="font-body text-muted-foreground leading-relaxed mb-8">{service.longDescription}</p>

              <div className="mb-8">
                <h3 className="font-heading text-lg font-semibold mb-4">What's Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.includes.map((item) => (
                    <div key={item} className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-heading text-lg font-semibold mb-4">Products Used</h3>
                <div className="flex flex-wrap gap-2">
                  {service.tools.map((tool) => (
                    <span key={tool} className="px-4 py-2 text-xs font-body tracking-wide bg-cream border border-border rounded-full text-muted-foreground">{tool}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking" className="px-8 py-4 text-center text-sm font-medium border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 luxury-glow">
                  Book This Service
                </Link>
                <a
                  href="https://wa.me/919148768958?text=Hello%20I%20want%20to%20inquire%20about%20your%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 text-center text-sm font-medium border-2 border-green-600 text-green-700 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
