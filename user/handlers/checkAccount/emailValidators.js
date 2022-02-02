function validateEmail(email) {
    if (!email)
        return  {
            error: 'email cannot be null',
            isError: true
        }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail=re.test(String(email).toLowerCase());    
    return  {
        error:  isEmail ?  null : `${email} is not valid email`, 
        isError: !isEmail
    }    
}

module.exports = {
    validateEmail
}