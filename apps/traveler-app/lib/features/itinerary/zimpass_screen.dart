import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class ZimPassScreen extends StatelessWidget {
  const ZimPassScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('ZimPass Itinerary')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // ZimPass header
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF166534), Color(0xFF15803d)]),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  const Icon(Icons.qr_code, size: 48, color: Colors.white),
                  const SizedBox(height: 8),
                  const Text('ZimPass', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('Your Unified Travel Pass', style: TextStyle(color: Colors.green[200])),
                  const SizedBox(height: 16),
                  // QR Code
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
                    child: QrImageView(
                      data: 'ZV-A3B7K2',
                      version: QrVersions.auto,
                      size: 180,
                      backgroundColor: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text('ZV-A3B7K2', style: TextStyle(color: Colors.green[200], fontSize: 18, letterSpacing: 2)),
                  const SizedBox(height: 4),
                  Text('Scan this QR code for your complete itinerary', style: TextStyle(color: Colors.green[300], fontSize: 12)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Itinerary items
            _buildItineraryItem(context, Icons.flight, 'Flight', 'EK 713', 'Dubai → Harare', 'Jun 15, 14:30'),
            const Divider(),
            _buildItineraryItem(context, Icons.hotel, 'Hotel', 'Meikles Hotel', 'Harare', 'Jun 15-17'),
            const Divider(),
            _buildItineraryItem(context, Icons.directions_car, 'Tour', 'Victoria Falls Tour', 'Victoria Falls', 'Jun 16, 08:00'),
            const Divider(),
            _buildItineraryItem(context, Icons.flight, 'Flight', 'FN 8221', 'Harare → VFA', 'Jun 16, 06:00'),
            const Divider(),
            _buildItineraryItem(context, Icons.transfer_within_a_station, 'Transfer', 'Airport Shuttle', 'VFA → Hotel', 'Jun 16, 09:00'),
            const SizedBox(height: 24),

            // Share button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.share),
                label: const Text('Share ZimPass'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF166534),
                  side: const BorderSide(color: Color(0xFF166534)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildItineraryItem(BuildContext context, IconData icon, String type, String title, String subtitle, String time) {
    return ListTile(
      leading: Container(
        width: 44, height: 44,
        decoration: BoxDecoration(color: const Color(0xFF166534).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
        child: Icon(icon, color: const Color(0xFF166534), size: 22),
      ),
      title: Text('$type: $title', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: Text(time, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
    );
  }
}
