//importando funções
const { buscarProximaQuestao, responderQuestao, iniciarProximaTentativa, iniciarProximoModulo, listarModulosRespondidos, mostrarResultadoAtual } = require("../service/questoes.service");

const { findQuestaoDoExameByUsuario } = require("../repositories/questoes.repositories");

const { 
  findProgressoDesafio,
    historiaConcluida,
  registrarFalhaDesafio,
  avancarDesafio,
 } = require("../repositories/progresso.repositories");

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
    const questao = await buscarProximaQuestao(req.usuario.id_usuario);

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

    if (!resposta) {
      return res.status(400).json({ message: "resposta obrigatória" });
    }

    const respostaNormalizada = resposta.trim().toLowerCase();
    
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
    const result = await iniciarProximoModulo(req.usuario.id_usuario);

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

    if (result.status === "todos-modulos-concluidos") {
      return res.status(200).json({
        aprovado: true,
        certificado_liberado: true,
        message: "você concluiu todos os módulos",
      });
    }

    if (result.status === "exame-nao-encontrado") {
      return res.status(404).json({
        message: "exame não encontrado",
      });
    }

    return res.status(200).json(result);

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