// carrega variáveis de ambiente do arquivo .env

const app = require("./app");
const env = require("./config/env");
const PORT = env.ports;

// inicia o servidor
app.listen(PORT, function () {
  console.log(`Rodando em http://localhost:${PORT}`);
});
