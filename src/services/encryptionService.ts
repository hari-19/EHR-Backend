import * as crypto from 'crypto';
import { EncryptSymmetricArgs } from '../types/encryptionService/functionArguments';


/**
 * Generate a random encryption key for Symmetric AES encryption.
 * @returns key
 */
export function generateEncryptionKeySymmetric() {
    const initVector = crypto.randomBytes(16);
    const securityKey = crypto.randomBytes(32);
    const iv = initVector.toString('base64');
    const key = securityKey.toString('base64');
    return iv + key;
}

/**
 * Encrypts data using AES Algorithm and returns encrypted data
 * @param param0 Takes key (use getEncryptionKeySymmetric to generate key) and data as named arguments
 * @returns encrypted data
 */
export function encryptSymmetric ({ key, data}: EncryptSymmetricArgs) {
    const algo = "aes-256-cbc";
    const initVector = Buffer.from(key.substr(0, 24), 'base64');
    const securityKey = Buffer.from(key.substr(24, 44), 'base64');
    const cipher = crypto.createCipheriv(algo, securityKey, initVector);
    let encryptedData = cipher.update(data, "utf-8", "base64");
    encryptedData+= cipher.final('base64');

    return data;
}

export const decryptSymmetric = (encryptedData: string, key: string) => {
    const algo = "aes-256-cbc";
    const initVector = Buffer.from(key.substr(0, 24), 'base64');
    const securityKey = Buffer.from(key.substr(24, 44), 'base64');
    const decipher = crypto.createDecipheriv(algo, securityKey, initVector);
    let decryptedData = decipher.update(encryptedData, 'base64', 'utf-8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
}

export const generateKey = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
          cipher: 'aes-256-cbc',
        },
      })
    return {
        publicKey, privateKey
    }
};
export const encryptAsymmetric = (data: string, publicKey: string) => {
    const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
    return encryptedData.toString('base64');
}

export const decryptAsymmetric = (encryptedData: string, privateKey: string) => {
    const data = crypto.privateDecrypt({
            key: privateKey,
            passphrase: ''
        },
        Buffer.from(encryptedData, 'base64')
    );

    return data.toString('utf8');
}