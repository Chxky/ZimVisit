const fs = require('fs');
const TARGET = 'apps/traveler-portal/src/services/api.ts';
const code = fs.readFileSync(TARGET, 'utf8');

const injection = \`
export const toursApi = {
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<Tour[]>> => {
    let result = MOCK_TOURS;
    if (filters?.location) {
      result = result.filter(t => t.slug.includes(filters.location.toLowerCase().replace(/\\\\s+/g, '-')));
    }
    if (filters?.category) {
      result = result.filter(t => t.category === filters.category);
    }
    if (filters?.search) {
      result = result.filter(t => t.name.toLowerCase().includes(filters.search.toLowerCase()));
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

fs.writeFileSync(TARGET, code + injection);
console.log('Appended successfully.');
