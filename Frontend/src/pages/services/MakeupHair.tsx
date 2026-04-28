import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useAnimations';
import bridalMakeup from '@/assets/bridal-makeup.jpg';
import partyMakeup from '@/assets/party-makeup.jpg';

const services = [
  {
    title: 'Bridal Makeup',
    description: 'Complete bridal transformation with HD/Airbrush makeup, hair styling, skin prep, draping assistance, and touch-up kit. Premium international brands used.',
    price: '₹20,000',
    image: bridalMakeup,
    includes: ['HD/Airbrush Makeup', 'Hair Styling & Setting', 'Skin Preparation', 'Nail Grooming', 'Draping Assistance', 'Touch-up Kit'],
  },
  {
    title: 'Party Makeup',
    description: 'Glamorous looks for cocktails, receptions, engagements, and special occasions. Camera-ready finish with long-lasting products.',
    price: '₹15,000',
    image: partyMakeup,
    includes: ['Professional HD Makeup', 'Hair Styling', 'Skin Prep & Primer', 'Lash Application', 'Setting Spray'],
  },
];

const MakeupHair = () => {
  const { ref, isInView } = useInView();

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[hsl(30,20%,97%)] via-[hsl(350,30%,96%)] to-[hsl(0,0%,100%)]" />
      <div className="fixed top-1/3 left-1/3 -z-10 w-[500px] h-[500px] rounded-full bg-[hsl(350,30%,85%)] opacity-[0.1] blur-[120px]" />

      <section ref={ref} className="section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Makeup & Hair</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold">Bridal & Party Makeup</h1>
            <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">Professional makeup artistry for your most special moments.</p>
          </motion.div>

          <div className="space-y-16">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}
              >
                <div className={`${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="rounded-2xl overflow-hidden luxury-shadow-card">
                    <img src={service.image} alt={service.title} className="w-full h-80 object-cover" loading="lazy" />
                  </div>
                </div>
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold mb-2">{service.title}</h2>
                  <p className="font-heading text-2xl text-primary font-bold mb-4">{service.price}</p>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {service.includes.map((item) => (
                      <div key={item} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <Link to="/booking" className="inline-flex px-8 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 luxury-glow">
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

export default MakeupHair;
