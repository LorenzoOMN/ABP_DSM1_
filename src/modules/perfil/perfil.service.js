const perfilRepository = require("./perfil.repository");

async function buscarPerfilUsuarioService(idUsuario) {

    const usuario = await perfilRepository.buscarPerfilUsuario(idUsuario);

    if (!usuario) {
        throw new Error("Usuário não encontrado");
    }

    return usuario;
}

async function salvarConfiguracoesAudioService(idUsuario, musicaAtiva, efeitosAtivos) {

    return perfilRepository.salvarConfiguracoesAudio(
        idUsuario,
        musicaAtiva,
        efeitosAtivos
    );
}

module.exports = {
    buscarPerfilUsuarioService,
    salvarConfiguracoesAudioService
};