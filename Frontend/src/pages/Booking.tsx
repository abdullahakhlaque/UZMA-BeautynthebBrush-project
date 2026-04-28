import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Phone, CheckCircle } from 'lucide-react';
import { apiUrl } from '@/lib/api';

// ✅ FULL SERVICE LIST matching the website's offerings
const allServices = [
  // Salon Services — Skin
  { id: 'facial', category: 'Salon — Skin', title: 'Facials', description: 'Basic, hydrating, fruit, anti-aging, firming & brightening facials' },
  { id: 'cleanup', category: 'Salon — Skin', title: 'Deep Cleansing / Clean-ups', description: 'Remove impurities, blackheads and excess oil' },
  { id: 'exfoliation', category: 'Salon — Skin', title: 'Exfoliation Treatments', description: 'Microdermabrasion, peel-off masks to improve skin texture' },
  { id: 'acne', category: 'Salon — Skin', title: 'Acne Treatments', description: 'Anti-bacterial treatments to reduce acne and inflammation' },
  { id: 'advanced-skin', category: 'Salon — Skin', title: 'Advanced Skin Treatments', description: 'Chemical peels, Botox, dermal fillers' },
  { id: 'brightening', category: 'Salon — Skin', title: 'Skin Brightening / Lightening', description: 'Reduce pigmentation and even out skin tone' },
  { id: 'hair-removal', category: 'Salon — Skin', title: 'Hair Removal', description: 'Threading, waxing for facial and body hair' },
  { id: 'body-treatment', category: 'Salon — Skin', title: 'Body Treatments', description: 'Body scrubs, exfoliation and body polishing' },

  // Salon Services — Hair
  { id: 'haircut', category: 'Salon — Hair', title: 'Haircuts & Styling', description: 'Precision cuts, blow-drying, curling, ironing, updos' },
  { id: 'hair-color', category: 'Salon — Hair', title: 'Hair Coloring', description: 'Root touch-ups, global coloring, balayage, highlights' },
  { id: 'hair-spa', category: 'Salon — Hair', title: 'Hair Treatments & Spa', description: 'Deep conditioning, steam hair spa, dandruff & hair fall treatment' },
  { id: 'texture', category: 'Salon — Hair', title: 'Texture Services', description: 'Chemical straightening, smoothening, perms, relaxers' },
  { id: 'extensions', category: 'Salon — Hair', title: 'Extensions & Add-ons', description: 'Hair extensions for length or volume' },

  // Makeup & Hair (MUH)
  { id: 'bridal-makeup', category: 'Makeup & Hair', title: 'Bridal Makeup', description: 'Complete bridal look tailored to your style' },
  { id: 'party-makeup', category: 'Makeup & Hair', title: 'Party Makeup', description: 'Glamorous looks for every celebration' },

  // Styling
  { id: 'saree-draping', category: 'Styling', title: 'Saree Draping', description: 'Professional saree draping for all occasions' },
  { id: 'general-styling', category: 'Styling', title: 'General Styling', description: 'Outfit and accessory styling guidance' },

  // Hair Treatments
  { id: 'keratin', category: 'Hair Treatments', title: 'Keratin Treatment', description: 'Smooth and straighten hair, reducing frizz significantly' },
  { id: 'cysteine', category: 'Hair Treatments', title: 'Cysteine Treatment', description: 'Softer, more natural hair straightening option' },
  { id: 'botox-hair', category: 'Hair Treatments', title: 'Hair Botox', description: 'Smoothing treatment suitable for all hair types, lasts ~4 months' },
  { id: 'relaxer', category: 'Hair Treatments', title: 'Hair Relaxer', description: 'Stronger chemical process to straighten hair' },
  { id: 'deep-conditioning', category: 'Hair Treatments', title: 'Deep Conditioning / Hair Masks', description: 'Intense moisture-rich treatment for dryness' },
  { id: 'hot-oil', category: 'Hair Treatments', title: 'Hot Oil Treatment', description: 'Nourishment through warm oil infusions for dry, brittle hair' },
  { id: 'olaplex', category: 'Hair Treatments', title: 'Olaplex Treatment', description: 'Repairs damaged hair by strengthening hair bonds' },
  { id: 'scalp-treatment', category: 'Hair Treatments', title: 'Scalp Treatment', description: 'Rejuvenates scalp, promotes hair growth and minimises hair loss' },
  { id: 'detox', category: 'Hair Treatments', title: 'Detox Treatment', description: 'Cleanses the scalp and hair thoroughly' },
  { id: 'color-protection', category: 'Hair Treatments', title: 'Color Protection Treatment', description: 'Maintain and protect hair color' },
  { id: 'anti-breakage', category: 'Hair Treatments', title: 'Anti-Breakage Treatment', description: 'Strengthens hair to reduce breakage' },
];

