//importando funções
const { buscarProximaQuestao, responderQuestao, iniciarProximaTentativa, iniciarProximoModulo, listarModulosRespondidos, mostrarResultadoAtual } = require("../service/questoes.service");

async function getProximaQuestaoController(req, res) {
  try {
    const progresso = await findProgressoDesafio(req.usuario.id_usuario);

    if (!progresso) {
      return res.status(404).json({
        message: "progresso de desafio não encontrado",
      });
    }

    const historiaLiberada = await historiaConcluida(
      req.usuario.id_usuario,
      progresso.modulo_desafio_atual,
    );

    if (!historiaLiberada) {
      return res.status(403).json({
        message:
          "você precisa concluir a história antes de acessar o desafio deste módulo",
        modulo: progresso.modulo_desafio_atual,
      });
    }
    const result = await buscarProximaQuestao(req.usuario.id_usuario);

    if (!questao) {
      return res
        .status(404)
        .json({ message: "nenhuma questão pendente encontrada" });
    }

    return res.status(200).json(questao);
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
}

async function responderQuestaoController(req, res) {
  try {
    console.log("body", req.body);
    const { id_exame, id_questao, resposta } = req.body;

    const result = await responderQuestao(
      req.usuario.id_usuario,
      id_exame,
      id_questao,
      resposta
    );

    const respostaNormalizada = resposta.trim().toLowerCase();
    if (!resposta) {
      return res.status(400).json({ message: "resposta obrigatória" });
    }

    const questao = await findQuestaoDoExameByUsuario(
      req.usuario.id_usuario,
      id_exame,
      id_questao,
    );
    if (result.status === "questao-nao-encontrada") {
        return res.status(404).json({
            message: "questão não encontrada para esse exame",
        })
    }

    if (result.status === "questao-ja-respondida") {
        return res.status(409).json({
            message: "questão já respondida",
        })
    }

    return res.status(201).json(result.resposta);
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
}

async function proximaTentativaController(req, res) {
 try {
    const result = await iniciarProximaTentativa(req.usuario.id_usuario);
    
    if (result.status === "modulo-nao-concluido") {
      return res.status(409).json({
        message: "você ainda não concluiu todas as questões do módulo atual",
      });
    }

    if (result.status === "modulo-atual-nao-encontrado") {
      return res.status(404).json({
        message: "módulo atual não encontrado",
      });
    }

    if (result.status === "limite-tentativas") {
      return res.status(409).json({
        message: "limite de 2 tentativas atingido",
      });
    }

    if (result.status === "grupo-alternativo-nao-encontrado") {
      return res.status(404).json({
        message: "nenhum grupo alternativo disponível para este módulo",
      });
    }

    const exame = await updateProximaTentativa(
      modulo.id_exame,
      grupo,
      modulo.tentativa + 1,
    );
    if (result.status === "exame-nao-encontrado") {
      return res.status(404).json({
        message: "exame não encontrado para atualização",
      });
    }

    return res.status(200).json(result.exame);
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
}

async function proximoModuloController(req, res) {
  try {
    const idUsuario = req.usuario.id_usuario;
    const result = await iniciarProximoModulo(idUsuario);

    if (result.status === "modulo-nao-concluido") {
      return res.status(409).json({
        message: "você ainda não concluiu todas as questões do módulo atual",
      });
    }

    if (result.status === "modulo-atual-nao-encontrado") {
      return res.status(404).json({
        message: "módulo atual não encontrado",
      });
    }

    if (result.status === "resultado-modulo-atual-nao-encontrado") {
      return res.status(404).json({
        message: "resultado do módulo atual não encontrado",
      });
    }

    if (result.status === "progresso-desafio-nao-encontrado") {
      return res.status(404).json({
        message: "progresso de desafio não encontrado",
      });
    }

    if (
      Number(resultado.id_modulo) !==
      Number(progressoAtual.modulo_desafio_atual)
    ) {
      return res.status(409).json({
        message: "este questionário não corresponde ao desafio atual da run",
        desafio_atual: progressoAtual.modulo_desafio_atual,
        modulo_resultado: resultado.id_modulo,
      });
    }

    if (!resultado.aprovado) {
      const progressoAntes = await findProgressoDesafio(idUsuario);

      const progresso = await registrarFalhaDesafio(idUsuario);

      const resetouRun =
        progresso &&
        Number(progresso.modulo_desafio_atual) === 1 &&
        Number(progresso.falhas_no_modulo) === 0 &&
        Number(progressoAntes.falhas_no_modulo) >= 1;

      if (resetouRun) {
        let grupoReset = await findOutroGrupoAleatorio(idUsuario, 1);

        if (!grupoReset) {
          grupoReset = await findQualquerGrupoPorModulo(1);
        }

        if (!grupoReset) {
          return res.status(404).json({
            message:
              "nenhum grupo de questões encontrado para reiniciar o módulo 1",
          });
        }

        const exameResetado = await updateProximoModulo(
          moduloAtual.id_exame,
          1,
          grupoReset,
          1,
        );

        return res.status(200).json({
          aprovado: false,
          resetou_run: true,
          message:
            "Você falhou 2 vezes. Sua run foi reiniciada para o módulo 1.",
          percentual: resultado.percentual,
          nota_minima: 70,
          exame: exameResetado,
          progresso,
        });
      }
      let grupoNovaTentativa = await findOutroGrupoAleatorio(
        idUsuario,
        resultado.id_modulo,
      );

      if (!grupoNovaTentativa) {
        grupoNovaTentativa = await findQualquerGrupoPorModulo(
          resultado.id_modulo,
        );
      }

      if (!grupoNovaTentativa) {
        return res.status(404).json({
          message: "nenhum grupo de questões encontrado para este módulo",
        });
      }

      const novaTentativa = await updateProximaTentativa(
        moduloAtual.id_exame,
        grupoNovaTentativa,
        Number(moduloAtual.tentativa) + 1,
      );

      return res.status(200).json({
        aprovado: false,
        resetou_run: false,
        message: "nota mínima não atingida. Você recebeu mais uma tentativa.",
        percentual: resultado.percentual,
        nota_minima: 70,
        exame: novaTentativa,
        progresso,
      });
    }

    if (result.status === "todos-modulos-concluidos") {
      const progresso = await avancarDesafio(idUsuario);

      return res.status(200).json({
        aprovado: true,
        certificado_liberado: true,
        message: "você concluiu todos os módulos",
        progresso,
      });
    }

    let grupo = await findOutroGrupoAleatorio(idUsuario, proximoModulo);

if (!grupo) {
  grupo = await findQualquerGrupoPorModulo(proximoModulo);
}

if (!grupo) {
  return res.status(404).json({
    message: "nenhum grupo de questões encontrado para o próximo módulo",
  });
}

if (result.status === "exame-nao-encontrado") {
    return res.status(404).json({
        message: "exame não encontrado para atualizações"
    })
};

const progresso = await avancarDesafio(idUsuario);

    return res.status(200).json({
      aprovado: true,
      message: "desafio concluído com sucesso",
      exame,
      progresso,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
}

async function getModulosRespondidosController(req, res) {
  try {
    const modulos = await listarModulosRespondidos(req.usuario.id_usuario);
    
    return res.status(200).json(modulos);
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
}

async function getResultadoAtualController(req, res) {
  try {
    const resultado = await mostrarResultadoAtual(req.usuario.id_usuario);

    if (!resultado) {
      return res.status(404).json({
        message: "resultado atual não encontrado",
      });
    }

    return res.status(200).json(resultado);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
}

module.exports = {
    getProximaQuestaoController,
    responderQuestaoController,
    proximaTentativaController,
    proximoModuloController,
    getModulosRespondidosController,
    getResultadoAtualController,
}