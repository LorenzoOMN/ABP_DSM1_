// importando a conexão com o banco de dados.
const pool = require("../../shared/database/db");

/**
 * Busca todos os artefatos verificando quais estão desbloqueados para o usuário
 * @param {number|null} idUsuario - ID do usuário logado (ou null para visitante)
 * @returns {Promise<Array>} - Lista de artefatos com flag de desbloqueio
 */
async function buscarArtefatosPorUsuario(idUsuario) {
  const sql = `
    SELECT 
      a.id,
      a.titulo,
      a.descricao_curta,
      a.conteudo_longo,
      a.imagem,              -- ← CORREÇÃO: era 'imagem_url', agora é 'imagem'
      a.capitulo_requisito,
      CASE 
        WHEN $1 IS NOT NULL AND ph.id_modulo IS NOT NULL THEN true 
        ELSE false 
      END as desbloqueado
    FROM artefatos a
    LEFT JOIN progresso_historia ph 
      ON ph.id_modulo = a.capitulo_requisito 
      AND ph.id_usuario = $1
      AND ph.concluido = true
    ORDER BY a.capitulo_requisito ASC
  `;
  
  const result = await pool.query(sql, [idUsuario || null]);
  return result.rows || [];
}

/**
 * Busca um artefato específico pelo ID
 * @param {number|null} idUsuario 
 * @param {number} idArtefato 
 * @returns {Promise<Object|null>}
 */
async function buscarArtefatoPorId(idUsuario, idArtefato) {
  const sql = `
    SELECT 
      a.id,
      a.titulo,
      a.descricao_curta,
      a.conteudo_longo,
      a.imagem,              -- ← CORREÇÃO: era 'imagem_url', agora é 'imagem'
      a.capitulo_requisito,
      CASE 
        WHEN $1 IS NOT NULL AND ph.id_modulo IS NOT NULL THEN true 
        ELSE false 
      END as desbloqueado
    FROM artefatos a
    LEFT JOIN progresso_historia ph 
      ON ph.id_modulo = a.capitulo_requisito 
      AND ph.id_usuario = $1
      AND ph.concluido = true
    WHERE a.id = $2
  `;
  
  const result = await pool.query(sql, [idUsuario || null, idArtefato]);
  return result.rows[0] || null;
}

// exportando as funções para outros arquivos.
module.exports = {
  buscarArtefatosPorUsuario,
  buscarArtefatoPorId,
};