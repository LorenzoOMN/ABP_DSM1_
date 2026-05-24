// importa as variáveis de ambiente
const env = require("./shared/config/env");
// inicializa o express
const app = require("./app");

// importa a porta do arquivo de configuração de ambiente
const PORT = env.PORT;

// inicia o servidor
app.listen(PORT, function () {
    console.log(`Rodando em http://localhost:${PORT}`);
});