import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    role: 'Doanh nhân',
    avatar: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTc5NTk1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    review: 'Mùi hương tuyệt vời, lưu hương cả ngày. Chai nước hoa đẹp như một tác phẩm nghệ thuật. Tôi rất hài lòng với sản phẩm!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Trần Đức Minh',
    role: 'Kiến trúc sư',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzc21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTc4ODk1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    review: 'Đây là nước hoa nam tính nhất tôi từng dùng. Hương thơm đẳng cấp, phù hợp cho cả ngày làm việc và dự tiệc tối.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Lê Thu Hà',
    role: 'Blogger thời trang',
    avatar: 'https://images.unsplash.com/photo-1760551937537-a29dbbfab30b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjU3MjczMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    review: 'Luxe Parfum là nơi tôi tìm thấy những mùi hương độc đáo nhất. Chất lượng cao cấp, dịch vụ chuyên nghiệp. Rất đáng để thử!',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-black">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-950/10 to-transparent" />
      
      {/* Mysterious light particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-white text-4xl md:text-5xl mb-4">
            Khách Hàng
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400"> Nói Gì</span>
          </h2>
          <p className="text-white/70 text-lg">
            Những trải nghiệm thực tế từ khách hàng yêu quý
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="relative group"
            >
              <div 
                className="relative bg-gradient-to-br from-gray-900/60 to-black/60 rounded-3xl p-8 backdrop-blur-sm border border-white/10"
                style={{
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(168, 85, 247, 0.1)',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Review */}
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  "{testimonial.review}"
                </p>
                
                {/* Avatar and Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full blur-md opacity-50" />
                    <ImageWithFallback
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="relative w-16 h-16 rounded-full object-cover border-2 border-white/20"
                      style={{
                        boxShadow: '0 8px 24px rgba(251, 191, 36, 0.3)',
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-white">{testimonial.name}</h4>
                    <p className="text-yellow-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* 3D Shadow */}
                <div 
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-transparent blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}