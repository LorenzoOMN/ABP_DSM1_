// importa as variáveis de ambiente
const env = require("../config/env");
// importa a biblioteca Path para lidar com caminhos de arquivos
const { Pool } = require("pg");

// montando um objeto de configuração do banco de dados usando variáveis do .env
function resolverSsl() {
    if (env.database.ssl === "false") return false;

    if (env.database.ssl === "true" || process.env.NODE_ENV === "production") {
        return { rejectUnauthorized: false };
    }

    return false;
}

const config = env.database.url
    ? {
        connectionString: env.database.url,
        ssl: resolverSsl(),
    }
    : {
        host: env.database.host,
        user: env.database.user,
        password: env.database.password,
        database: env.database.database,
        port: env.database.port,
        ssl: resolverSsl(),
    };

// cria a conexão com o banco usando o pool com as configurações definidas acima.
const pool = new Pool (config);

// exporta o "router" para outros arquivos.
module.exports = pool;
