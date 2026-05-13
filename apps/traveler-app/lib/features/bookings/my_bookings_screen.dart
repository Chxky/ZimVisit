import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class MyBookingsScreen extends StatelessWidget {
  const MyBookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final dummyBookings = [
      {'ref': 'ZV-A3B7K2', 'name': 'Victoria Falls Tour', 'date': '2026-06-15', 'status': 'confirmed', 'amount': 170},
      {'ref': 'ZV-C9D1F5', 'name': 'Hwange Safari Drive', 'date': '2026-06-18', 'status': 'pending', 'amount': 150},
      {'ref': 'ZV-E8G4H1', 'name': 'Great Zimbabwe Ruins', 'date': '2026-05-20', 'status': 'completed', 'amount': 45},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('My Bookings')),
      body: dummyBookings.isEmpty
        ? const Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.confirmation_number_outlined, size: 80, color: Colors.grey),
                SizedBox(height: 16),
                Text('No bookings yet', style: TextStyle(fontSize: 18, color: Colors.grey)),
                SizedBox(height: 8),
                Text('Start exploring Zimbabwe!', style: TextStyle(color: Colors.grey)),
              ],
            ),
          )
        : ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: dummyBookings.length,
            itemBuilder: (context, i) {
              final b = dummyBookings[i];
              final statusColors = {'confirmed': const Color(0xFF16a34a), 'pending': const Color(0xFFf59e0b), 'completed': const Color(0xFF0284c7)};
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.grey[200]!)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Container(
                        width: 48, height: 48,
                        decoration: BoxDecoration(color: const Color(0xFF166534).withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                        child: const Icon(Icons.confirmation_number, color: Color(0xFF166534)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(b['name'] as String, style: const TextStyle(fontWeight: FontWeight.w600)),
                            const SizedBox(height: 4),
                            Text('Ref: ${b['ref']} • \$${b['amount']}', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: (statusColors[b['status']] as Color).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              (b['status'] as String).toUpperCase(),
                              style: TextStyle(color: statusColors[b['status']] as Color, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(DateFormat('MMM dd').format(DateTime.parse(b['date'] as String)), style: TextStyle(color: Colors.grey[400], fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
    );
  }
}
