import { Style, Fabric, Design } from './types';

// NOTE: Upgraded to 'Studio-Grade' assets for professional presentation.
const ART_BASE = 'C:/Users/User/.gemini/antigravity/brain/45572cf3-ba23-4b9e-8380-c5dcea8308c0';

export const FEMALE_FABRICS: Fabric[] = [
  {
    id: 'f-ankara-1',
    name: 'Blue Swirl Ankara',
    imageUrl: `${ART_BASE}/fabric_ankara_blue_studio_1774252022844.png`,
  },
  {
    id: 'f-aso-oke-1',
    name: 'Striped Aso-Oke',
    imageUrl: `${ART_BASE}/fabric_aso_oke_studio_1774252041450.png`,
  },
  {
    id: 'f-lace-1',
    name: 'White Lace',
    imageUrl: `${ART_BASE}/fabric_white_lace_studio_1774252059157.png`,
  },
  {
    id: 'f-adire-1',
    name: 'Indigo Adire',
    imageUrl: `${ART_BASE}/fabric_adire_studio_1774252075486.png`,
  },
  {
    id: 'f-guinea-1',
    name: 'Gold Guinea Brocade',
    imageUrl: `${ART_BASE}/fabric_brocade_gold_studio_1774252096171.png`,
  },
];

export const MALE_FABRICS: Fabric[] = [
  {
    id: 'm-guinea-1',
    name: 'Rich Guinea Brocade',
    imageUrl: `${ART_BASE}/fabric_brocade_gold_studio_1774252096171.png`,
  },
  {
    id: 'm-kaftan-1',
    name: 'Kaftan Material',
    imageUrl: `${ART_BASE}/fabric_adire_studio_1774252075486.png`,
  },
];


export const STYLES: Style[] = [
  {
    id: 'f-buba-iro',
    name: 'Buba and Iro',
    gender: 'female',
    imageUrl: `${ART_BASE}/style_buba_iro_studio_1774251981124.png`,
  },
  {
    id: 'f-gown',
    name: 'Ankara Gown',
    gender: 'female',
    imageUrl: `${ART_BASE}/style_gown_studio_1774251999922.png`,
  },
  {
    id: 'm-agbada',
    name: 'Agbada',
    gender: 'male',
    imageUrl: `${ART_BASE}/style_agbada_studio_1774251948937.png`,
  },
  {
    id: 'm-kaftan',
    name: 'Kaftan',
    gender: 'male',
    imageUrl: `${ART_BASE}/style_kaftan_studio_1774251964080.png`,
  },
];

// Designs are technical overlays.
export const DESIGNS: Design[] = [
  // Classic/Base options for all
  { id: 'classic-f-buba', name: 'Original Master', styleId: 'f-buba-iro', imageUrl: 'https://i.imgur.com/eBf2g4U.png' },
  { id: 'classic-f-gown', name: 'Original Master', styleId: 'f-gown', imageUrl: 'https://i.imgur.com/eBf2g4U.png' },
  { id: 'classic-m-agbada', name: 'Original Master', styleId: 'm-agbada', imageUrl: 'https://i.imgur.com/eBf2g4U.png' },
  { id: 'classic-m-kaftan', name: 'Original Master', styleId: 'm-kaftan', imageUrl: 'https://i.imgur.com/eBf2g4U.png' },
  
  // Custom variations
  {
    id: 'f-design-1',
    name: 'Floral Detailing',
    styleId: 'f-gown',
    imageUrl: 'https://i.imgur.com/eBf2g4U.png',
  },
  {
    id: 'f-design-2',
    name: 'Geometric Contrast',
    styleId: 'f-buba-iro',
    imageUrl: 'https://i.imgur.com/1gH8jMh.png',
  },
  {
    id: 'm-design-1',
    name: 'Classic Embroidery',
    styleId: 'm-agbada',
    imageUrl: 'https://i.imgur.com/z2xYg0n.png',
  },
  {
    id: 'm-design-2',
    name: 'Modern Panel',
    styleId: 'm-agbada',
    imageUrl: 'https://i.imgur.com/s6v4tXf.png',
  },
  {
    id: 'm-design-3',
    name: 'Minimal Detail',
    styleId: 'm-kaftan',
    imageUrl: 'https://i.imgur.com/eBf2g4U.png',
  }
];
