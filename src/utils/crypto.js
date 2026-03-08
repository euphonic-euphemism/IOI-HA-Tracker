import CryptoJS from 'crypto-js';

/**
 * Encrypts an object payload to AES-256 ciphertext
 * @param {Object|Array} data - The JS object/array to encrypt 
 * @param {string} passphrase - The encryption key
 * @returns {string} The encrypted ciphertext string
 */
export const encryptData = (data, passphrase) => {
    try {
        const jsonString = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonString, passphrase).toString();
        return encrypted;
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
};

/**
 * Decrypts AES-256 ciphertext back to a JS object
 * @param {string} encryptedText - The encrypted string from storage
 * @param {string} passphrase - The decryption key
 * @returns {Object|Array|null} The decrypted data, or null if decryption fails (wrong password)
 */
export const decryptData = (encryptedText, passphrase) => {
    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedText, passphrase);
        const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
            // Decryption failed (bad password) or empty
            return null;
        }

        return JSON.parse(decryptedString);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null; // Often indicates a bad password throwing a malformed UTF-8 error
    }
};
