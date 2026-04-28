import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Instagram } from 'lucide-react';
import makeupTools from '@/assets/makeup-tools.jpg';
import { apiUrl } from '@/lib/api';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    message: '',
    service: '',
    date: '',
    timeSlot: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const WHATSAPP_NUMBER = "919148768958";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.service || !form.date || !form.timeSlot) {
      alert("Please fill all booking details");
      return;
    }

    try {
      const res = await fetch(apiUrl('/api/book'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          service: form.service,
          date: new Date(form.date).toISOString(),
          timeSlot: form.timeSlot,
        }),
      });

      const data = await res.json();
      if (data.error) { alert(data.error); return; }

      alert("Booking Confirmed ✅");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

      const bookingMessage = `Hi, I booked an appointment:\nName: ${form.name}\nPhone: ${form.phone}\nService: ${form.service}\nDate: ${form.date}\nTime: ${form.timeSlot}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(bookingMessage)}`, "_blank");

      setForm({ name: '', phone: '', message: '', service: '', date: '', timeSlot: '' });
    } catch (err) {
      console.error(err);
      alert("Error connecting to server ❌");
    }
  };

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">

      {/* ✅ BACKGROUND IMAGE */}
      <div className="fixed inset-0 -z-10">
        <img src={makeupTools} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(30,20%,97%)]/90" />
      </div>

      {/* HERO BANNER */}
      <div className="relative h-48 md:h-56 flex items-center justify-center overflow-hidden">
        <img src={makeupTools} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center px-4">
          <p className="font-accent text-white/70 tracking-[0.2em] uppercase text-sm mb-2">Get In Touch</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-white">Contact Us</h1>
          <p className="font-body text-white/70 mt-3">We'd love to hear from you.</p>
        </div>
      </div>

      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* FORM */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="rounded-2xl p-8 md:p-10" style={{ background: 'hsl(var(--card) / 0.9)', boxShadow: 'var(--shadow-card)' }}>
                <h2 className="font-heading text-2xl font-semibold mb-6">Book an Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                  <div>
                    <label className="block font-body text-sm font-medium mb-2">Your Name</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium mb-2">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium mb-2">Service</label>
                    <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all">
                      <option value="">Select Service</option>
                      <optgroup label="Makeup & Hair">
                        <option>Bridal Makeup</option>
                        <option>Party Makeup</option>
                      </optgroup>
                      <optgroup label="Styling">
                        <option>Saree Draping</option>
                        <option>General Styling</option>
                      </optgroup>
                      <optgroup label="Hair Treatments">
                        <option>Keratin Treatment</option>
                        <option>Cysteine Treatment</option>
                        <option>Hair Botox</option>
                        <option>Hair Spa</option>
                        <option>Deep Conditioning</option>
                        <option>Hot Oil Treatment</option>
                        <option>Olaplex Treatment</option>
                        <option>Scalp Treatment</option>
                        <option>Detox Treatment</option>
                      </optgroup>
                      <optgroup label="Salon — Skin">
                        <option>Facial</option>
                        <option>Deep Cleansing</option>
                        <option>Acne Treatment</option>
                        <option>Skin Brightening</option>
                        <option>Hair Removal</option>
                        <option>Body Treatment</option>
                      </optgroup>
                      <optgroup label="Salon — Hair">
                        <option>Haircut & Styling</option>
                        <option>Hair Coloring</option>
                        <option>Hair Extensions</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium mb-2">Date</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium mb-2">Time Slot</label>
                    <select value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })} required
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all">
                      <option value="">Select Time</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>12:00 PM</option>
                      <option>2:00 PM</option>
                      <option>3:00 PM</option>
                      <option>4:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-body text-sm font-medium mb-2">Message (optional)</label>
                    <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} placeholder="Any special requests..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background font-body text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none" />
                  </div>

                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full px-8 py-4 font-medium border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 luxury-glow flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    {submitted ? 'Booking Confirmed ✅' : 'Book Appointment'}
                  </motion.button>
                </form>
              </div>

              {/* WhatsApp Button */}
              <div className="mt-6 text-center">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20I%20want%20to%20book%20a%20service`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity">
                  Chat on WhatsApp 💬
                </a>
              </div>
            </motion.div>

            {/* MAP + CONTACT DETAILS */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="space-y-6">

              {/* Map */}
              <div className="rounded-2xl overflow-hidden h-72" style={{ boxShadow: 'var(--shadow-card)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.0!2d77.5750!3d13.0250!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f15!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAxJzMwLjAiTiA3N8KwMzQnMzAuMCJF!5e0!3m2!1sen!2sin!4v1679900000000!5m2!1sen!2sin&z=15"
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Beauty And The Brush Location"
                />
              </div>

              {/* Contact Info */}
              <div className="rounded-2xl p-6 space-y-4" style={{ background: 'hsl(var(--card) / 0.9)', boxShadow: 'var(--shadow-card)' }}>
                {[
                  { icon: MapPin, text: '#173/2, 2nd Cross Road, Emerald Layout, Shakti Nagar, Bangalore 560077', href: 'https://www.google.com/maps/search/173+2nd+Cross+Road+Emerald+Layout+Shakti+Nagar+Bangalore+560077' },
                  { icon: Phone, text: '+91 91487 68958', href: `https://wa.me/${WHATSAPP_NUMBER}` },
                  { icon: Mail, text: 'shaziatheshaikh@gmail.com', href: 'mailto:shaziatheshaikh@gmail.com' },
                  { icon: Instagram, text: '@artisteshaikh', href: 'https://www.instagram.com/artisteshaikh/' },
                ].map(({ icon: Icon, text, href }) => (
                  <a key={text} href={href} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-3 group py-1">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">{text}</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
