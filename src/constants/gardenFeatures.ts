import { Flame, UtensilsCrossed, Droplets, Tent, Waves, TreePine } from 'lucide-react';

export const GARDEN_FEATURES = [
  {
    id: 'fire_pit',
    label: 'Fire Pit / Fireplace',
    prompt: 'modern fire pit with seating area',
    icon: Flame
  },
  {
    id: 'outdoor_kitchen',
    label: 'Outdoor Kitchen / BBQ',
    prompt: 'luxury outdoor kitchen and barbecue station',
    icon: UtensilsCrossed
  },
  {
    id: 'water_feature',
    label: 'Pond / Waterfall',
    prompt: 'serene koi pond with waterfall feature',
    icon: Droplets
  },
  {
    id: 'pergola',
    label: 'Pergola / Gazebo',
    prompt: 'wooden pergola with climbing plants and seating',
    icon: Tent
  },
  {
    id: 'swimming_pool',
    label: 'Swimming Pool',
    prompt: 'infinity swimming pool with turquoise water',
    icon: Waves
  },
  {
    id: 'sitting_area',
    label: 'Lounge / Sitting Area',
    prompt: 'comfortable outdoor lounge furniture',
    icon: TreePine
  }
];
