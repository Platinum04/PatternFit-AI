import { Style, Fabric, Design } from './types';

// NOTE: Using placeholder images for demonstration purposes.
// In a real application, these would be high-quality, consistently styled images.

export const FABRICS: Fabric[] = [
  {
    id: 'ankara-1',
    name: 'Blue Swirl Ankara',
    imageUrl: 'https://i.imgur.com/KkM4U5F.jpeg',
  },
  {
    id: 'aso-oke-1',
    name: 'Striped Aso-Oke',
    imageUrl: 'https://i.imgur.com/jM8kVC1.jpeg',
  },
  {
    id: 'lace-1',
    name: 'White Lace',
    imageUrl: 'https://i.imgur.com/7gqQyB4.jpeg',
  },
  {
    id: 'brocade-1',
    name: 'Gold Brocade',
    imageUrl: 'https://i.imgur.com/h5r8wL9.jpeg',
  },
];

export const STYLES: Style[] = [
  {
    id: 'f-buba-iro',
    name: 'Buba and Iro',
    gender: 'female',
    imageUrl: 'https://i.imgur.com/zWz2X4D.jpeg',
  },
  {
    id: 'f-gown',
    name: 'Ankara Gown',
    gender: 'female',
    imageUrl: 'https://i.imgur.com/e5kFSOg.jpeg',
  },
  {
    id: 'm-agbada',
    name: 'Agbada',
    gender: 'male',
    imageUrl: 'https://i.imgur.com/pG2wV6r.jpeg',
  },
  {
    id: 'm-kaftan',
    name: 'Kaftan',
    gender: 'male',
    imageUrl: 'https://i.imgur.com/uT25qQG.jpeg',
  },
];

// Designs are transparent PNGs meant to be overlaid.
export const DESIGNS: Design[] = [
  // Female designs
  {
    id: 'f-design-1',
    name: 'Floral Embroidery',
    styleId: 'f-gown',
    imageUrl: 'https://i.imgur.com/eBf2g4U.png',
  },
  {
    id: 'f-design-2',
    name: 'Geometric Neckline',
    styleId: 'f-buba-iro',
    imageUrl: 'https://i.imgur.com/1gH8jMh.png',
  },
  // Male designs
  {
    id: 'm-design-1',
    name: 'Classic Embroidery',
    styleId: 'm-agbada',
    imageUrl: 'https://i.imgur.com/z2xYg0n.png',
  },
  {
    id: 'm-design-2',
    name: 'Modern Chest Design',
    styleId: 'm-agbada',
    imageUrl: 'https://i.imgur.com/s6v4tXf.png',
  },
  {
    id: 'm-design-3',
    name: 'Simple Neck Design',
    styleId: 'm-kaftan',
    imageUrl: 'https://i.imgur.com/eBf2g4U.png',
  }
];
