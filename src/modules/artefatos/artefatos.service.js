// importando o repositório de artefatos.
const artefatosRepository = require("./artefatos.repository");

// Orquestra a busca de artefatos aplicando regras de negócio (se houver)
// @param {number} idUsuario - ID do usuário logado
// @returns {Promise<Array>} - Lista de artefatos processada
async function listarArtefatosDoUsuario(idUsuario) {
  // Aqui você poderia filtrar, ordenar ou transformar os dados
  // Antes de enviar para o controller.
  // Exemplo: if (artefato.desbloqueado) { ... }
  
  const artefatos = await artefatosRepository.buscarArtefatosPorUsuario(idUsuario);
  
  return artefatos;
}

// Orquestra a busca de um artefato específico
// @param {number} idUsuario 
// @param {number} idArtefato 
// @returns {Promise<Object|null>} 
async function obterArtefato(idUsuario, idArtefato) {
  return await artefatosRepository.buscarArtefatoPorId(idUsuario, idArtefato);
}

// exportando as funções para outros arquivos.
module.exports = {
  listarArtefatosDoUsuario,
  obterArtefato,
};