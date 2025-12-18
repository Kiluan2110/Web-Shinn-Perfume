import { motion } from 'motion/react';
import { ProductCard } from './ProductCard';

const products = [
  {
    id: 1,
    name: 'Essence Élégance',
    price: '3.500.000₫',
    image: 'https://images.unsplash.com/photo-1704961212944-524f56df23fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcGVyZnVtZSUyMHByb2R1Y3R8ZW58MXx8fHwxNzY1ODIwOTA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Hương hoa cỏ thanh lịch',
  },
  {
    id: 2,
    name: 'Noir Mystique',
    price: '4.200.000₫',
    image: 'https://images.unsplash.com/photo-1763631403216-8d193008481e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGZyYWdyYW5jZSUyMGJvdHRsZXxlbnwxfHx8fDE3NjU3OTk1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Hương gỗ bí ẩn quyến rũ',
  },
  {
    id: 3,
    name: 'Rose Royale',
    price: '3.800.000₫',
    image: 'https://images.unsplash.com/photo-1739190940453-20900e9d18fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwcGVyZnVtZXxlbnwxfHx8fDE3NjU3NDE3Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Hương hoa hồng hoàng gia',
  },
  {
    id: 4,
    name: 'Velvet Dreams',
    price: '4.500.000₫',
    image: 'https://images.unsplash.com/photo-1706408604086-144590f4020a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMHBlcmZ1bWUlMjBib3R0bGV8ZW58MXx8fHwxNzY1ODIwOTEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Hương vani ấm áp mơ mộng',
  },
  {
    id: 5,
    name: 'Azure Breeze',
    price: '3.200.000₫',
    image: 'https://images.unsplash.com/photo-1621962728414-2bf391e9c8d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmFncmFuY2UlMjBiZWF1dHklMjBwcm9kdWN0fGVufDF8fHx8MTc2NTgyMDkxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Hương biển xanh tươi mát',
  },
  {
    id: 6,
    name: 'Golden Sunset',
    price: '4.800.000₫',
    image: 'https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlfGVufDF8fHx8MTc2NTgyMDkwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Hương amber vàng sang trọng',
  },
];

export function ProductGrid() {
  return (
    <section className="relative py-24 px-6 bg-black">
      {/* Subtle mysterious glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-white text-4xl md:text-5xl mb-4">
            Bộ Sưu Tập
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400"> Cao Cấp</span>
          </h2>
          <p className="text-white/70 text-lg">
            Những mùi hương tinh túy từ khắp nơi trên thế giới
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}