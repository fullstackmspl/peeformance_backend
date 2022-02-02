const bcrypt = require('bcrypt');
let crypto = require('crypto');
let aesjs = require('aes-js');
let pbkdf2 = require('pbkdf2');

function makeHash(password) {
    password = bcrypt.hashSync(password, 9);
    let study_key_k1 = crypto.randomBytes(16);
    let salt = crypto.randomBytes(16);
    let init_vector = crypto.randomBytes(16);

    let salt_toHex = aesjs.utils.hex.fromBytes(salt);
    let init_vector_toHex = aesjs.utils.hex.fromBytes(init_vector);

            
    let derivedKey_k2 = pbkdf2.pbkdf2Sync(password, salt, 2300, 16, 'sha512');
    let aesCbc = new aesjs.ModeOfOperation.cbc(derivedKey_k2, init_vector);
    let encryptedBytes = aesCbc.encrypt(study_key_k1);

    let studyKey_encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return {
        password,
        studyKey_encryptedHex,
        salt_toHex,
        init_vector_toHex
     }
}

module.exports = {
    makeHash
}