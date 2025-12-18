import { motion } from 'motion/react';
import { ShoppingBag, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className="group relative"
    >
      <div className="relative bg-gradient-to-br from-gray-900/60 to-black/60 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10"
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.15)',
          transform: 'translateZ(0)',
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Like Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            />
          </motion.button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-yellow-400 text-sm tracking-wider mb-2">
            {product.description}
          </p>
          <h3 className="text-white text-2xl mb-2">
            {product.name}
          </h3>
          <p className="text-white/80 text-xl mb-4">
            {product.price}
          </p>
          
          <motion.button
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 10px 30px rgba(251, 191, 36, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Mua ngay</span>
          </motion.button>
        </div>
        
        {/* 3D Shadow Effect */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-yellow-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: 'translateX(-50%) translateZ(-10px)' }}
        />
      </div>
    </motion.div>
  );
}