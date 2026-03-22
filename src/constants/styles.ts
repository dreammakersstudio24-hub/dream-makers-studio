// DREAM MAKERS STUDIO — Interior Style System
// Each style is an AI Control Preset with specific prompt and negative prompt

export interface StylePreset {
  id: string;
  nameKey: string;
  descKey: string;
  image: string;
  tier: "core" | "architectural" | "atmosphere";
  recommended?: boolean;
  prompt_addon: string;
  negative_prompt: string;
}

export const STYLES: StylePreset[] = [
  // ─── CORE (Brand Signature) ───────────────────────────────
  {
    id: "modern_minimal",
    nameKey: "Modern Minimal",
    descKey: "Clean, neutral, architectural",
    image: "/styles/modern_minimal.jpg",
    tier: "core",
    recommended: true,
    prompt_addon: "ultra-clean architectural interiors, neutral monochrome palette, polished concrete or light stone floors, hidden storage, vast negative space, geometric precision, no visual clutter, soft diffused lighting",
    negative_prompt: "clutter, excessive decoration, too many objects, busy patterns, dark rooms, colorful accessories",
  },
  {
    id: "japandi",
    nameKey: "Japandi",
    descKey: "Warm wood, calm, balanced",
    image: "/styles/japandi.jpg",
    tier: "core",
    recommended: true,
    prompt_addon: "fusion of japanese minimalism and scandinavian functionality, warm natural wood tones, linen and organic textiles, wabi-sabi imperfection, low-profile furniture, muted earthy palette, indoor plants, serene balanced atmosphere",
    negative_prompt: "clutter, bright saturated colors, excessive decor, cold steel surfaces, maximalist styling",
  },
  {
    id: "scandinavian",
    nameKey: "Scandinavian",
    descKey: "Bright, soft, functional",
    image: "/styles/scandinavian.jpg",
    tier: "core",
    prompt_addon: "nordic hygge interior, light oak wood floors, white walls, cozy layered textiles, soft natural light from large windows, functional minimalist layout, indoor plants, clean airy feel",
    negative_prompt: "dark rooms, heavy furniture, ornate decoration, bright colors, clutter",
  },
  {
    id: "contemporary_calm",
    nameKey: "Contemporary Calm",
    descKey: "Soft contrast, modern, relaxed",
    image: "/styles/contemporary_calm.jpg",
    tier: "core",
    prompt_addon: "contemporary relaxed interior, warm gray and sand tones, plush upholstered furniture, soft ambient lighting, subtle textures, modern clean lines, inviting serene atmosphere",
    negative_prompt: "harsh contrast, cold blue tones, cluttered surfaces, traditional ornate details",
  },

  // ─── ARCHITECTURAL (Professional Use) ────────────────────
  {
    id: "modern_luxury",
    nameKey: "Modern Luxury",
    descKey: "High-end, elegant, refined",
    image: "/styles/modern_luxury.jpg",
    tier: "architectural",
    prompt_addon: "ultra-luxury modern interior, onyx marble and stone surfaces, gold and brass accents, opulent velvet upholstery, crystal chandelier, floor-to-ceiling windows, deep jewel-tone colors, bespoke custom millwork, elite lifestyle",
    negative_prompt: "cheap materials, plastic, simple furniture, cluttered, casual style, bohemian",
  },
  {
    id: "industrial_loft",
    nameKey: "Industrial Loft",
    descKey: "Raw texture, concrete, metal",
    image: "/styles/industrial_loft.jpg",
    tier: "architectural",
    prompt_addon: "industrial loft interior, exposed red brick walls, high ceilings with raw metal beams, large steel factory windows, polished concrete floors, Edison bulb pendants, dark iron and reclaimed wood accents, urban artistic atmosphere",
    negative_prompt: "soft colors, floral patterns, traditional furniture, suburban aesthetic, white polished surfaces",
  },
  {
    id: "tropical_modern",
    nameKey: "Tropical Modern",
    descKey: "Indoor-outdoor, natural, airy",
    image: "/styles/tropical_modern.jpg",
    tier: "architectural",
    prompt_addon: "tropical modern resort interior, open concept indoor-outdoor flow, lush tropical plants and greenery, natural rattan and bamboo materials, white or light walls, warm sunlight, breezy open atmosphere, palm leaves",
    negative_prompt: "enclosed rooms, dark heavy furniture, cold tones, urban industrial feel, excessive artificial lighting",
  },

  // ─── ATMOSPHERE (Mood Control) ────────────────────────────
  {
    id: "warm_cozy",
    nameKey: "Warm Cozy",
    descKey: "Warm lighting, inviting, soft shadows",
    image: "/styles/warm_cozy.jpg",
    tier: "atmosphere",
    prompt_addon: "warm cozy interior atmosphere, amber and terracotta color palette, soft fireplace glow, plush thick rugs and cushions, warm candlelight and Edison bulb lighting, rich textured fabrics, inviting intimate mood",
    negative_prompt: "cold blue lighting, stark white rooms, minimalist emptiness, harsh shadows, cold materials",
  },
  {
    id: "soft_neutral",
    nameKey: "Soft Neutral",
    descKey: "Beige tones, low contrast, minimal",
    image: "/styles/soft_neutral.jpg",
    tier: "atmosphere",
    prompt_addon: "all-neutral interior palette, bone white and sand beige tones, linen sofa, natural woven textures, zero visual contrast, calm serene atmosphere, no bold colors, tonal layering",
    negative_prompt: "bold colors, high contrast, dark accents, colorful accessories, busy patterns",
  },
  {
    id: "natural_light",
    nameKey: "Natural Light Focus",
    descKey: "Bright, airy, daylight emphasis",
    image: "/styles/natural_light.jpg",
    tier: "atmosphere",
    recommended: true,
    prompt_addon: "bright sun-drenched interior, floor-to-ceiling windows with white sheer curtains, brilliant natural daylight streaming in, light wood floors, white walls reflecting sunlight, airy open fresh atmosphere, soft shadow play",
    negative_prompt: "dark rooms, heavy curtains, artificial lighting, nighttime mood, enclosed spaces",
  },
];