const categories = [...new Set(allServices.map(s => s.category))];

const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

const steps = ['Select Service', 'Choose Date & Time', 'Your Details', 'Confirmation'];

const Booking = () => {
  const [step, setStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedServiceData = allServices.find(s => s.id === selectedService);

  const handleBooking = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(apiUrl('/api/book'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          service: selectedServiceData?.title || selectedService,
          date: new Date(selectedDate).toISOString(),
          timeSlot: selectedTime,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setIsSubmitting(false);
        return;
      }

      setStep(3);
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => {
    setError('');
    if (step === 2) {
      handleBooking();
      return;
    }
    setStep(s => Math.min(s + 1, 3));
  };

  const prev = () => {
    setError('');
    setStep(s => Math.max(s - 1, 0));
  };

  const whatsappMessage = encodeURIComponent(
    `Hi, I booked an appointment:\nName: ${name}\nService: ${selectedServiceData?.title}\nDate: ${selectedDate}\nTime: ${selectedTime}`
  );

  const filteredServices = allServices.filter(s => s.category === activeCategory);

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[hsl(30,20%,97%)] via-[hsl(350,30%,96%)] to-[hsl(0,0%,100%)]" />
      <div className="fixed top-1/3 left-1/3 -z-10 w-[500px] h-[500px] rounded-full bg-[hsl(350,30%,85%)] opacity-[0.1] blur-[120px]" />

      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="font-accent text-primary tracking-[0.2em] uppercase text-sm mb-2">Booking</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold">Book Your Appointment</h1>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body transition-colors ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`hidden sm:block w-12 md:w-20 h-px mx-2 ${i < step ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-body">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* ── STEP 0: SELECT SERVICE ── */}
              {step === 0 && (
                <div>
                  <h2 className="font-heading text-xl font-semibold mb-4">Select a Service</h2>

                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
                          activeCategory === cat
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Services list */}
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {filteredServices.map(service => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedService === service.id
                            ? 'border-primary bg-accent/30'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <span className="font-heading font-semibold block">{service.title}</span>
                        <p className="font-body text-sm text-muted-foreground mt-0.5">{service.description}</p>
                      </button>
                    ))}
                  </div>

                  {selectedServiceData && (
                    <div className="mt-4 p-3 rounded-xl bg-accent/40 text-sm font-body text-primary">
                      ✓ Selected: <strong>{selectedServiceData.title}</strong> ({selectedServiceData.category})
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 1: DATE & TIME ── */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-semibold mb-6">Choose Date & Time</h2>
                  <div>
                    <label className="block font-body text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card font-body focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-body transition-all ${
                            selectedTime === time
                              ? 'border-primary bg-accent/30 text-primary'
                              : 'border-border hover:border-primary/30'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: DETAILS ── */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-semibold mb-6">Your Details</h2>
                  <div>
                    <label className="block font-body text-sm font-medium mb-2">
                      <User className="w-4 h-4 inline mr-2" />Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card font-body focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card font-body focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-accent/30 space-y-1.5 text-sm font-body">
                    <p><strong>Service:</strong> {selectedServiceData?.title}</p>
                    <p><strong>Date:</strong> {selectedDate}</p>
                    <p><strong>Time:</strong> {selectedTime}</p>
                  </div>
                </div>
              )}

              {/* ── STEP 3: CONFIRMATION ── */}
              {step === 3 && (
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                    <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
                  </motion.div>
                  <h2 className="font-heading text-2xl font-semibold mb-4">Booking Confirmed!</h2>
                  <div className="bg-cream rounded-2xl p-6 text-left space-y-3 mb-6">
                    <p className="font-body text-sm"><strong>Service:</strong> {selectedServiceData?.title}</p>
                    <p className="font-body text-sm"><strong>Date:</strong> {selectedDate}</p>
                    <p className="font-body text-sm"><strong>Time:</strong> {selectedTime}</p>
                    <p className="font-body text-sm"><strong>Name:</strong> {name}</p>
                    <p className="font-body text-sm"><strong>Phone:</strong> {phone}</p>
                  </div>
                  <a
                    href={`https://wa.me/919148768958?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg"
                  >
                    Confirm via WhatsApp
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 3 && (
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button onClick={prev} className="px-6 py-3 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                  ← Back
                </button>
              ) : <div />}
              <button
                onClick={next}
                disabled={
                  isSubmitting ||
                  (step === 0 && !selectedService) ||
                  (step === 1 && (!selectedDate || !selectedTime)) ||
                  (step === 2 && (!name || !phone))
                }
                className="px-8 py-3 text-base font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed luxury-glow shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : step === 2 ? 'Confirm Booking' : 'Continue →'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Booking;
