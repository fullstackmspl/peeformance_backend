function createTemporary(email, firstName, surname, password, studyKey_encryptedHex, salt_toHex, init_vector_toHex, userstatus, question1, answer1, question2, answer2, type, organisationID, Token, Expiration) {

    const userData = { email, firstName, surname, password, studyKey_encryptedHex, salt_toHex, init_vector_toHex, userstatus, question1, answer1, question2, answer2, type, organisationID, Token, Expiration };
    return userData;
}
module.exports = {
    createTemporary
}