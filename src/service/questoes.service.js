//importando funções
const {
    findProximaQuestaoByUsuario,
    findQuestaoDoExameByUsuario,
    findRespostaByExameEQuestao,
    inserirRespostaQuestao,
    usuarioConcluiuModuloAtual,
    findModuloAtualByUsuario,
    findOutroGrupoAleatorio,
    findProximoModuloByUsuario,
    updateProximaTentativa,
    updateProximoModulo,
    findModulosRespondidosByUsuario,
    findResultadoModuloAtual,
    findQualquerGrupoPorModulo,
} = require("../repositories/questoes.repositories");

const { findProgressoDesafio } = require("../repositories/progresso.repositories");

async function buscarProximaQuestao(idUsuario) {
    const questao = await findProximaQuestaoByUsuario(idUsuario);
    if (!questao) {
        return null;
    }

    return ({
        ...questao,
        imagem: questao.imagem ? `/imagens/questoes/${questao.imagem}` : null,
    });
}

async function responderQuestao(idUsuario, idExame, idQuestao, resposta) {
    const respostaNormalizada = resposta.trim().toLowerCase();

    const questao = await findQuestaoDoExameByUsuario(
        idUsuario,
        idExame,
        idQuestao,
    );
    if (!questao) {
        return {
            status: "questao-nao-encontrada",
        };
    }

    const respostaExistente = await findRespostaByExameEQuestao(
        idExame,
        idQuestao,
    );
    if (respostaExistente) {
        return {
            status: "questao-ja-respondida",
        };
    }

    const correta = questao.alternativa_correta === respostaNormalizada;
    const nota = correta ? 1 : 0;
    const respostaInserida = await inserirRespostaQuestao(
        idExame,
        idQuestao,
        respostaNormalizada,
        nota,
    );

    return {
        status: "respondida",
        resposta: respostaInserida
    };
};

async function iniciarProximaTentativa(idUsuario) {
    const concluido = await usuarioConcluiuModuloAtual(idUsuario);
    if (!concluido) {
        return {
            status: "modulo-nao-concluido",
        };
    }

    const modulo = await findModuloAtualByUsuario(idUsuario);
    if (!modulo) {
        return ({
            status: "modulo-atual-nao-encontrado",
        });
    }

    if (modulo.tentativa >= 2) {
        return {
            status: "limite-tentativas",
        };
    }

    const grupo = await findOutroGrupoAleatorio(
        idUsuario,
        modulo.id_modulo,
    );
    if (!grupo) {
        return {
            status: "grupo-alternativo-nao-encontrado",
        };
    }

    const exame = await updateProximaTentativa(
        modulo.id_exame,
        grupo,
        modulo.tentativa + 1,
    );
    if (!exame) {
        return {
            status: "exame-nao-encontrado",
        };
    }

    return {
        status: "atualizado",
        exame
    };
};

async function iniciarProximoModulo(idUsuario) {
    const concluido = await usuarioConcluiuModuloAtual(idUsuario);
    if (!concluido) {
        return {
            status: "modulo-nao-concluido",
        };
    }

    const moduloAtual = await findModuloAtualByUsuario(idUsuario);
    if (!moduloAtual) {
        return {
            status: "modulo-atual-nao-encontrado",
        };
    }

    const resultado = await findResultadoModuloAtual(idUsuario);
    if (!resultado) {
        return {
            status: "resultado-modulo-atual-nao-encontrado",
        };
    }

    const progressoAtual = await findProgressoDesafio(idUsuario);
    if (!progressoAtual) {
        return {
            status: "progresso-desafio-nao-encontrado",
        };
    }

    const proximoModulo = await findProximoModuloByUsuario(idUsuario);

    if (!proximoModulo) {
        return {
            status: "todos-modulos-concluidos"
        };
    }

    let grupo = await findOutroGrupoAleatorio(
        idUsuario,
        proximoModulo,
    );

    if (!grupo) {
        grupo = await findQualquerGrupoPorModulo(proximoModulo);
    }

    const exame = await updateProximoModulo(
        moduloAtual.id_exame,
        proximoModulo,
        grupo,
        1,
    );
    if (!exame) {
        return {
            status: "exame-nao-encontrado"
        }
    };

    return {
        status: "atualizado",
        exame
    };
};

async function listarModulosRespondidos(idUsuario) {
    return findModulosRespondidosByUsuario(idUsuario);
};

async function mostrarResultadoAtual(idUsuario) {
    return findResultadoModuloAtual(idUsuario)
};

module.exports = {
    buscarProximaQuestao,
    responderQuestao,
    iniciarProximaTentativa,
    iniciarProximoModulo,
    listarModulosRespondidos,
    mostrarResultadoAtual,
};