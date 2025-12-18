import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchPerfumesByCategory, initializePerfumeData, Perfume } from '../utils/perfumeApi';

// Force refresh timestamp: 2024-12-18T10:30:00 - Fixed For Him duplicate images with 10 UNIQUE Unsplash images

interface PerfumeContextType {
  herPerfumes: Perfume[];
  himPerfumes: Perfume[];
  isLoading: boolean;
  isInitialized: boolean;
  refreshPerfumes: () => Promise<void>;
}

const PerfumeContext = createContext<PerfumeContextType | undefined>(undefined);

// Default perfumes for immediate display
const defaultHerPerfumes: Perfume[] = [
  {
    id: 1, category: 'her', name: 'ROSE ÉLÉGANCE', subtitle: 'Parfum',
    tagline: 'WHERE ELEGANCE BLOOMS',
    description: 'For the woman who embraces grace, Rose Élégance is a statement of timeless beauty and sophistication. A perfect blend of Bulgarian rose, vanilla, and white musk captures the essence, like a garden in eternal bloom.',
    topNotes: 'Bulgarian Rose, Pink Pepper', heartNotes: 'Madagascar Vanilla, Jasmine', baseNotes: 'White Musk, Sandalwood',
    image: 'https://images.unsplash.com/photo-1760113559708-84e7a148ec68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZWxlZ2FudHxlbnwxfHx8fDE3NjU4NzE1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2, category: 'her', name: 'VELVET BLOSSOM', subtitle: 'Parfum',
    tagline: 'WHERE LUXURY UNFOLDS',
    description: 'An enchanting masterpiece that harmonizes the exotic richness of Indian jasmine with the sweet luminosity of Tunisian orange blossom. A luxurious scent that lingers beautifully, like velvet against the skin.',
    topNotes: 'Orange Blossom, Bergamot', heartNotes: 'Indian Jasmine, Tuberose', baseNotes: 'Sandalwood, Amber',
    image: 'https://images.unsplash.com/photo-1759794108525-94ff060da692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZnJhZ3JhbmNlJTIwYm90dGxlJTIwZGFya3xlbnwxfHx8fDE3NjU4NzY3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3, category: 'her', name: 'MOONLIGHT DREAM', subtitle: 'Parfum',
    tagline: 'WHERE DREAMS AWAKEN',
    description: 'Inspired by the magic of moonlit nights, this fragrance combines gentle evening jasmine with warm woody notes and sweet vanilla, creating an ethereal experience that evokes dreams under starlight.',
    topNotes: 'Night Jasmine, Lemon', heartNotes: 'Tahitian Vanilla, Iris', baseNotes: 'Cedar Wood, Tonka Bean',
    image: 'https://images.unsplash.com/photo-1761778304143-4c89e7dd2457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHBlcmZ1bWUlMjBib3R0bGUlMjBzb3BoaXN0aWNhdGVkfGVufDF8fHx8MTc2NTg3Njc2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4, category: 'her', name: 'CHERRY BLOSSOM', subtitle: 'Parfum',
    tagline: 'WHERE SPRING AWAKENS',
    description: 'A delicate fusion of Japanese cherry blossom and peony, enhanced with soft almond and warm amber. This enchanting fragrance captures the fleeting beauty of spring gardens in full bloom.',
    topNotes: 'Cherry Blossom, Peach', heartNotes: 'Peony, Almond', baseNotes: 'Amber, White Musk',
    image: 'https://images.unsplash.com/photo-1630573133526-8d090e0269af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwcGlua3xlbnwxfHx8fDE3NjYwNjE0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 5, category: 'her', name: 'GOLDEN IRIS', subtitle: 'Parfum',
    tagline: 'WHERE RADIANCE SHINES',
    description: 'A sophisticated blend of powdery iris and golden honey, layered with creamy sandalwood and soft cashmere. This luminous fragrance embodies timeless elegance and refined femininity.',
    topNotes: 'Iris, Honey', heartNotes: 'Cashmere Wood, Violet', baseNotes: 'Sandalwood, Vanilla',
    image: 'https://images.unsplash.com/photo-1758225502621-9102d2856dc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGZyYWdyYW5jZSUyMGJvdHRsZSUyMGdvbGR8ZW58MXx8fHwxNzY2MDgyODUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 6, category: 'her', name: 'CRYSTAL GARDENIA', subtitle: 'Parfum',
    tagline: 'WHERE PURITY BLOOMS',
    description: 'An exquisite composition of creamy gardenia and delicate tuberose, illuminated by crystalline citrus and soft musk. This pure fragrance evokes the elegance of white flowers in a moonlit garden.',
    topNotes: 'Gardenia, Citrus', heartNotes: 'Tuberose, Lily', baseNotes: 'White Musk, Cedarwood',
    image: 'https://images.unsplash.com/photo-1757313192889-6d25a0e30f6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwcGVyZnVtZSUyMGJvdHRsZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzY2MDgyODUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 7, category: 'her', name: 'PURPLE ORCHID', subtitle: 'Parfum',
    tagline: 'WHERE MYSTERY BLOOMS',
    description: 'A mysterious blend of exotic purple orchid and black currant, deepened with patchouli and dark chocolate. This seductive fragrance is for the woman who embraces her enigmatic allure.',
    topNotes: 'Purple Orchid, Black Currant', heartNotes: 'Dark Chocolate, Rose', baseNotes: 'Patchouli, Musk',
    image: 'https://images.unsplash.com/photo-1763789703625-6a08598d0a13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmcmFncmFuY2UlMjBib3R0bGUlMjBwdXJwbGV8ZW58MXx8fHwxNzY2MDgyODU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 8, category: 'her', name: 'DIAMOND DUST', subtitle: 'Parfum',
    tagline: 'WHERE BRILLIANCE SPARKLES',
    description: 'A sparkling composition of champagne accord and crystal peony, enhanced with icy mint and shimmering musk. This effervescent fragrance captures the brilliance of diamonds under candlelight.',
    topNotes: 'Champagne, Mint', heartNotes: 'Crystal Peony, Freesia', baseNotes: 'Shimmering Musk, Amber',
    image: 'https://images.unsplash.com/photo-1650112511613-ff877a435291?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHBlcmZ1bWUlMjBib3R0bGUlMjBjcnlzdGFsfGVufDF8fHx8MTc2NjA4Mjg1NHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 9, category: 'her', name: 'AMBER SUNSET', subtitle: 'Parfum',
    tagline: 'WHERE WARMTH EMBRACES',
    description: 'A warm and sensual blend of golden amber and sweet honeysuckle, layered with rich benzoin and creamy tonka. This comforting fragrance evokes the golden glow of sunset by the Mediterranean.',
    topNotes: 'Honeysuckle, Mandarin', heartNotes: 'Golden Amber, Magnolia', baseNotes: 'Benzoin, Tonka Bean',
    image: 'https://images.unsplash.com/photo-1759848547378-d59542dcb935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwYW1iZXJ8ZW58MXx8fHwxNzY2MDgyODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 10, category: 'her', name: 'SILK MAGNOLIA', subtitle: 'Parfum',
    tagline: 'WHERE SOFTNESS BLOOMS',
    description: 'An elegant composition of creamy magnolia and white tea, softened with silky sandalwood and gentle vanilla. This refined fragrance embodies the grace and softness of pure silk.',
    topNotes: 'White Tea, Magnolia', heartNotes: 'Silk Accord, Jasmine', baseNotes: 'Sandalwood, Vanilla',
    image: 'https://images.unsplash.com/photo-1760860992203-85ca32536788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGZyYWdyYW5jZSUyMGJvdHRsZSUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzY2MDgyODU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const defaultHimPerfumes: Perfume[] = [
  {
    id: 1, category: 'him', name: 'NOCTURNE', subtitle: 'Parfum',
    tagline: 'WHERE SHADOWS WHISPER',
    description: 'For the man who embraces the night, Nocturne is a statement of power and intrigue. A rare blend of oud, saffron, and leather ignites the senses, like autumn\'s lingering twilight.',
    topNotes: 'Blackcurrant, Cardamom', heartNotes: 'Smoked Leather, Saffron', baseNotes: 'Oud, Dark Patchouli',
    image: 'https://images.unsplash.com/photo-1759793500110-e3cb1f0fe6ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGx1eHVyeSUyMG1lbnMlMjBjb2xvZ25lfGVufDF8fHx8MTc2NjA4NTA4NHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 2, category: 'him', name: 'OCEAN BREEZE', subtitle: 'Parfum',
    tagline: 'WHERE FREEDOM CALLS',
    description: 'Fresh oceanic notes harmonized with Italian bergamot and robust cedar wood. This invigorating fragrance evokes the freedom of open waters and the strength of the sea.',
    topNotes: 'Italian Bergamot, Sea Salt', heartNotes: 'Marine Notes, Lavender', baseNotes: 'Cedar Wood, Oakmoss',
    image: 'https://images.unsplash.com/photo-1643139010926-1dbb28e335c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwb2NlYW4lMjBwZXJmdW1lJTIwYm90dGxlfGVufDF8fHx8MTc2NTk4NjU5OXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 3, category: 'him', name: 'MIDNIGHT NOIR', subtitle: 'Parfum',
    tagline: 'WHERE MYSTERY UNFOLDS',
    description: 'A luxurious blend of aromatic lavender, creamy sandalwood, and black vanilla. Seductive and mysterious for the modern gentleman who embraces the night.',
    topNotes: 'Lavender, Star Anise', heartNotes: 'Sandalwood, Sage', baseNotes: 'Black Vanilla, Tonka Bean',
    image: 'https://images.unsplash.com/photo-1630512873749-85ccf5bb1678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbm9pciUyMGZyYWdyYW5jZSUyMGJvdHRlZXxlbnwxfHx8fDE3NjYwODUwODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 4, category: 'him', name: 'IRON WOOD', subtitle: 'Parfum',
    tagline: 'WHERE STRENGTH ENDURES',
    description: 'A powerful blend of aged wood and iron accord, deepened with tobacco leaf and dark amber. This bold fragrance embodies resilience and unwavering confidence.',
    topNotes: 'Iron Accord, Tobacco Leaf', heartNotes: 'Aged Wood, Vetiver', baseNotes: 'Dark Amber, Musk',
    image: 'https://images.unsplash.com/photo-1762868700041-2b9c3a0c39f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjb2xvZ25lJTIwYm90dGxlfGVufDF8fHx8MTc2NjA4NTA4NXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 5, category: 'him', name: 'OBSIDIAN BLACK', subtitle: 'Parfum',
    tagline: 'WHERE DARKNESS REIGNS',
    description: 'An intense composition of black pepper and oud, layered with volcanic minerals and charred wood. This commanding fragrance is for the man who owns the night.',
    topNotes: 'Black Pepper, Volcanic Mineral', heartNotes: 'Oud, Charred Wood', baseNotes: 'Black Leather, Incense',
    image: 'https://images.unsplash.com/photo-1600612156191-12fedf6117f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvYnNpZGlhbiUyMGJsYWNrJTIwcGVyZnVtZXxlbnwxfHx8fDE3NjYwODUwODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 6, category: 'him', name: 'ROYAL OUD', subtitle: 'Parfum',
    tagline: 'WHERE ROYALTY COMMANDS',
    description: 'A regal blend of precious oud and golden saffron, enhanced with royal incense and amber resin. This majestic fragrance embodies power, wealth, and timeless nobility.',
    topNotes: 'Golden Saffron, Rose', heartNotes: 'Precious Oud, Incense', baseNotes: 'Amber Resin, Agarwood',
    image: 'https://images.unsplash.com/photo-1636730520710-a8e432ab3617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwb3VkJTIwcGVyZnVtZXxlbnwxfHx8fDE3NjYwODUwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 7, category: 'him', name: 'SILVER SAGE', subtitle: 'Parfum',
    tagline: 'WHERE WISDOM SPEAKS',
    description: 'A refined blend of silver sage and cool cypress, layered with crisp bergamot and white cedarwood. This sophisticated fragrance embodies clarity, wisdom, and modern elegance.',
    topNotes: 'Silver Sage, Bergamot', heartNotes: 'Cypress, White Cedar', baseNotes: 'Cedarwood, Grey Musk',
    image: 'https://images.unsplash.com/photo-1758871992965-836e1fb0f9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbWVucyUyMGNvbG9nbmUlMjBib3R0bGV8ZW58MXx8fHwxNzY2MDg1MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 8, category: 'him', name: 'AZURE STORM', subtitle: 'Parfum',
    tagline: 'WHERE ADVENTURE AWAITS',
    description: 'An electrifying fusion of stormy ozone and blue lavender, charged with lightning accord and sea minerals. This dynamic fragrance captures the thrill of tempestuous skies.',
    topNotes: 'Stormy Ozone, Lightning Accord', heartNotes: 'Blue Lavender, Sea Minerals', baseNotes: 'Driftwood, Ambergris',
    image: 'https://images.unsplash.com/photo-1732828912093-a776288edfed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwc3Rvcm0lMjBmcmFncmFuY2V8ZW58MXx8fHwxNjYwODUwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 9, category: 'him', name: 'EMERALD FOREST', subtitle: 'Parfum',
    tagline: 'WHERE NATURE CALLS',
    description: 'A deep green composition of pine needle and forest moss, grounded with earthy vetiver and green oakmoss. This natural fragrance evokes the primeval strength of ancient woodlands.',
    topNotes: 'Pine Needle, Green Leaves', heartNotes: 'Forest Moss, Vetiver', baseNotes: 'Green Oakmoss, Patchouli',
    image: 'https://images.unsplash.com/photo-1709644156704-38224e02c505?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZvcmVzdCUyMGNvbG9nbmV8ZW58MXx8fHwxNzY2MDg1MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: 10, category: 'him', name: 'LEATHER LEGACY', subtitle: 'Parfum',
    tagline: 'WHERE TRADITION LIVES',
    description: 'A timeless blend of vintage leather and fine bourbon, enriched with dark tobacco and aged oak. This classic fragrance honors heritage, craftsmanship, and masculine elegance.',
    topNotes: 'Vintage Leather, Bourbon', heartNotes: 'Dark Tobacco, Cinnamon', baseNotes: 'Aged Oak, Suede',
    image: 'https://images.unsplash.com/photo-1671161238404-e5b4845260b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm93biUyMGxlYXRoZXIlMjBwZXJmdW1lfGVufDF8fHx8MTc2NjA4NTA4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function PerfumeProvider({ children }: { children: ReactNode }) {
  const [herPerfumes, setHerPerfumes] = useState<Perfume[]>(defaultHerPerfumes);
  const [himPerfumes, setHimPerfumes] = useState<Perfume[]>(defaultHimPerfumes);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load perfumes in background on mount
  useEffect(() => {
    const loadAllPerfumes = async () => {
      // Don't block UI - load in background
      const [herData, himData] = await Promise.all([
        fetchPerfumesByCategory('her'),
        fetchPerfumesByCategory('him'),
      ]);

      // If database is empty, initialize it
      if (herData.length === 0 && himData.length === 0) {
        console.log('Initializing database with default perfumes...');
        const allDefaults = [...defaultHerPerfumes, ...defaultHimPerfumes];
        await initializePerfumeData(allDefaults);
        
        // Fetch again after initialization
        const [newHerData, newHimData] = await Promise.all([
          fetchPerfumesByCategory('her'),
          fetchPerfumesByCategory('him'),
        ]);
        
        if (newHerData.length > 0) setHerPerfumes(newHerData);
        if (newHimData.length > 0) setHimPerfumes(newHimData);
      } else {
        // Update with database data
        if (herData.length > 0) setHerPerfumes(herData);
        if (himData.length > 0) setHimPerfumes(himData);
      }

      setIsInitialized(true);
    };

    loadAllPerfumes();
  }, []);

  // Refresh function for Admin Panel
  const refreshPerfumes = async () => {
    setIsLoading(true);
    const [herData, himData] = await Promise.all([
      fetchPerfumesByCategory('her'),
      fetchPerfumesByCategory('him'),
    ]);
    
    if (herData.length > 0) setHerPerfumes(herData);
    if (himData.length > 0) setHimPerfumes(himData);
    setIsLoading(false);
  };

  return (
    <PerfumeContext.Provider 
      value={{ 
        herPerfumes, 
        himPerfumes, 
        isLoading, 
        isInitialized,
        refreshPerfumes 
      }}
    >
      {children}
    </PerfumeContext.Provider>
  );
}

export function usePerfumes() {
  const context = useContext(PerfumeContext);
  if (context === undefined) {
    throw new Error('usePerfumes must be used within a PerfumeProvider');
  }
  return context;
}

// Force reload timestamp: 2024-12-18T10:30:00