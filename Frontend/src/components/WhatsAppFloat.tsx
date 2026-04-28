import { Phone } from 'lucide-react';

const WhatsAppFloat = () => (
  <a
    href="https://wa.me/919148768958?text=Hello%20I%20want%20to%20inquire%20about%20your%20services"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-primary-foreground shadow-lg hover:scale-110 transition-transform duration-300"
    aria-label="WhatsApp Us"
  >
    <Phone className="w-6 h-6" />
  </a>
);

export default WhatsAppFloat;
