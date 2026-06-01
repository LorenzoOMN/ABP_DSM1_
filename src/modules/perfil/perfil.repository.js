const { 
    findUsuarioById,
    updateConfiguracoesAudio 
} = require("../usuarios/usuarios.repository");
const {
  findProgressoDesafio
} = require("../progresso/progresso.repository");

async function buscarPerfilUsuario(idUsuario) {

  const usuario = await findUsuarioById(idUsuario);

  const progresso = await findProgressoDesafio(idUsuario);

  return {
    ...usuario,
    progresso
  };
}

async function salvarConfiguracoesAudio(idUsuario, musicaAtiva, efeitosAtivos) {
    
    return updateConfiguracoesAudio(
        idUsuario,
        musicaAtiva,
        efeitosAtivos
    );
}

module.exports = {
  buscarPerfilUsuario,
  salvarConfiguracoesAudio
};