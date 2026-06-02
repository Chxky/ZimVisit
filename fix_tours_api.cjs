const fs = require('fs');

const TARGET = 'apps/traveler-portal/src/services/api.ts';
let code = fs.readFileSync(TARGET, 'utf8');

// Fix the literal '\\n'
code = code.replace('\\\\nexport const toursApi = {', 'export const toursApi = {');

// Now, completely replace the toursApi object
const startMarker = 'export const toursApi = {';
const startIndex = code.indexOf(startMarker);
if (startIndex !== -1) {
  // Find the end of toursApi object which is followed by '// ============================================================' for Hotels API
  const endMarker = '// ============================================================';
  const endIndex = code.indexOf(endMarker, startIndex + startMarker.length);
  
  if (endIndex !== -1) {
    const newToursApi = \`export const toursApi = {
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<Tour[]>> => {
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
  },

  getById: async (id: string): Promise<ApiResponse<Tour>> => {
    const tour = MOCK_TOURS.find(t => t.id === id) || MOCK_TOURS[0];
    return { data: tour, success: true, message: 'Success' };
  },

  getFeatured: async (): Promise<ApiResponse<Tour[]>> => {
    return { data: MOCK_TOURS.filter(t => t.isFeatured), success: true, message: 'Success' };
  },

  getByCategory: async (category: string): Promise<ApiResponse<Tour[]>> => {
    return { data: MOCK_TOURS.filter(t => t.category === category), success: true, message: 'Success' };
  },

  search: async (query: string): Promise<ApiResponse<Tour[]>> => {
    return { data: MOCK_TOURS.filter(t => t.name.toLowerCase().includes(query.toLowerCase())), success: true, message: 'Success' };
  },

  getSimilar: async (id: string): Promise<ApiResponse<Tour[]>> => {
    return { data: MOCK_TOURS.slice(0, 3), success: true, message: 'Success' };
  },

  getReviews: async (id: string): Promise<ApiResponse<any[]>> => {
    return { data: [], success: true, message: 'Success' };
  },
};

\`;
    code = code.substring(0, startIndex) + newToursApi + code.substring(endIndex);
  }
}

fs.writeFileSync(TARGET, code);
console.log('Fixed toursApi successfully.');
