// cria um token para o usuário.

const env = require("../config/env");

// importando as respectivas bibliotecas.
const path = require("path");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// configura o dotenv manualmente.
dotenv.config({
    quiet: true,
    path: path.resolve(__dirname, "..", "..", ".env"),
});

// cria o Token.
function createToken(payload) {
    return jwt.sign (
        payload,
        env.jwt.secret.JWT_SECRET,
        {expiresIn: env.jwt.expiresInSeconds}
    );
}

function verifyToken(token){
    return jwt.verify(token, process.env.JWT_SECRET);
}

// exportando a respectiva função para outros arquivos.
module.exports = {
    createToken,
    verifyToken
};