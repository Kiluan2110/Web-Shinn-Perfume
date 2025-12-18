import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <motion.h3 
              className="text-white text-2xl tracking-wider mb-4"
              whileHover={{ scale: 1.05 }}
            >
              LUXE PARFUM
            </motion.h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Mang đến những mùi hương cao cấp, tinh tế và đẳng cấp cho cuộc sống của bạn.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: 'rgb(251 191 36)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:text-black transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg mb-4">Liên kết nhanh</h4>
            <ul className="space-y-3">
              {['Về chúng tôi', 'Sản phẩm', 'Bộ sưu tập', 'Blog', 'Chính sách'].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className="text-white/70 hover:text-yellow-400 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-white text-lg mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3">
              {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Thanh toán', 'Vận chuyển', 'FAQ'].map((item) => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className="text-white/70 hover:text-yellow-400 transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-white text-lg mb-4">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <span>123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span>contact@luxeparfum.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-white/10 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-white text-xl mb-4">Đăng ký nhận tin</h4>
            <p className="text-white/70 mb-6">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:border-yellow-400 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-full transition-all duration-300"
              >
                Đăng ký
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-white/50">
            © 2025 Luxe Parfum. Thiết kế bởi{' '}
            <span className="text-yellow-400">Figma Make</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
