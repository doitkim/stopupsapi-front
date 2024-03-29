import CryptoJS from "crypto-js";

const keySize = Number(process.env.REACT_APP_KEYSIZE);
const ivSize = Number(process.env.REACT_APP_IVSIZE);
const iterations = Number(process.env.REACT_APP_ITERATIONS);
const secret = process.env.REACT_APP_SECRET;

function encrypt(msg) {
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key = CryptoJS.PBKDF2(secret, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  const iv = CryptoJS.lib.WordArray.random(ivSize / 8);
  const encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
    hasher: CryptoJS.algo.SHA256,
  });
  const transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  return transitmessage;
}

function decrypt(transitmessage) {
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  var encrypted = transitmessage.substring(64);

  var key = CryptoJS.PBKDF2(secret, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
    hasher: CryptoJS.algo.SHA256,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };
