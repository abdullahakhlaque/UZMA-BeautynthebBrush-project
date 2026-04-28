import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const FloatingCart = () => {
  const { items, removeItem, clearCart, isOpen, setIsOpen } = useCart();

  if (items.length === 0) return null;

  return (
    <>
      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white border-t border-gray-200 shadow-2xl max-h-72 overflow-y-auto"
            >
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-sm">
                    Selected Services ({items.length})
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium font-body">{item.title}</p>
                        <p className="text-xs text-gray-400 font-body">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors ml-3"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <Link
                  to="/booking"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Book {items.length} Service{items.length > 1 ? 's' : ''} <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed tab — always visible when cart has items */}
        {!isOpen && (
          <motion.button
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-full bg-black text-white py-3.5 flex items-center justify-center gap-3 shadow-2xl"
          >
            <ShoppingBag size={18} />
            <span className="font-body font-medium text-sm">
              {items.length} service{items.length > 1 ? 's' : ''} selected — Book Now
            </span>
            <ArrowRight size={16} />
          </motion.button>
        )}
      </div>

      {/* Spacer so page content isn't hidden behind the bar */}
      <div className="h-14" />
    </>
  );
};

export default FloatingCart;