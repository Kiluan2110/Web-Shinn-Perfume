import { ShoppingCart, Search, User } from 'lucide-react';
import { motion } from 'motion/react';

export function Navigation() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="text-white text-2xl tracking-wider"
            whileHover={{ scale: 1.05 }}
          >
            LUXE PARFUM
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Trang chủ', 'Sản phẩm', 'Bộ sưu tập', 'Về chúng tôi', 'Liên hệ'].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="text-white hover:text-yellow-400 transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button 
              className="text-white hover:text-yellow-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="text-white hover:text-yellow-400 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="text-white hover:text-yellow-400 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}