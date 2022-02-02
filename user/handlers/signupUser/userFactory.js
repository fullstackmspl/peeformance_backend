function createTemporary(email, firstName, surname, password, studyKey_encryptedHex, salt_toHex, init_vector_toHex) {

    const userData = { email, firstName, surname, password, studyKey_encryptedHex, salt_toHex, init_vector_toHex };
    return userData;
}
module.exports = {
    createTemporary
}