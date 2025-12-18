import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { usePerfumes } from '../contexts/PerfumeContext';
import { CustomChatWidget } from './CustomChatWidget';

// Updated: 2024-12-18

interface ForHerPageProps {
  onBack: () => void;
}

export function ForHerPage({ onBack }: ForHerPageProps) {
  const { herPerfumes } = usePerfumes();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50;
    const isSwipeDown = distance < -50;

    if (isSwipeUp) {
      goToNext();
    }
    if (isSwipeDown) {
      handlePrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.trim() !== '');
  };

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : herPerfumes.filter((perfume) =>
        perfume.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelectPerfume = (index: number) => {
    const actualIndex = herPerfumes.findIndex(p => p.id === searchResults[index].id);
    if (actualIndex > currentIndex) {
      setDirection('down');
    } else if (actualIndex < currentIndex) {
      setDirection('up');
    }
    setCurrentIndex(actualIndex);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const goToNext = () => {
    setDirection('down');
    setCurrentIndex((prev) => (prev + 1) % herPerfumes.length);
  };

  const handlePrevious = () => {
    setDirection('up');
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : herPerfumes.length - 1));
  };

  const currentPerfume = herPerfumes[currentIndex];

  // Show loading state
  if (!herPerfumes) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400 mb-4"></div>
          <p className="text-white/60 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
            Loading fragrances...
          </p>
        </div>
      </div>
    );
  }

  // Show error if no perfumes found
  if (!currentPerfume || herPerfumes.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 tracking-wider mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            No perfumes available. Please initialize the database.
          </p>
          <button
            onClick={onBack}
            className="text-white border border-white px-6 py-3 hover:bg-white hover:text-black transition-all tracking-wider"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-black relative overflow-hidden"
      initial={{ opacity: 0, x: '-100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ 
        duration: 0.8, 
        ease: [0.6, 0.05, 0.01, 0.9]
      }}
    >
      {/* Main Content */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentPerfume.id}
          initial={{ y: direction === 'down' ? '100%' : '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: direction === 'down' ? '-100%' : '100%' }}
          transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="absolute inset-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Full Screen Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={currentPerfume.image}
              alt={currentPerfume.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Top Navigation Bar */}
            <div className="px-4 md:px-12 py-4 md:py-8">
              {/* Mobile Layout */}
              <div className="md:hidden space-y-3">
                {/* Top Row: Home button (left) + Logo (right) */}
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={onBack}
                    className="text-white/80 hover:text-pink-400 transition-colors tracking-[0.2em] text-xs uppercase"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    Home
                  </motion.button>

                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-white tracking-[0.3em] border border-white px-3 py-1 text-[0.65rem]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    SHINN PERFUME
                  </motion.h1>
                </div>

                {/* Search Bar - Centered below */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative mx-auto max-w-xs"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search perfumes..."
                    className="w-full bg-black/30 backdrop-blur-sm text-white pl-10 pr-4 py-2 border border-white/30 rounded-full focus:outline-none focus:border-pink-400 focus:bg-black/50 transition-all duration-300 placeholder:text-white/40"
                    style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.1em' }}
                  />
                  
                  {/* Search Results Dropdown */}
                  <AnimatePresence>
                    {showSearchResults && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 right-0 bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden max-h-64 overflow-y-auto"
                      >
                        {searchResults.map((perfume, index) => (
                          <button
                            key={perfume.id}
                            onClick={() => handleSelectPerfume(index)}
                            className="w-full px-4 py-3 text-left hover:bg-pink-500/20 transition-colors border-b border-white/10 last:border-b-0"
                          >
                            <p className="text-white text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                              {perfume.name}
                            </p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex items-center justify-between">
                <motion.button
                  onClick={onBack}
                  className="text-white/80 hover:text-pink-400 transition-colors tracking-[0.3em] text-sm uppercase"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Home
                </motion.button>

                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white tracking-[0.5em] border-2 border-white px-6 py-2"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  SHINN PERFUME
                </motion.h1>

                {/* Search Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search perfumes..."
                    className="bg-black/30 backdrop-blur-sm text-white pl-10 pr-4 py-2 border border-white/30 rounded-full focus:outline-none focus:border-pink-400 focus:bg-black/50 transition-all duration-300 placeholder:text-white/40 w-56"
                    style={{ fontFamily: 'Cinzel, serif', fontSize: '0.75rem', letterSpacing: '0.1em' }}
                  />
                  
                  {/* Search Results Dropdown - Right below search bar */}
                  {showSearchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full mt-2 right-0 bg-black/95 backdrop-blur-xl border border-white/30 rounded-lg overflow-hidden w-80 shadow-2xl z-50"
                    >
                      {searchResults.length > 0 ? (
                        <div className="max-h-[500px] overflow-y-auto">
                          {searchResults.map((perfume, index) => (
                            <motion.button
                              key={perfume.id}
                              onClick={() => handleSelectPerfume(index)}
                              className="w-full flex items-center gap-4 p-4 hover:bg-pink-500/20 transition-all duration-300 border-b border-white/10 last:border-b-0"
                              whileHover={{ x: 5 }}
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={perfume.image}
                                  alt={perfume.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 text-left">
                                <h3
                                  className="text-white tracking-wider text-sm mb-1"
                                  style={{ fontFamily: 'Cinzel, serif' }}
                                >
                                  {perfume.name}
                                </h3>
                                <p
                                  className="text-white/50 text-xs tracking-wide"
                                  style={{ fontFamily: 'Cinzel, serif' }}
                                >
                                  {perfume.subtitle}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p
                            className="text-white/50 tracking-wide text-sm"
                            style={{ fontFamily: 'Cinzel, serif' }}
                          >
                            No perfumes found
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>

                <div className="text-white/40 tracking-[0.3em] text-sm uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                  For Her
                </div>
              </div>
            </div>

            {/* Middle Section - Spacer */}
            <div className="flex-1"></div>

            {/* Bottom Section - 3 Columns */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-4 md:px-12 pb-6 md:pb-8"
            >
              {/* Product Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-3 md:mb-4"
              >
                <h2 
                  className="text-white tracking-wider mb-1"
                  style={{ 
                    fontFamily: 'Cinzel, serif',
                    fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                    lineHeight: 1.1,
                  }}
                >
                  {currentPerfume.name}
                </h2>
                <p 
                  className="text-white/60 tracking-widest text-xs md:text-sm"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {currentPerfume.subtitle}
                </p>
              </motion.div>

              {/* 3 Columns Grid - Desktop only / Mobile stacked */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {/* Left Column - Tagline + Description (hide description on mobile) */}
                <div className="border-t border-white/30 pt-3 md:pt-4">
                  <h3 
                    className="text-white tracking-[0.2em] mb-2 md:mb-3 uppercase text-xs md:text-sm"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {currentPerfume.tagline}
                  </h3>
                  <p className="hidden md:block text-white/70 leading-relaxed text-sm">
                    {currentPerfume.description}
                  </p>
                </div>

                {/* Middle Column - Notes */}
                <div className="border-t border-white/30 pt-3 md:pt-4">
                  <h3 
                    className="text-white tracking-[0.2em] mb-2 md:mb-3 uppercase text-xs md:text-sm"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    Notes
                  </h3>
                  <div className="space-y-1 md:space-y-2">
                    <div>
                      <p 
                        className="text-pink-300 text-[0.65rem] md:text-xs mb-0.5 md:mb-1 tracking-wider uppercase"
                        style={{ fontFamily: 'Cinzel, serif' }}
                      >
                        Top
                      </p>
                      <p className="text-white/70 text-xs md:text-sm">{currentPerfume.topNotes}</p>
                    </div>
                    <div>
                      <p 
                        className="text-pink-300 text-[0.65rem] md:text-xs mb-0.5 md:mb-1 tracking-wider uppercase"
                        style={{ fontFamily: 'Cinzel, serif' }}
                      >
                        Heart
                      </p>
                      <p className="text-white/70 text-xs md:text-sm">{currentPerfume.heartNotes}</p>
                    </div>
                    <div>
                      <p 
                        className="text-pink-300 text-[0.65rem] md:text-xs mb-0.5 md:mb-1 tracking-wider uppercase"
                        style={{ fontFamily: 'Cinzel, serif' }}
                      >
                        Base
                      </p>
                      <p className="text-white/70 text-xs md:text-sm">{currentPerfume.baseNotes}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Buy Button */}
                <div className="border-t border-white/30 pt-3 md:pt-4 flex items-start justify-center md:justify-center">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-white/50 text-white px-4 md:px-8 py-2 md:py-3 tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all duration-300 text-xs md:text-sm"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    Buy {currentPerfume.name.split(' ')[0]}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Desktop Only */}
      <div className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
        <motion.button
          onClick={handlePrevious}
          className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-pink-500/30 border border-white/20 transition-all duration-300"
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={goToNext}
          className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-pink-500/30 border border-white/20 transition-all duration-300"
          whileHover={{ scale: 1.1, y: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </div>

      {/* ChatBot */}
      <CustomChatWidget />
    </motion.div>
  );
}