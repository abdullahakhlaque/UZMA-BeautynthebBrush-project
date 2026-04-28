import bridalMakeup from '@/assets/bridal-makeup.jpg';
import engagementMakeup from '@/assets/engagement-makeup.jpg';
import partyMakeup from '@/assets/party-makeup.jpg';
import hairStyling from '@/assets/hair-styling.jpg';
import sareeDraping from '@/assets/saree-draping.jpg';
import makeupTools from '@/assets/makeup-tools.jpg';

export interface Service {
  id: string;
  title: string;
  slug: string;
  price: string;
  description: string;
  longDescription: string;
  image: string;
  includes: string[];
  tools: string[];
}

export const services: Service[] = [
  {
    id: '1',
    title: 'Bridal Makeup',
    slug: 'bridal-makeup',
    price: '₹20,000',
    description: 'Complete bridal transformation with premium products for your special day.',
    longDescription: 'Our signature bridal makeup service is a complete transformation experience. We use only the finest international and premium products to ensure your look lasts through every moment of your celebration. From the initial consultation to the final touch, every detail is curated to perfection.',
    image: bridalMakeup,
    includes: ['HD/Airbrush Makeup', 'Hair Styling & Setting', 'Skin Preparation & Primer', 'Nail Grooming', 'Draping Assistance', 'Touch-up Kit'],
    tools: ['MAC', 'Bobbi Brown', 'Charlotte Tilbury', 'Huda Beauty', 'Airbrush System'],
  },
  {
    id: '2',
    title: 'Engagement Makeup',
    slug: 'engagement-makeup',
    price: '₹15,000',
    description: 'Elegant and radiant look for your engagement ceremony.',
    longDescription: 'Your engagement is the beginning of a beautiful journey. Our engagement makeup service ensures you look absolutely stunning with a look that\'s elegant yet camera-ready. We blend traditional beauty with contemporary trends.',
    image: engagementMakeup,
    includes: ['HD Makeup', 'Hair Styling', 'Skin Prep', 'Lash Application', 'Touch-up Kit'],
    tools: ['MAC', 'Urban Decay', 'Too Faced', 'Huda Beauty'],
  },
  {
    id: '3',
    title: 'Party Makeup',
    slug: 'party-makeup',
    price: '₹8,000',
    description: 'Glamorous looks for any occasion — from cocktail to reception.',
    longDescription: 'Whether it\'s a cocktail party, reception, or a special night out, our party makeup service creates a glamorous, head-turning look tailored to your outfit and the occasion.',
    image: partyMakeup,
    includes: ['Professional Makeup', 'Hair Styling', 'Skin Prep', 'Lash Application'],
    tools: ['MAC', 'Huda Beauty', 'Too Faced', 'NYX Professional'],
  },
  {
    id: '4',
    title: 'Hair Styling',
    slug: 'hair-styling',
    price: '₹5,000',
    description: 'Professional hair styling — from elegant updos to flowing waves.',
    longDescription: 'Our expert hair stylists create stunning hairstyles that complement your overall look. From traditional buns to modern waves, we tailor every style to your face shape and outfit.',
    image: hairStyling,
    includes: ['Consultation', 'Wash & Blow Dry', 'Styling & Setting', 'Hair Accessories'],
    tools: ['GHD', 'Dyson', 'Professional Grade Products'],
  },
  {
    id: '5',
    title: 'Saree Draping',
    slug: 'saree-draping',
    price: '₹3,000',
    description: 'Expert saree draping in multiple styles for every occasion.',
    longDescription: 'Our professional saree draping service offers multiple styles from classic Nivi to contemporary drapes. Each draping is secured with precision to ensure comfort and elegance throughout your event.',
    image: sareeDraping,
    includes: ['Style Consultation', 'Professional Draping', 'Pleating & Pinning', 'Comfort Fitting'],
    tools: ['Safety Pins', 'Professional Draping Tools'],
  },
  {
    id: '6',
    title: 'Skin Preparation',
    slug: 'skin-prep',
    price: '₹4,000',
    description: 'Pre-event skincare ritual for a flawless, glowing canvas.',
    longDescription: 'Our skin preparation service is the foundation of every beautiful look. Using premium skincare products, we cleanse, exfoliate, and hydrate your skin to create the perfect canvas for makeup application.',
    image: makeupTools,
    includes: ['Deep Cleansing', 'Exfoliation', 'Face Mask', 'Moisturizing', 'Primer Application'],
    tools: ['Dermalogica', 'SK-II', 'La Mer', 'Professional Tools'],
  },
];

export const testimonials = [
  {
    name: 'Priya Sharma',
    text: 'Beauty And The Brush made me feel like an absolute queen on my wedding day. Their attention to detail is unmatched!',
    rating: 5,
  },
  {
    name: 'Ananya Reddy',
    text: 'The bridal package was worth every penny. My makeup lasted through 12 hours of celebrations without a single touch-up needed.',
    rating: 5,
  },
  {
    name: 'Fatima Khan',
    text: 'I\'ve been going to Beauty And The Brush for years. Whether it\'s a party or a wedding, they always create the perfect look.',
    rating: 5,
  },
  {
    name: 'Meera Nair',
    text: 'The artistry at Beauty And The Brush transformed my engagement look beyond expectations. So professional and talented!',
    rating: 5,
  },
];

export const blogPosts = [
  {
    id: '1',
    title: '10 Bridal Makeup Trends for 2026',
    excerpt: 'Discover the latest bridal makeup trends that will dominate this wedding season — from dewy glass skin to bold eye looks.',
    date: 'March 15, 2026',
    image: bridalMakeup,
  },
  {
    id: '2',
    title: 'Pre-Wedding Skincare Routine',
    excerpt: 'Start your skincare journey 3 months before the big day. Here\'s a complete guide to achieving flawless bridal skin.',
    date: 'March 10, 2026',
    image: makeupTools,
  },
  {
    id: '3',
    title: 'Choosing the Right Makeup for Your Skin Tone',
    excerpt: 'Understanding your skin tone is the first step to a flawless makeup look. Learn how to identify and enhance your natural beauty.',
    date: 'March 5, 2026',
    image: engagementMakeup,
  },
];
