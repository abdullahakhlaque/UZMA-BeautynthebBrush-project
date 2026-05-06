import BlogDetail from "./pages/BlogDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider, useLenis } from "./components/LenisProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CartProvider } from "@/context/CartContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import SalonServices from "./pages/services/SalonServices";
import MakeupHair from "./pages/services/MakeupHair";
import Styling from "./pages/services/Styling";
import HairTreatments from "./pages/services/HairTreatments";
import Portfolio from "./pages/Portfolio";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ─── Scroll to top on every route change ───
const ScrollToTop = () => {
  const { scrollTo } = useLenis();
  const { pathname } = useLocation();
  useEffect(() => {
    scrollTo(0, { immediate: true });
  }, [pathname, scrollTo]);
  return null;
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
    <WhatsAppFloat />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LenisProvider>
      <TooltipProvider>
        <CartProvider>
          <CustomCursor />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
              <Route path="/services/salon" element={<PublicLayout><SalonServices /></PublicLayout>} />
              <Route path="/services/makeup-hair" element={<PublicLayout><MakeupHair /></PublicLayout>} />
              <Route path="/services/styling" element={<PublicLayout><Styling /></PublicLayout>} />
              <Route path="/services/hair-treatments" element={<PublicLayout><HairTreatments /></PublicLayout>} />
              <Route path="/services/:slug" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
              <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
              <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
              <Route path="/blog/:id" element={<PublicLayout><BlogDetail /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </LenisProvider>
  </QueryClientProvider>
);

export default App;