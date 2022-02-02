const db = require('./../db');

async function AddToken(tokenData) {
    
    const sql = 'INSERT INTO Tokens (UserId, Token, Expiration, Used) VALUES (?,?,?,?)';
    await fetch(sql, Object.values(tokenData));
}

async function getTokenInfo(token) {
    const sql = 'SELECT * FROM tokens WHERE Token=?';
    let result = await fetch(sql, token);
    
    return result;
}

fetch = (sql, par)=> {
    return new Promise((resolve, reject)=>{
        db.query(sql, par, (error, result)=> {
            if (error) return reject(error);
            return resolve(result);
        })
    })
}

module.exports = {
    AddToken,
    getTokenInfo
}