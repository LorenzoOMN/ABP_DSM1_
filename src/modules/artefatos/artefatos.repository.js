// importando a conexão com o banco de dados.
const pool = require("../../shared/database/db");


// Busca todos os artefatos verificando quais estão desbloqueados para o usuário
// @param {number} idUsuario - ID do usuário logado
// @returns {Promise<Array>} - Lista de artefatos com flag de desbloqueio
async function buscarArtefatosPorUsuario(idUsuario) {
  const result = await pool.query(
    `
    SELECT 
      a.id,
      a.titulo,
      a.descricao_curta,
      a.conteudo_longo,
      a.imagem_url,
      a.capitulo_requisito,
      CASE 
        WHEN ph.id_modulo IS NOT NULL THEN true 
        ELSE false 
      END as desbloqueado
    FROM artefatos a
    LEFT JOIN progresso_historia ph 
      ON ph.id_modulo = a.capitulo_requisito 
      AND ph.id_usuario = $1
      AND ph.concluido = true
    ORDER BY a.capitulo_requisito ASC
    `,
    [idUsuario],
  );

  return result.rows || [];
}

// Busca um artefato específico pelo ID, verificando se está desbloqueado
// @param {number} idUsuario - ID do usuário logado
// @param {number} idArtefato - ID do artefato desejado
// @returns {Promise<Object|null>} - Dados do artefato ou null se não existir
async function buscarArtefatoPorId(idUsuario, idArtefato) {
  const result = await pool.query(
    `
    SELECT 
      a.id,
      a.titulo,
      a.descricao_curta,
      a.conteudo_longo,
      a.imagem_url,
      a.capitulo_requisito,
      CASE 
        WHEN ph.id_modulo IS NOT NULL THEN true 
        ELSE false 
      END as desbloqueado
    FROM artefatos a
    LEFT JOIN progresso_historia ph 
      ON ph.id_modulo = a.capitulo_requisito 
      AND ph.id_usuario = $1
      AND ph.concluido = true
    WHERE a.id = $2
    `,
    [idUsuario, idArtefato],
  );

  return result.rows[0] || null;
}

// exportando as funções para outros arquivos.
module.exports = {
  buscarArtefatosPorUsuario,
  buscarArtefatoPorId,
};