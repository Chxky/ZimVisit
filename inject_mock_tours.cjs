const fs = require('fs');

const TARGET = 'apps/traveler-portal/src/services/api.ts';
let code = fs.readFileSync(TARGET, 'utf8');

// The 5 destinations requested
const LOCATIONS = [
  { name: 'Mana Pools', province: 'Mashonaland West', cat: 'safari' },
  { name: 'Lake Kariba', province: 'Mashonaland West', cat: 'lake' },
  { name: 'Nyanga', province: 'Manicaland', cat: 'hiking' },
  { name: 'Bulawayo', province: 'Bulawayo', cat: 'cultural' },
  { name: 'Great Zimbabwe', province: 'Masvingo', cat: 'historical' },
];

let generatedTours = '';
let globalId = 1;

for (const loc of LOCATIONS) {
  for (let i = 1; i <= 20; i++) {
    const slugLoc = loc.name.toLowerCase().replace(/\\s+/g, '-');
    const tourId = `tour-${slugLoc}-${i}`;
    
    // Picsum seed guarantees a completely unique image for every single combination, avoiding any duplicates.
    // We add a 'nature' or 'landscape' tint using unsplash random if we could, but picsum is reliable.
    const image1 = `https://picsum.photos/seed/zimvisit-${slugLoc}-a${i}/800/600`;
    const image2 = `https://picsum.photos/seed/zimvisit-${slugLoc}-b${i}/800/600`;

    generatedTours += `
  {
    id: '${tourId}',
    name: '${loc.name} ${loc.cat.charAt(0).toUpperCase() + loc.cat.slice(1)} Experience ${i}',
    slug: '${tourId}',
    description: 'Experience the stunning beauty and rich heritage of ${loc.name}. This exclusive activity offers breathtaking views, professional guides, and an unforgettable journey into the heart of Zimbabwe.',
    shortDescription: 'Discover the magic of ${loc.name} with this premium ${loc.cat} experience.',
    location: '${loc.name}',
    province: '${loc.province}',
    category: '${loc.cat}' as any,
    images: ['${image1}', '${image2}'],
    price: ${Math.floor(Math.random() * 200) + 50},
    currency: 'USD',
    duration: '${Math.floor(Math.random() * 4) + 1} Days',
    durationHours: null,
    durationDays: ${Math.floor(Math.random() * 4) + 1},
    maxGroupSize: ${Math.floor(Math.random() * 10) + 2},
    difficulty: '${loc.cat === 'hiking' ? 'challenging' : 'moderate'}',
    rating: ${(4 + Math.random()).toFixed(1)},
    reviewCount: ${Math.floor(Math.random() * 150) + 10},
    inclusions: ['Professional Guide', 'Meals', 'Transport'],
    exclusions: ['Gratuities', 'Personal Items'],
    meetingPoint: '${loc.name} Central Lodge',
    highlights: ['Stunning scenery', 'Expert guidance', 'Memorable experience'],
    operator: {
      id: 'op-1',
      name: 'Zimbabwe Premium Tours',
      rating: 4.9,
    },
    isFeatured: ${i <= 2 ? 'true' : 'false'},
    isActive: true,
    availability: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },`;
  }
}

const mockArrayStr = `
// ============================================================
// GENERATED MOCK TOURS
// ============================================================
const MOCK_TOURS: Tour[] = [${generatedTours}
];
`;

// Insert the mock array before `export const toursApi`
if (!code.includes('MOCK_TOURS: Tour[]')) {
  code = code.replace('export const toursApi = {', mockArrayStr + '\\nexport const toursApi = {');
}

// Override toursApi methods to return MOCK_TOURS
code = code.replace(/getAll: async \\(filters\\?: SearchFilters\\): Promise<ApiResponse<Tour\\[\\]>> => \\{[\\s\\S]*?\\},/m, 
`getAll: async (filters?: SearchFilters): Promise<ApiResponse<Tour[]>> => {
    let result = MOCK_TOURS;
    if (filters?.location) {
      result = result.filter(t => t.slug.includes(filters.location!.toLowerCase().replace(/\\s+/g, '-')));
    }
    if (filters?.category) {
      result = result.filter(t => t.category === filters.category);
    }
    if (filters?.query) {
      result = result.filter(t => t.name.toLowerCase().includes(filters.query!.toLowerCase()));
    }
    return { data: result, success: true, message: 'Success' };
  },`);

code = code.replace(/getById: async \\(id: string\\): Promise<ApiResponse<Tour>> => \\{[\\s\\S]*?\\},/m,
`getById: async (id: string): Promise<ApiResponse<Tour>> => {
    const tour = MOCK_TOURS.find(t => t.id === id) || MOCK_TOURS[0];
    return { data: tour, success: true, message: 'Success' };
  },`);

code = code.replace(/getFeatured: async \\(\\): Promise<ApiResponse<Tour\\[\\]>> => \\{[\\s\\S]*?\\},/m,
`getFeatured: async (): Promise<ApiResponse<Tour[]>> => {
    return { data: MOCK_TOURS.filter(t => t.isFeatured), success: true, message: 'Success' };
  },`);

code = code.replace(/getByCategory: async \\(category: string\\): Promise<ApiResponse<Tour\\[\\]>> => \\{[\\s\\S]*?\\},/m,
`getByCategory: async (category: string): Promise<ApiResponse<Tour[]>> => {
    return { data: MOCK_TOURS.filter(t => t.category === category), success: true, message: 'Success' };
  },`);

code = code.replace(/search: async \\(query: string\\): Promise<ApiResponse<Tour\\[\\]>> => \\{[\\s\\S]*?\\},/m,
`search: async (query: string): Promise<ApiResponse<Tour[]>> => {
    return { data: MOCK_TOURS.filter(t => t.name.toLowerCase().includes(query.toLowerCase())), success: true, message: 'Success' };
  },`);

code = code.replace(/getSimilar: async \\(id: string\\): Promise<ApiResponse<Tour\\[\\]>> => \\{[\\s\\S]*?\\},/m,
`getSimilar: async (id: string): Promise<ApiResponse<Tour[]>> => {
    return { data: MOCK_TOURS.slice(0, 3), success: true, message: 'Success' };
  },`);

fs.writeFileSync(TARGET, code);
console.log('Successfully injected 100 mock tours with unique images!');
