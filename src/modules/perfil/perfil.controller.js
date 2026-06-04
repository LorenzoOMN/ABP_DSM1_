const perfilService = require("./perfil.service");

async function getPerfil(req, res) {

    try {

        const idUsuario = req.usuario.id_usuario;

        const usuario = await perfilService.buscarPerfilUsuarioService(idUsuario);

        return res.status(200).json(usuario);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao buscar perfil"
        });
    }
}

async function atualizarConfiguracoes(req, res) {

    try {

        const idUsuario = req.usuario.id_usuario;

        const {
            musica_ativa,
            efeitos_ativos
        } = req.body;

        const resultado =
            await perfilService.salvarConfiguracoesAudioService(
                idUsuario,
                musica_ativa,
                efeitos_ativos
            );

        return res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro ao salvar configurações"
        });
    }
}

module.exports = {
    getPerfil,
    atualizarConfiguracoes
};