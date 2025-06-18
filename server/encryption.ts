import crypto, { randomBytes, createHash } from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const ENCRYPTION_VERSION = '2.0';

export interface EncryptionMetadata {
  context: string;
  timestamp: number;
  userId?: string;
  dataType: 'mission' | 'document' | 'profile' | 'settings' | 'session';
}

export interface EncryptedData {
  encryptedData: string;
  iv: string;
  tag: string;
  salt?: string;
  algorithm: string;
  version: string;
}

// Primary encryption key from environment
function getEncryptionKey(salt?: Buffer): Buffer {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY environment variable not set");
  }
  
  const baseKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  
  if (salt) {
    // Use PBKDF2 for key derivation with salt (reduced iterations for performance)
    return crypto.pbkdf2Sync(baseKey, salt, 10000, KEY_LENGTH, 'sha256');
  }
  
  return baseKey.slice(0, KEY_LENGTH);
}

function generateSalt(): Buffer {
  return randomBytes(16);
}

// Simplified key derivation for better performance
function deriveKeyForContext(context: string, salt?: Buffer): Buffer {
  const baseKey = getEncryptionKey();
  
  // Simple hash-based derivation instead of expensive PBKDF2
  const contextHash = createHash('sha256').update(context).digest();
  const finalKey = Buffer.alloc(KEY_LENGTH);
  
  for (let i = 0; i < KEY_LENGTH; i++) {
    finalKey[i] = baseKey[i] ^ contextHash[i % contextHash.length];
  }
  
  return finalKey;
}

// Streamlined encryption for better performance
export function encryptSensitiveData(data: string, metadata?: EncryptionMetadata): EncryptedData {
  const key = getEncryptionKey(); // Use base key directly for performance
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    tag: '',
    algorithm: ALGORITHM,
    version: ENCRYPTION_VERSION
  };
}

// Backward compatible encryption for legacy data
export function encryptLegacyData(data: string): EncryptedData {
  const salt = generateSalt();
  const key = getEncryptionKey(salt);
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    tag: '',
    salt: salt.toString('hex'),
    algorithm: ALGORITHM,
    version: ENCRYPTION_VERSION
  };
}

export function decryptSensitiveData(encryptedData: EncryptedData, metadata?: EncryptionMetadata): string {
  // Handle legacy data without version
  if (!encryptedData.version) {
    return decryptLegacyData(encryptedData);
  }

  const key = metadata ? 
    deriveKeyForContext(metadata.context, Buffer.from(encryptedData.salt!, 'hex')) : 
    getEncryptionKey(Buffer.from(encryptedData.salt!, 'hex'));
  
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

function decryptLegacyData(encryptedData: EncryptedData): string {
  const key = getEncryptionKey(Buffer.from(encryptedData.salt!, 'hex'));
  
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Document encryption (for file uploads)
export function encryptDocument(documentBuffer: Buffer): EncryptedData {
  const salt = generateSalt();
  const key = getEncryptionKey(salt);
  const iv = randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(documentBuffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return {
    encryptedData: encrypted.toString('hex'),
    iv: iv.toString('hex'),
    tag: '',
    salt: salt.toString('hex'),
    algorithm: ALGORITHM,
    version: ENCRYPTION_VERSION
  };
}

export function decryptDocument(encryptedData: EncryptedData): Buffer {
  const key = getEncryptionKey(Buffer.from(encryptedData.salt!, 'hex'));
  
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  let decrypted = decipher.update(Buffer.from(encryptedData.encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted;
}

// Utility functions for secure hashing
export function hashSensitiveInfo(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

export function generateSecureToken(): string {
  return randomBytes(32).toString('hex');
}

// Field-level encryption helpers
export function encryptField(value: string | null): string | null {
  if (!value) return null;
  
  const encrypted = encryptSensitiveData(value, {
    context: 'field-encryption',
    timestamp: Date.now(),
    dataType: 'settings'
  });
  
  return JSON.stringify(encrypted);
}

export function decryptField(encryptedValue: string | null): string | null {
  if (!encryptedValue) return null;
  
  try {
    const encrypted = JSON.parse(encryptedValue) as EncryptedData;
    return decryptSensitiveData(encrypted, {
      context: 'field-encryption',
      timestamp: Date.now(),
      dataType: 'settings'
    });
  } catch (error) {
    console.error('Failed to decrypt field:', error);
    return null;
  }
}

// Validation and setup
export function validateEncryptionSetup(): boolean {
  try {
    const testData = 'test-encryption-validation';
    const encrypted = encryptSensitiveData(testData);
    const decrypted = decryptSensitiveData(encrypted);
    
    return decrypted === testData;
  } catch (error) {
    console.error('Encryption validation failed:', error);
    return false;
  }
}