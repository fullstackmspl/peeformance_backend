function validatePassword(password) {
    if (!password)
        return {
            error: 'Password can not be empty',
            isError: true,
        }
        //any other validation
        return {
            isError: false
        }
    
}

module.exports = {
    validatePassword
}