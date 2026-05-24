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
      id_exame,
      id_questao,
    );
}

module.exports = {
    buscarProximaQuestao,
    responderQuestao,
};