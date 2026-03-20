import { Flame, UtensilsCrossed, Droplets, Tent, Waves, TreePine } from 'lucide-react';

export const GARDEN_FEATURES = [
  {
    id: 'fire_pit',
    label: 'Atmospheric Fire Pit',
    prompt: 'luxury designer fire pit with integrated circular stone seating and warm architectural lighting',
    icon: Flame
  },
  {
    id: 'outdoor_kitchen',
    label: 'Elite Culinary Station',
    prompt: 'state-of-the-art outdoor gourmet kitchen with marble surfaces and premium professional BBQ',
    icon: UtensilsCrossed
  },
  {
    id: 'water_feature',
    label: 'Serene Water Oasis',
    prompt: 'multi-level architectural water feature, koi pond with crystalline water and soft ambient glow',
    icon: Droplets
  },
  {
    id: 'pergola',
    label: 'Architectural Pergola',
    prompt: 'sophisticated minimalist pergola with automated louvers, integrated lighting, and climbing vines',
    icon: Tent
  },
  {
    id: 'swimming_pool',
    label: 'Infinity Pool Sanctuary',
    prompt: 'luxury infinity-edge swimming pool with dark volcanic stone tiles and sunken lounge area',
    icon: Waves
  },
  {
    id: 'sitting_area',
    label: 'Lounge Sanctuary',
    prompt: 'high-end boutique lounge furniture with designer textiles and integrated landscape lighting',
    icon: TreePine
  }
];
