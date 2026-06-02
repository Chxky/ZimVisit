import 'package:flutter/material.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchController = TextEditingController();
  final _budgetController = TextEditingController();
  bool _showBudgetInput = false;

  final _categories = [
    {'icon': Icons.safari, 'name': 'Safari', 'color': const Color(0xFF166534)},
    {'icon': Icons.water_drop, 'name': 'Victoria Falls', 'color': const Color(0xFF0284c7)},
    {'icon': Icons.landscape, 'name': 'Hiking', 'color': const Color(0xFF65a30d)},
    {'icon': Icons.museum, 'name': 'Cultural', 'color': const Color(0xFF9333ea)},
    {'icon': Icons.beach_access, 'name': 'Lake', 'color': const Color(0xFF0d9488)},
    {'icon': Icons.wildlife, 'name': 'Wildlife', 'color': const Color(0xFFe11d48)},
  ];

  final _featuredTours = [
    {'name': 'Victoria Falls Tour', 'location': 'Victoria Falls', 'price': 85, 'rating': 4.8, 'image': Icons.water_drop, 'duration': '3 hours'},
    {'name': 'Hwange Safari Drive', 'location': 'Hwange', 'price': 150, 'rating': 4.9, 'image': Icons.safari, 'duration': 'Full day'},
    {'name': 'Great Zimbabwe Ruins', 'location': 'Masvingo', 'price': 45, 'rating': 4.6, 'image': Icons.museum, 'duration': '2 hours'},
    {'name': 'Eastern Highlands Trek', 'location': 'Mutare', 'price': 120, 'rating': 4.7, 'image': Icons.landscape, 'duration': '6 hours'},
    {'name': 'Lake Kariba Houseboat', 'location': 'Kariba', 'price': 200, 'rating': 4.5, 'image': Icons.beach_access, 'duration': 'Overnight'},
    {'name': 'Mana Pools Canoe Safari', 'location': 'Mana Pools', 'price': 180, 'rating': 4.9, 'image': Icons.wildlife, 'duration': '2 days'},
  ];

  @override
  void dispose() {
    _searchController.dispose();
    _budgetController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Explore Zimbabwe'),
        actions: [
          IconButton(
            icon: Icon(_showBudgetInput ? Icons.trending_flat : Icons.attach_money),
            onPressed: () => setState(() => _showBudgetInput = !_showBudgetInput),
            tooltip: 'Name Your Budget',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search bar
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search tours, hotels, activities...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isEmpty ? null : IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () { _searchController.clear(); setState(() {}); },
                ),
              ),
              onChanged: (_) => setState(() {}),
            ),
            const SizedBox(height: 16),

            // Name Your Budget
            if (_showBudgetInput) ...[
              Card(
                color: const Color(0xFF166534).withOpacity(0.05),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.auto_awesome, color: Color(0xFF166534)),
                          const SizedBox(width: 8),
                          Text('Name Your Budget', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('Tell us your budget and we\'ll curate the perfect Zimbabwe experience', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey[600])),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _budgetController,
                              decoration: const InputDecoration(
                                prefixText: '\$ ',
                                hintText: 'Your budget',
                                isDense: true,
                              ),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                          const SizedBox(width: 12),
                          ElevatedButton(
                            onPressed: () {},
                            child: const Text('Get Packages'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Categories
            Text('Categories', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            SizedBox(
              height: 100,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, i) {
                  final cat = _categories[i];
                  return GestureDetector(
                    onTap: () {},
                    child: Container(
                      width: 80,
                      decoration: BoxDecoration(
                        color: (cat['color'] as Color).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(cat['icon'] as IconData, color: cat['color'] as Color, size: 28),
                          const SizedBox(height: 4),
                          Text(cat['name'] as String, style: TextStyle(fontSize: 11, color: cat['color'] as Color, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),

            // Featured Tours
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Featured Tours', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                TextButton(onPressed: () {}, child: const Text('See All')),
              ],
            ),
            const SizedBox(height: 8),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _featuredTours.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, i) {
                final tour = _featuredTours[i];
                return Card(
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey[200]!)),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(12),
                    leading: Container(
                      width: 60, height: 60,
                      decoration: BoxDecoration(
                        color: const Color(0xFF166534).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(tour['image'] as IconData, color: const Color(0xFF166534)),
                    ),
                    title: Text(tour['name'] as String, style: const TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.location_on, size: 14, color: Colors.grey[400]),
                            const SizedBox(width: 4),
                            Text(tour['location'] as String, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                            const Spacer(),
                            const Icon(Icons.star, size: 14, color: Colors.amber),
                            const SizedBox(width: 2),
                            Text('${tour['rating']}', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(Icons.access_time, size: 14, color: Colors.grey[400]),
                            const SizedBox(width: 4),
                            Text(tour['duration'] as String, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                            const Spacer(),
                            Text('From \$${tour['price']}', style: const TextStyle(color: Color(0xFF166534), fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    ),
                    onTap: () {},
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
