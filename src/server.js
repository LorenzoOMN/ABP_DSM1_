// src/server.js

// importa as variáveis de ambiente
const env = require("./shared/config/env");

// importa o pool de conexão com o banco 👈 ADICIONE ISSO
const pool = require("./shared/database/db");

// inicializa o express
const app = require("./app");

// importa a porta do arquivo de configuração de ambiente
const PORT = env.PORT;

// Função que roda UMA VEZ ao iniciar o servidor
async function sincronizarSequenceQuestoes() {
  try {
    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('questoes', 'id_questao'),
        COALESCE((SELECT MAX(id_questao) FROM questoes), 0) + 1,
        false
      );
    `);
    console.log('✅ Sequence de questões sincronizado automaticamente.');
  } catch (err) {
    console.warn('⚠️ Aviso: Não foi possível sincronizar o sequence no startup.');
  }
}

// Chama a correção antes de liberar o servidor
sincronizarSequenceQuestoes();

// inicia o servidor
app.listen(PORT, function () {
    console.log(`Rodando em http://localhost:${PORT}`);
});