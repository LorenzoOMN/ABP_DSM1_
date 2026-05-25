// cria um token para o usuário.

const env = require("../config/env");

// importando as respectivas bibliotecas.
const jwt = require("jsonwebtoken");

// cria o Token.
function createToken(payload) {
    return jwt.sign(
        payload,
        env.jwt.secret,
        { expiresIn: env.jwt.expiresInSeconds }
    );
}

function verifyToken(token) {
    return jwt.verify(token, env.jwt.secret);
}

// exportando a respectiva função para outros arquivos.
module.exports = {
    createToken,
    verifyToken
};