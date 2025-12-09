import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Encrypt a string using AES-256-CBC
 * @param text - Plain text to encrypt
 * @param encryptionKey - 32-byte encryption key (from env)
 * @returns Encrypted string in format: iv:encryptedData
 */
export function encrypt(text: string, encryptionKey: string): string {
  if (!encryptionKey || encryptionKey.length !== 64) {
    throw new Error('Encryption key must be 64 hex characters (32 bytes)');
  }

  const key = Buffer.from(encryptionKey, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt a string using AES-256-CBC
 * @param encryptedText - Encrypted text in format: iv:encryptedData
 * @param encryptionKey - 32-byte encryption key (from env)
 * @returns Decrypted plain text
 */
export function decrypt(encryptedText: string, encryptionKey: string): string {
  if (!encryptionKey || encryptionKey.length !== 64) {
    throw new Error('Encryption key must be 64 hex characters (32 bytes)');
  }

  const [ivHex, encrypted] = encryptedText.split(':');
  if (!ivHex || !encrypted) {
    throw new Error('Invalid encrypted text format');
  }

  const key = Buffer.from(encryptionKey, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
