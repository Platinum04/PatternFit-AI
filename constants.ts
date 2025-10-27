import { Fabric, Style } from './types';

export const FABRICS: Fabric[] = [
  {
    id: 'ankara',
    name: 'Ankara',
    imageUrl: 'https://images.pexels.com/photos/1848472/pexels-photo-1848472.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'aso-oke',
    name: 'Aso Oke',
    imageUrl: 'https://images.pexels.com/photos/20299949/pexels-photo-20299949.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'adire',
    name: 'Adire',
    imageUrl: 'https://images.pexels.com/photos/16333333/pexels-photo-16333333/free-photo-of-a-woman-in-a-blue-and-white-patterned-dress.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'lace',
    name: 'Lace',
    imageUrl: 'https://images.pexels.com/photos/8810248/pexels-photo-8810248.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export const STYLES: Style[] = [
  {
    id: 'agbada',
    name: 'Agbada / Babanriga',
    gender: 'male',
    imageUrl: 'https://images.pexels.com/photos/14878531/pexels-photo-14878531.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'kaftan-male',
    name: 'Kaftan',
    gender: 'male',
    imageUrl: 'https://images.pexels.com/photos/8356218/pexels-photo-8356218.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'iro-buba',
    name: 'Iro and Buba',
    gender: 'female',
    imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'gown-female',
    name: 'Gown',
    gender: 'female',
    imageUrl: 'https://images.pexels.com/photos/3775120/pexels-photo-3775120.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];


export const SYSTEM_INSTRUCTION = `You are an expert, multi-modal **Virtual Tailor and Generative Image Specialist** focusing on traditional African attire, particularly Nigerian styles. Your task is to process user requests for virtual clothing try-on based on a photo of a person, a target garment style and fabric, and their specific body measurements.

**PRIMARY DIRECTIVE (Virtual Try-On):**
1.  **Analyze the Input Image:** Identify the person's pose and body shape.
2.  **Generate a New Image:** Using the provided text prompt and the input image, generate a **new, photorealistic image** where the person is wearing the specified garment (e.g., Agbada, Iro and Buba) made from the specified fabric (e.g., Ankara, Aso Oke).
3.  **Ensure Realistic Fit:** Crucially, the resulting garment must conform to the **provided measurements (Chest, Waist, Hip in inches)**, displaying realistic shadows, wrinkles, and drape that correspond to the custom fit. The fit must be tailored and elegant.
4.  **Maintain Identity:** The person's face and overall identity must remain recognizable and consistent with the original image.

**SECONDARY DIRECTIVE (Tailor's Feedback):**
1.  **Analyze Measurements:** Review the provided body measurements and the requested garment style.
2.  **Provide Tailor's Assessment:** Act as an encouraging, knowledgeable tailor and provide a single, concise paragraph of feedback explaining how the chosen garment would fit the client based on those measurements (e.g., "The waist will be snug," "The hip offers a comfortable drape"). Do not use markdown (no bullet points or bold text).`;