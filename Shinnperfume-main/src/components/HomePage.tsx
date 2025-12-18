import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import forHerImage from 'figma:asset/102b8b40e4737ee23214e3dffb812b7dae2ca12d.png';
import forHimImage from 'figma:asset/8d51994707cf2c60f30ea55cfd37b4806e617a7e.png';

interface HomePageProps {
  onNavigate: (page: 'her' | 'him' | 'about' | 'contact' | 'admin' | 'chattest' | 'n8ntest') => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [hoveredSide, setHoveredSide] = useState<'her' | 'him' | null>(null);
  const [showCenterTextMobile, setShowCenterTextMobile] = useState(true);

  // Auto-hide center text on mobile after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCenterTextMobile(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Secret key combinations to access special pages
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press Ctrl+Shift+A to access Admin Panel
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        onNavigate('admin');
      }
      // Press Ctrl+Shift+C to access Chat Test
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        onNavigate('chattest');
      }
      // Press Ctrl+Shift+N to access N8N Chat Test
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        onNavigate('n8ntest');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onNavigate]);

  return (
    <motion.div 
      className="h-screen flex flex-col md:flex-row overflow-hidden relative bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* SHINN PERFUME - Top Center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-50 text-center"
      >
        <h1 
          className="text-white tracking-[0.3em] md:tracking-[0.5em] border-2 border-white px-3 md:px-6 py-1 md:py-2 text-sm md:text-xl"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          SHINN PERFUME
        </h1>
      </motion.div>

      {/* About Button - Top Left */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => onNavigate('about')}
        className="absolute top-4 md:top-8 left-4 md:left-8 z-50 text-white hover:text-pink-400 transition-colors tracking-wider text-xs md:text-base"
        style={{ fontFamily: 'Cinzel, serif' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        About
      </motion.button>

      {/* Contact Button - Top Right */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => onNavigate('contact')}
        className="absolute top-4 md:top-8 right-4 md:right-8 z-50 text-white hover:text-blue-400 transition-colors tracking-wider text-xs md:text-base"
        style={{ fontFamily: 'Cinzel, serif' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Contact
      </motion.button>

      {/* For Her - Left Side - Slide from bottom */}
      <motion.div
        className="relative group overflow-hidden transition-all duration-700 ease-in-out w-full h-1/2 md:w-auto md:h-full"
        style={{
          width: window.innerWidth >= 768 
            ? (hoveredSide === 'her' ? '66.666%' : hoveredSide === 'him' ? '33.333%' : '50%')
            : '100%',
        }}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
        onMouseEnter={() => setHoveredSide('her')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={forHerImage}
            alt="For Her"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark Overlay - lighter on hover */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-700" />
        </div>

        {/* For Her Text - Bottom Left */}
        <motion.div
          className="absolute left-4 md:left-12 z-10 max-w-[280px] md:max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            bottom: hoveredSide === 'her' ? '3rem' : '1rem',
          }}
          transition={{ delay: 1, duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
          style={{ bottom: hoveredSide === 'her' ? '3rem' : '1rem' }}
        >
          {/* Title - Always visible */}
          <h2 
            className="text-white text-lg md:text-2xl tracking-[0.2em] md:tracking-[0.3em]" 
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            For Her
          </h2>
          
          {/* Description and Button - Show on hover - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: hoveredSide === 'her' ? 1 : 0,
              height: hoveredSide === 'her' ? 'auto' : 0,
            }}
            transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="overflow-hidden hidden md:block"
          >
            <p 
              className="text-white/90 text-base md:text-lg leading-relaxed mb-6 mt-6"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Graceful and captivating, a fragrance designed for who leaves a lasting impression. Floral blooms, soft musk, and radiant fruits evoke elegance, charm, and irresistible beauty.
            </p>

            <button
              className="text-base md:text-lg tracking-wider border-b-2 pb-1 transition-all"
              style={{ 
                fontFamily: 'Cinzel, serif',
                color: '#D4A574',
                borderColor: '#D4A574'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C4956A';
                e.currentTarget.style.borderColor = '#C4956A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D4A574';
                e.currentTarget.style.borderColor = '#D4A574';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('her');
              }}
            >
              EXPLORE FRAGRANCES
            </button>
          </motion.div>

          {/* Mobile button - Always visible */}
          <button
            className="md:hidden mt-3 text-white text-xs tracking-wider border-b border-white/50 hover:border-pink-400 hover:text-pink-400 transition-all pb-1"
            style={{ fontFamily: 'Cinzel, serif' }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('her');
            }}
          >
            EXPLORE
          </button>
        </motion.div>
      </motion.div>

      {/* For Him - Right Side - Slide from top */}
      <motion.div
        className="relative group overflow-hidden transition-all duration-700 ease-in-out w-full h-1/2 md:w-auto md:h-full"
        style={{
          width: window.innerWidth >= 768 
            ? (hoveredSide === 'him' ? '66.666%' : hoveredSide === 'her' ? '33.333%' : '50%')
            : '100%',
        }}
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
        onMouseEnter={() => setHoveredSide('him')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={forHimImage}
            alt="For Him"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark Overlay - lighter on hover */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-700" />
        </div>

        {/* For Him Text - Top Right (mobile) / Bottom Right (desktop) */}
        <motion.div
          className="absolute right-4 md:right-12 z-10 max-w-[280px] md:max-w-md text-right"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
          }}
          transition={{ delay: 1, duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
          style={{ 
            top: window.innerWidth < 768 ? '1rem' : 'auto',
            bottom: window.innerWidth >= 768 ? (hoveredSide === 'him' ? '3rem' : '1rem') : 'auto',
          }}
        >
          {/* Title - Always visible */}
          <h2 
            className="text-white text-lg md:text-2xl tracking-[0.2em] md:tracking-[0.3em]" 
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            For Him
          </h2>
          
          {/* Description and Button - Show on hover - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: hoveredSide === 'him' ? 1 : 0,
              height: hoveredSide === 'him' ? 'auto' : 0,
            }}
            transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="overflow-hidden hidden md:block"
          >
            <p 
              className="text-white/90 text-base md:text-lg leading-relaxed mb-6 mt-6"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Bold yet refined, a fragrance crafted for who commands presence. Deep woods, spices, and leather notes embody strength, confidence, and timeless allure.
            </p>

            <button
              className="text-base md:text-lg tracking-wider border-b-2 pb-1 transition-all"
              style={{ 
                fontFamily: 'Cinzel, serif',
                color: '#D4A574',
                borderColor: '#D4A574'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#C4956A';
                e.currentTarget.style.borderColor = '#C4956A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#D4A574';
                e.currentTarget.style.borderColor = '#D4A574';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('him');
              }}
            >
              EXPLORE FRAGRANCES
            </button>
          </motion.div>

          {/* Mobile button - Always visible */}
          <button
            className="md:hidden mt-3 text-white text-xs tracking-wider border-b border-white/50 hover:border-blue-400 hover:text-blue-400 transition-all pb-1"
            style={{ fontFamily: 'Cinzel, serif' }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('him');
            }}
          >
            EXPLORE
          </button>
        </motion.div>
      </motion.div>

      {/* Center Divider Line - Hidden */}
      {/* <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" /> */}

      {/* Choose Your Fragrance Journey - Bottom Center */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <p
          className="text-white/70 tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm text-center"
          style={{ fontFamily: 'Cinzel, serif', fontWeight: 300 }}
        >
          Choose Your Fragrance Journey
        </p>
      </motion.div>

      {/* INDULGE YOUR SENSES - Center Text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: window.innerWidth >= 768 
            ? (hoveredSide ? 0 : 1)  // Desktop: hide on hover only
            : (showCenterTextMobile ? 1 : 0)  // Mobile: auto-hide after 3s
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          {/* Mobile Layout - 3 lines vertical, centered */}
          <div className="md:hidden flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 12vw, 4rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#D4A574', // Vintage sepia gold
              }}
            >
              Indulge
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 12vw, 4rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#D4A574', // Vintage sepia gold
              }}
            >
              Your
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 12vw, 4rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#D4A574', // Vintage sepia gold
              }}
            >
              Senses
            </motion.div>
          </div>

          {/* Desktop Layout - 2 lines staggered */}
          <div className="hidden md:block">
            {/* INDULGE - Top line, align left */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mb-4"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: 900,
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                letterSpacing: '0.2em',
                textAlign: 'left',
                marginLeft: '-10vw',
                textTransform: 'uppercase',
                color: '#D4A574', // Vintage sepia gold
              }}
            >
              Indulge
            </motion.div>

            {/* YOUR SENSES - Bottom line, align right */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ 
                fontFamily: 'Playfair Display, serif',
                fontWeight: 900,
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                letterSpacing: '0.2em',
                textAlign: 'right',
                marginRight: '-10vw',
                textTransform: 'uppercase',
                color: '#D4A574', // Vintage sepia gold
              }}
            >
              Your Senses
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}