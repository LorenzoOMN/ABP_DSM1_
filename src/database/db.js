// importa o Pool de conexões da biblioteca pg.
const { Pool } = require("pg");

const env = require("../config/env");

// montando um objeto de configuração do banco de dados usando variáveis do .env
const config = {
    host: env.database.host,
    user: env.database.user,
    password: env.database.password,
    database: env.database.database,
    port: env.database.port,
};

// cria a conexão com o banco usando o pool com as configurações definidas acima.
const pool = new Pool (config);

// exporta o "router" para outros arquivos.
module.exports = pool;
