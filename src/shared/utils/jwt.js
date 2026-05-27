// cria um token para o usuário.
// Importa as variáveis de ambiente
const env = require("../config/env");
// importa a biblioteca jsonwebtoken para criar e verificar tokens JWT
const jwt = require("jsonwebtoken");

// cria o Token.
function createToken(payload) {
    return jwt.sign (
        payload,
        env.jwt.secret,
        {expiresIn: env.jwt.expiresInSeconds}
    );
}

function verifyToken(token){
    return jwt.verify(token, env.jwt.secret);
}

// exportando a respectiva função para outros arquivos.
module.exports = {
    createToken,
    verifyToken
};