import 'dart:convert';
import 'dart:io' show Platform;
import 'package:http/http.dart' as http;
import 'storage_service.dart';

class ApiService {
  final StorageService storageService;
  final String baseUrl;

  ApiService({required this.storageService, String? baseUrl})
    : baseUrl = baseUrl ?? (Platform.isAndroid ? 'http://10.0.2.2:3000/api/v1' : 'http://localhost:3000/api/v1');

  Future<Map<String, String>> get _headers async {
    final token = await storageService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> get(String endpoint, {Map<String, String>? params}) async {
    final uri = Uri.parse('$baseUrl$endpoint').replace(queryParameters: params);
    final response = await http.get(uri, headers: await _headers);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> post(String endpoint, {Map<String, dynamic>? body}) async {
    final response = await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: await _headers,
      body: body != null ? jsonEncode(body) : null,
    );
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> put(String endpoint, {Map<String, dynamic>? body}) async {
    final response = await http.put(
      Uri.parse('$baseUrl$endpoint'),
      headers: await _headers,
      body: body != null ? jsonEncode(body) : null,
    );
    return _handleResponse(response);
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return data['data'] as Map<String, dynamic>? ?? data;
    }
    throw ApiException(data['message']?.toString() ?? 'Request failed', response.statusCode);
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;
  ApiException(this.message, this.statusCode);
  @override
  String toString() => message;
}
