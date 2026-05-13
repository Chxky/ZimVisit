import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService {
  final _storage = const FlutterSecureStorage();

  Future<void> init() async {}

  Future<void> setToken(String token) async => _storage.write(key: 'auth_token', value: token);
  Future<String?> getToken() async => _storage.read(key: 'auth_token');
  Future<void> removeToken() async => _storage.delete(key: 'auth_token');

  Future<void> setUser(Map<String, dynamic> user) async => _storage.write(key: 'user_data', value: jsonEncode(user));
  Future<Map<String, dynamic>?> getUser() async {
    final data = await _storage.read(key: 'user_data');
    return data != null ? jsonDecode(data) as Map<String, dynamic> : null;
  }

  Future<void> setOfflineData(String key, String data) async => _storage.write(key: 'offline_$key', value: data);
  Future<String?> getOfflineData(String key) async => _storage.read(key: 'offline_$key');
}
