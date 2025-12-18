import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, RefreshCw, Database, Bug } from 'lucide-react';
import { 
  addPerfume, 
  updatePerfume, 
  deletePerfume,
  initializePerfumeData,
  fetchAllRawData,
  clearAllData,
  Perfume 
} from '../utils/perfumeApi';
import { usePerfumes } from '../contexts/PerfumeContext';
import { DatabaseCredentials } from './DatabaseCredentials';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { herPerfumes, himPerfumes, refreshPerfumes } = usePerfumes();
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [activeTab, setActiveTab] = useState<'her' | 'him'>('her');
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showDbCredentials, setShowDbCredentials] = useState(false);
  const [rawData, setRawData] = useState<any>(null);

  const [formData, setFormData] = useState({
    id: 0,
    category: 'her' as 'her' | 'him',
    name: '',
    subtitle: 'Parfum',
    tagline: '',
    description: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    image: '',
  });

  // Initialize database with default data
  const handleInitializeData = async () => {
    if (!confirm('This will add default perfumes to the database. Continue?')) return;
    
    const defaultData: Perfume[] = [
      // ===== FOR HER (10 PERFUMES) =====
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
      // ===== FOR HIM (10 PERFUMES) =====
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

    const success = await initializePerfumeData(defaultData);
    if (success) {
      alert('✅ Database initialized successfully with 20 perfumes (10 For Her + 10 For Him)!');
      refreshPerfumes();
    } else {
      alert('Failed to initialize database. Check console for errors.');
    }
  };

  // Re-initialize database with 20 perfumes
  const handleReInitialize = async () => {
    if (!confirm('⚠️ This will CLEAR ALL existing data and re-initialize with 20 NEW perfumes (10 For Her + 10 For Him). Continue?')) return;
    
    setIsLoading(true);
    
    // Step 1: Clear all existing data
    console.log('Step 1: Clearing all existing data...');
    const clearSuccess = await clearAllData();
    if (!clearSuccess) {
      alert('❌ Failed to clear data. Check console for errors.');
      setIsLoading(false);
      return;
    }
    
    // Step 2: Initialize with 20 new perfumes
    console.log('Step 2: Initializing with 20 new perfumes...');
    await handleInitializeData();
    
    setIsLoading(false);
  };

  // Quick fix: Force re-initialize to fix duplicate images
  const handleQuickFixForHim = async () => {
    if (!confirm('🔥 QUICK FIX: Remove duplicate L\'AVENTURE images and load 10 UNIQUE images for For Him? This will clear and re-initialize ALL perfumes.')) return;
    
    setIsLoading(true);
    
    // Step 1: Clear all existing data
    console.log('🧹 Clearing old data with duplicate images...');
    const clearSuccess = await clearAllData();
    if (!clearSuccess) {
      alert('❌ Failed to clear data. Check console for errors.');
      setIsLoading(false);
      return;
    }
    
    // Step 2: Initialize with 20 new perfumes with unique images
    console.log('✨ Loading 10 UNIQUE images for For Him...');
    await handleInitializeData();
    
    alert('✅ SUCCESS! For Him now has 10 UNIQUE images!\n\n1. NOCTURNE - Black luxury bottle\n2. OCEAN BREEZE - Blue ocean bottle\n3. MIDNIGHT NOIR - Dark mens bottle\n4. IRON WOOD - Wooden bottle\n5. OBSIDIAN BLACK - Obsidian black bottle\n6. ROYAL OUD - Gold oud bottle\n7. SILVER SAGE - Silver grey bottle\n8. AZURE STORM - Blue storm bottle\n9. EMERALD FOREST - Green forest bottle\n10. LEATHER LEGACY - Brown leather bottle');
    
    setIsLoading(false);
    
    // Auto switch to For Him tab to see results
    setActiveTab('him');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPerfume) {
      // Update existing perfume
      const result = await updatePerfume(formData.category, formData.id, formData);
      if (result) {
        alert('Perfume updated successfully!');
        refreshPerfumes();
        resetForm();
      } else {
        alert('Failed to update perfume.');
      }
    } else {
      // Add new perfume
      const result = await addPerfume(formData);
      if (result) {
        alert('Perfume added successfully!');
        refreshPerfumes();
        resetForm();
      } else {
        alert('Failed to add perfume.');
      }
    }
  };

  // Handle delete
  const handleDelete = async (category: 'her' | 'him', id: number) => {
    if (!confirm('Are you sure you want to delete this perfume?')) return;

    const success = await deletePerfume(category, id);
    if (success) {
      alert('Perfume deleted successfully!');
      refreshPerfumes();
    } else {
      alert('Failed to delete perfume.');
    }
  };

  // Handle edit
  const handleEdit = (perfume: Perfume) => {
    setFormData(perfume);
    setEditingPerfume(perfume);
    setShowAddForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: 0,
      category: activeTab,
      name: '',
      subtitle: 'Parfum',
      tagline: '',
      description: '',
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      image: '',
    });
    setEditingPerfume(null);
    setShowAddForm(false);
  };

  // Debug: Fetch all raw data
  const handleFetchRawData = async () => {
    setIsLoading(true);
    const data = await fetchAllRawData();
    setRawData(data);
    setShowDebugPanel(true);
    setIsLoading(false);
  };

  // Debug: Clear all data
  const handleClearAll = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL perfumes from the database. Are you sure?')) return;
    setIsLoading(true);
    const success = await clearAllData();
    if (success) {
      alert('All data cleared successfully!');
      refreshPerfumes();
    } else {
      alert('Failed to clear data.');
    }
    setIsLoading(false);
  };

  const currentPerfumes = activeTab === 'her' ? herPerfumes : himPerfumes;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Starry Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 
              className="text-4xl tracking-[0.3em] mb-2"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              ADMIN PANEL
            </h1>
            <p className="text-white/60 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
              Manage SHINN PERFUME Products
            </p>
          </div>
          <div className="flex gap-4">
            <motion.button
              onClick={handleReInitialize}
              className="flex items-center gap-2 bg-blue-600/20 border border-blue-400 px-6 py-3 rounded-lg hover:bg-blue-600/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <RefreshCw className="w-4 h-4" />
              Re-Initialize Database
            </motion.button>
            <motion.button
              onClick={handleQuickFixForHim}
              className="flex items-center gap-2 bg-red-600/20 border border-red-400 px-6 py-3 rounded-lg hover:bg-red-600/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <Bug className="w-4 h-4" />
              Quick Fix For Him
            </motion.button>
            <motion.button
              onClick={() => setShowDbCredentials(!showDbCredentials)}
              className="flex items-center gap-2 bg-purple-600/20 border border-purple-400 px-6 py-3 rounded-lg hover:bg-purple-600/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              <Database className="w-4 h-4" />
              {showDbCredentials ? 'Hide' : 'Show'} DB INFO
            </motion.button>
            <motion.button
              onClick={onBack}
              className="bg-white/10 border border-white/30 px-6 py-3 rounded-lg hover:bg-white/20 transition-all tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Back to Home
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('her')}
            className={`px-6 py-3 rounded-lg tracking-wider transition-all ${
              activeTab === 'her'
                ? 'bg-pink-600/30 border-2 border-pink-400'
                : 'bg-white/5 border-2 border-white/20 hover:bg-white/10'
            }`}
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            FOR HER ({herPerfumes.length})
          </button>
          <button
            onClick={() => setActiveTab('him')}
            className={`px-6 py-3 rounded-lg tracking-wider transition-all ${
              activeTab === 'him'
                ? 'bg-blue-600/30 border-2 border-blue-400'
                : 'bg-white/5 border-2 border-white/20 hover:bg-white/10'
            }`}
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            FOR HIM ({himPerfumes.length})
          </button>
        </div>

        {/* Add New Button */}
        {!showAddForm && (
          <motion.button
            onClick={() => {
              setFormData({ ...formData, category: activeTab, id: currentPerfumes.length + 1 });
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 bg-green-600/20 border border-green-400 px-6 py-3 rounded-lg hover:bg-green-600/30 transition-all mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            <Plus className="w-5 h-5" />
            Add New Perfume
          </motion.button>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/20 rounded-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                {editingPerfume ? 'Edit Perfume' : 'Add New Perfume'}
              </h2>
              <button onClick={resetForm} className="text-white/60 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  ID (Number)
                </label>
                <input
                  type="number"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as 'her' | 'him' })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                >
                  <option value="her">For Her</option>
                  <option value="him">For Him</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Top Notes
                </label>
                <input
                  type="text"
                  value={formData.topNotes}
                  onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Heart Notes
                </label>
                <input
                  type="text"
                  value={formData.heartNotes}
                  onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Base Notes
                </label>
                <input
                  type="text"
                  value={formData.baseNotes}
                  onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-black/50 border border-white/30 rounded px-4 py-2 focus:outline-none focus:border-white"
                  required
                  placeholder="https://..."
                />
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-green-600/20 border border-green-400 px-6 py-3 rounded-lg hover:bg-green-600/30 transition-all tracking-wider"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  <Save className="w-5 h-5" />
                  {editingPerfume ? 'Update Perfume' : 'Add Perfume'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white/10 border border-white/30 px-6 py-3 rounded-lg hover:bg-white/20 transition-all tracking-wider"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Perfume List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-white/60 tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
              Loading perfumes...
            </p>
          </div>
        ) : currentPerfumes.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/20 rounded-lg">
            <p className="text-white/60 tracking-wider mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              No perfumes found. Click "Initialize Database" to add default products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPerfumes.map((perfume) => (
              <motion.div
                key={`${perfume.category}-${perfume.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/20 rounded-lg overflow-hidden hover:border-white/40 transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                    {perfume.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                    {perfume.subtitle}
                  </p>
                  <p className="text-white/40 text-xs mb-3 line-clamp-2">
                    {perfume.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(perfume)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 border border-blue-400 px-4 py-2 rounded hover:bg-blue-600/30 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(perfume.category, perfume.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 border border-red-400 px-4 py-2 rounded hover:bg-red-600/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating Debug Button */}
        <motion.div
          className="fixed bottom-8 right-8 flex flex-col gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleFetchRawData}
            className="flex items-center gap-2 bg-purple-600/20 border-2 border-purple-400 px-5 py-3 rounded-full hover:bg-purple-600/30 transition-all shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="View Database"
          >
            <Bug className="w-5 h-5" />
            <span style={{ fontFamily: 'Cinzel, serif' }}>DEBUG</span>
          </motion.button>

          <motion.button
            onClick={handleClearAll}
            className="flex items-center gap-2 bg-red-600/20 border-2 border-red-400 px-5 py-3 rounded-full hover:bg-red-600/30 transition-all shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Clear All Data"
          >
            <Trash2 className="w-5 h-5" />
            <span style={{ fontFamily: 'Cinzel, serif' }}>CLEAR ALL</span>
          </motion.button>
        </motion.div>

        {/* Debug Panel Modal */}
        {showDebugPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowDebugPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 border-2 border-purple-400 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl tracking-wider flex items-center gap-3" style={{ fontFamily: 'Cinzel, serif' }}>
                  <Bug className="w-6 h-6 text-purple-400" />
                  DATABASE DEBUG PANEL
                </h2>
                <button
                  onClick={() => setShowDebugPanel(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {rawData ? (
                <div className="space-y-4">
                  <div className="bg-black/50 border border-white/20 rounded p-4">
                    <h3 className="text-lg mb-2 tracking-wider text-purple-400" style={{ fontFamily: 'Cinzel, serif' }}>
                      DATABASE SUMMARY
                    </h3>
                    <p className="text-white/80">Total Records: <span className="text-green-400">{rawData.count}</span></p>
                    <p className="text-white/80">For Her: <span className="text-pink-400">{rawData.data?.her?.length || 0}</span></p>
                    <p className="text-white/80">For Him: <span className="text-blue-400">{rawData.data?.him?.length || 0}</span></p>
                  </div>

                  <div className="bg-black/50 border border-white/20 rounded p-4">
                    <h3 className="text-lg mb-2 tracking-wider text-pink-400" style={{ fontFamily: 'Cinzel, serif' }}>
                      FOR HER DATA
                    </h3>
                    <pre className="text-xs text-white/70 overflow-auto max-h-60 bg-black/30 p-3 rounded">
                      {JSON.stringify(rawData.data?.her || [], null, 2)}
                    </pre>
                  </div>

                  <div className="bg-black/50 border border-white/20 rounded p-4">
                    <h3 className="text-lg mb-2 tracking-wider text-blue-400" style={{ fontFamily: 'Cinzel, serif' }}>
                      FOR HIM DATA
                    </h3>
                    <pre className="text-xs text-white/70 overflow-auto max-h-60 bg-black/30 p-3 rounded">
                      {JSON.stringify(rawData.data?.him || [], null, 2)}
                    </pre>
                  </div>

                  <div className="bg-black/50 border border-white/20 rounded p-4">
                    <h3 className="text-lg mb-2 tracking-wider text-yellow-400" style={{ fontFamily: 'Cinzel, serif' }}>
                      RAW JSON (All Data)
                    </h3>
                    <pre className="text-xs text-white/70 overflow-auto max-h-60 bg-black/30 p-3 rounded">
                      {JSON.stringify(rawData, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p className="text-white/60">Loading database data...</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDebugPanel(false)}
                  className="bg-white/10 border border-white/30 px-6 py-3 rounded-lg hover:bg-white/20 transition-all tracking-wider"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Database Credentials Modal */}
        {showDbCredentials && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setShowDbCredentials(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 border-2 border-purple-400 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl tracking-wider flex items-center gap-3" style={{ fontFamily: 'Cinzel, serif' }}>
                  <Bug className="w-6 h-6 text-purple-400" />
                  DATABASE CREDENTIALS
                </h2>
                <button
                  onClick={() => setShowDbCredentials(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <DatabaseCredentials />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDbCredentials(false)}
                  className="bg-white/10 border border-white/30 px-6 py-3 rounded-lg hover:bg-white/20 transition-all tracking-wider"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}