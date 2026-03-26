export const GARDEN_FEATURES = [
  // ── Social Vibes ────────────────────────────────────────────
  {
    id: 'fire_lounge',
    label: 'Fire Lounge',
    description: 'A warm social spot for evening gatherings',
    tag: 'Social',
    category: 'social',
    image: '/garden-enhancements/fire-lounge.png',
    prompt: 'luxury designer circular stone fire pit with tall dancing flames, premium teak chairs arranged in a warm circle, string lights overhead, warm amber evening glow'
  },
  {
    id: 'outdoor_kitchen',
    label: 'Outdoor Kitchen',
    description: 'Cook and entertain under the open sky',
    tag: 'Social',
    category: 'social',
    image: '/garden-enhancements/outdoor-kitchen.png',
    prompt: 'premium outdoor kitchen station with built-in stainless steel BBQ grill, stone countertop, bar stools, outdoor refrigerator, herb garden, warm evening lighting'
  },

  // ── Relax & Wellness ────────────────────────────────────────
  {
    id: 'water_retreat',
    label: 'Water Retreat',
    description: 'Bring calmness with flowing water and reflections',
    tag: 'Relax',
    category: 'relax',
    image: '/garden-enhancements/water-retreat.png',
    prompt: 'multi-tiered natural stone water fountain, gentle cascading water, surrounding plants and pebbles, soft ambient LED lighting in water, twilight reflection, peaceful atmosphere'
  },
  {
    id: 'lounge_corner',
    label: 'Lounge Corner',
    description: 'A cozy space to relax and unwind outdoors',
    tag: 'Relax',
    category: 'relax',
    image: '/garden-enhancements/lounge-corner.png',
    prompt: 'cozy outdoor sectional sofa with plush neutral cushions, low wooden coffee table, warm fairy string lights, potted palms and lanterns, soft ambient evening glow'
  },

  // ── Premium Upgrade ─────────────────────────────────────────
  {
    id: 'infinity_pool',
    label: 'Infinity Edge Pool',
    description: 'Dive into luxury with a stunning infinity view',
    tag: 'Premium',
    category: 'premium',
    image: '/garden-enhancements/infinity-pool.png',
    prompt: 'luxury infinity-edge swimming pool at golden hour, dark volcanic stone tiles, white sun loungers, tropical plants, resort-style backyard, warm sunset reflection on water'
  },
  {
    id: 'designer_pergola',
    label: 'Designer Pergola',
    description: 'Frame your garden with elegant shade and style',
    tag: 'Premium',
    category: 'premium',
    image: '/garden-enhancements/designer-pergola.png',
    prompt: 'elegant white aluminum pergola with louvered roof, wisteria and climbing roses cascading down, outdoor sofa underneath, bistro lights, warm evening sun rays through louvers'
  },
];

export const GARDEN_CATEGORIES = [
  { id: 'social',  label: 'Social Vibes',       emoji: '🔥' },
  { id: 'relax',   label: 'Relax & Wellness',    emoji: '💧' },
  { id: 'premium', label: 'Premium Upgrade',     emoji: '✨' },
];

// Recommended features per garden style
export const STYLE_RECOMMENDATIONS: Record<string, string[]> = {
  calm_retreat:     ['water_retreat', 'lounge_corner'],
  social_backyard:  ['fire_lounge', 'outdoor_kitchen'],
  resort_escape:    ['infinity_pool', 'lounge_corner'],
  zen_balance:      ['water_retreat', 'designer_pergola'],
  romantic_garden:  ['designer_pergola', 'lounge_corner'],
  cozy_corner:      ['fire_lounge', 'lounge_corner'],
  luxury_courtyard: ['infinity_pool', 'outdoor_kitchen'],
  natural_wild:     ['water_retreat', 'designer_pergola'],
};
