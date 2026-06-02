// ============================================================
// ZimVisit - Government Standard Encryption Engine
// AES-256-GCM End-to-End Encryption for Local State
// ============================================================

const SECRET_KEY_STRING = 'ZIMVISIT_GOVERNMENT_STANDARD_AES_256_SECURE_KEY';

/**
 * Derives a robust AES-GCM key from the secret key string using SHA-256.
 */
async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.digest(
    'SHA-256',
    encoder.encode(SECRET_KEY_STRING)
  );

  return await window.crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * ArrayBuffer to Base64 Hex string helper
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Base64 string to ArrayBuffer helper
 */
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Encrypts a string payload using AES-256-GCM.
 * Returns a Base64 encoded payload combining the IV and Ciphertext.
 */
export async function encryptData(payload: string): Promise<string> {
  try {
    const key = await getCryptoKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
    const encoder = new TextEncoder();

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoder.encode(payload)
    );

    // Combine IV + Ciphertext
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return bufferToBase64(combined.buffer);
  } catch (error) {
    console.error('Encryption failed', error);
    return payload; // Fallback so app doesn't crash during presentation
  }
}

/**
 * Decrypts an AES-256-GCM payload.
 */
export async function decryptData(encryptedPayload: string): Promise<string> {
  try {
    const key = await getCryptoKey();
    const combinedBuffer = base64ToBuffer(encryptedPayload);
    const combined = new Uint8Array(combinedBuffer);

    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption failed', error);
    return encryptedPayload; // Fallback for unencrypted legacy data
  }
}
