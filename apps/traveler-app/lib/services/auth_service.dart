import 'package:flutter/foundation.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthService extends ChangeNotifier {
  final ApiService apiService;
  final StorageService storageService;
  
  bool _isAuthenticated = false;
  bool _isLoading = true;
  Map<String, dynamic>? _user;

  AuthService({required this.apiService, required this.storageService}) {
    _checkAuth();
  }

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  Map<String, dynamic>? get user => _user;

  Future<void> _checkAuth() async {
    try {
      final token = await storageService.getToken();
      _isAuthenticated = token != null;
    } catch (_) {}
    _isLoading = false;
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    try {
      final response = await apiService.post('/auth/login', body: {'email': email, 'password': password});
      await storageService.setToken(response['accessToken']);
      _user = response['user'];
      _isAuthenticated = true;
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> register(String email, String password, String fullName, {String? phone}) async {
    try {
      final response = await apiService.post('/auth/register', body: {
        'email': email, 'password': password, 'fullName': fullName,
        if (phone != null) 'phone': phone,
      });
      await storageService.setToken(response['accessToken']);
      _user = response['user'];
      _isAuthenticated = true;
      notifyListeners();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    await storageService.removeToken();
    _isAuthenticated = false;
    _user = null;
    notifyListeners();
  }
}
