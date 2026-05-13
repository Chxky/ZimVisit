import 'package:flutter/material.dart';

class PaymentScreen extends StatelessWidget {
  const PaymentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Amount
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    Text('Total Amount', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey)),
                    const SizedBox(height: 8),
                    Text('\$170.00', style: Theme.of(context).textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF166534))),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Payment methods
            Text('Select Payment Method', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildPaymentOption(context, 'EcoCash', 'Pay with mobile money', Icons.phone_android, 'assets/icons/ecocash.png'),
            const SizedBox(height: 8),
            _buildPaymentOption(context, 'Paynow', 'Pay with card or bank transfer', Icons.payment, 'assets/icons/paynow.png'),
            const SizedBox(height: 8),
            _buildPaymentOption(context, 'Visa / Mastercard', 'International card payment', Icons.credit_card, null),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentOption(BuildContext context, String title, String subtitle, IconData icon, String? asset) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: BorderSide(color: Colors.grey[200]!)),
      child: ListTile(
        leading: Container(
          width: 44, height: 44,
          decoration: BoxDecoration(color: const Color(0xFF166534).withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, color: const Color(0xFF166534)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {},
      ),
    );
  }
}
