// src/modules/questoes/questoes.service.js

// Importa repositories
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
  findExameExistente,
  criarExameInicial,
  findTodasQuestoesDoExame,
  exameEstaConcluido,
  findExameById,
  findResultadoByExameId,
} = require("./questoes.repository");

const {
  registrarFalhaDesafio,
  avancarDesafio,
  findProgressoDesafio,
  historiaConcluida,
} = require("../progresso/progresso.repository");

// ============================================================================
// FUNÇÃO: OBTER PRÓXIMA QUESTÃO
// ============================================================================
async function getProximaQuestaoService(idUsuario) {
  if (!idUsuario) throw new Error("ID do usuário é obrigatório");

  const progresso = await findProgressoDesafio(idUsuario);
  if (!progresso) throw new Error("Progresso de desafio não encontrado");

  const historiaLiberada = await historiaConcluida(
    idUsuario,
    progresso.modulo_desafio_atual,
  );
  if (!historiaLiberada) {
    const error = new Error("História não concluída");
    error.code = "HISTORIA_NAO_CONCLUIDA";
    error.modulo = progresso.modulo_desafio_atual;
    throw error;
  }

  const questao = await findProximaQuestaoByUsuario(idUsuario);
  if (!questao) throw new Error("Nenhuma questão pendente encontrada");

  return {
    ...questao,
    imagem: questao.imagem ? `/assets/img/questoes/${questao.imagem}` : null,
};
}

// ============================================================================
// FUNÇÃO: RESPONDER QUESTÃO
// ============================================================================
async function responderQuestaoService(
  idUsuario,
  idExame,
  idQuestao,
  resposta,
) {
  if (!idUsuario || !idExame || !idQuestao) {
    throw new Error("ID do usuário, exame e questão são obrigatórios");
  }
  if (!resposta || resposta.trim() === "") {
    throw new Error("Resposta é obrigatória");
  }

  const respostaNormalizada = resposta.trim().toLowerCase();

  const questao = await findQuestaoDoExameByUsuario(
    idUsuario,
    idExame,
    idQuestao,
  );
  if (!questao) throw new Error("Questão não encontrada para este exame");

  const respostaExistente = await findRespostaByExameEQuestao(
    idExame,
    idQuestao,
  );
  if (respostaExistente) {
    const error = new Error("Questão já respondida");
    error.code = "QUESTAO_JA_RESPONDIDA";
    throw error;
  }

  const corretaNormalizada = String(questao.alternativa_correta)
    .trim()
    .toLowerCase();

  const correta = corretaNormalizada === respostaNormalizada;
  const nota = correta ? 1 : 0;

  await inserirRespostaQuestao(idExame, idQuestao, respostaNormalizada, nota);

  return {
    correta,
    nota,
    mensagem: correta ? "Resposta correta!" : "Resposta incorreta",
  };
}

// ============================================================================
// FUNÇÃO: OBTER PRÓXIMA TENTATIVA
// ============================================================================
async function getProximaTentativaService(idUsuario) {
  if (!idUsuario) throw new Error("ID do usuário é obrigatório");

  const concluido = await usuarioConcluiuModuloAtual(idUsuario);
  if (!concluido) throw new Error("Módulo atual não concluído");

  const modulo = await findModuloAtualByUsuario(idUsuario);
  if (!modulo) throw new Error("Módulo atual não encontrado");

  if (modulo.tentativa >= 2) {
    const error = new Error("Limite de tentativas atingido");
    error.code = "LIMITE_TENTATIVAS";
    throw error;
  }

  let grupo = await findOutroGrupoAleatorio(idUsuario, modulo.id_modulo);

  if (!grupo) {
    grupo = await findQualquerGrupoPorModulo(modulo.id_modulo);
  }

  if (!grupo) {
    throw new Error("Nenhum grupo encontrado para este módulo");
  }

  const exame = await updateProximaTentativa(
    modulo.id_exame,
    grupo,
    Number(modulo.tentativa) + 1,
  );
  if (!exame) throw new Error("Erro ao atualizar exame");

  return exame;
}

// ============================================================================
// FUNÇÃO: AVANÇAR PARA PRÓXIMO MÓDULO (LÓGICA COMPLEXA)
// ============================================================================
async function getProximoModuloService(idUsuario, idExame) {
  if (!idUsuario) throw new Error("ID do usuário é obrigatório");

  let moduloAtual, resultado;

  if (idExame) {
    const concluido = await exameEstaConcluido(idExame);
    if (!concluido) throw new Error("Módulo atual não concluído");

    moduloAtual = await findExameById(idExame);
    if (!moduloAtual) throw new Error("Módulo atual não encontrado");

    resultado = await findResultadoByExameId(idExame);
    if (!resultado) throw new Error("Resultado do módulo não encontrado");
  } else {
    // Caminho legado: usa o progresso atual
    const concluido = await usuarioConcluiuModuloAtual(idUsuario);
    if (!concluido) throw new Error("Módulo atual não concluído");

    moduloAtual = await findModuloAtualByUsuario(idUsuario);
    if (!moduloAtual) throw new Error("Módulo atual não encontrado");

    resultado = await findResultadoModuloAtual(idUsuario);
    if (!resultado) throw new Error("Resultado do módulo não encontrado");

    const progressoAtual = await findProgressoDesafio(idUsuario);
    if (!progressoAtual) throw new Error("Progresso de desafio não encontrado");

    if (
      Number(resultado.id_modulo) !==
      Number(progressoAtual.modulo_desafio_atual)
    ) {
      const error = new Error(
        "Inconsistência entre questionário e desafio atual",
      );
      error.code = "INCONSISTENCIA_MODULO";
      error.desafio_atual = progressoAtual.modulo_desafio_atual;
      error.modulo_resultado = resultado.id_modulo;
      throw error;
    }
  }

  // Fluxo: NÃO aprovado
  if (!resultado.aprovado_por_melhor_nota) {
    const progressoAtual = await findProgressoDesafio(idUsuario);
    return await _processarReprovacao(
      idUsuario,
      moduloAtual,
      resultado,
      progressoAtual,
    );
  }

  // Fluxo: Aprovado → avançar ou concluir
  return await _processarAprovacao(idUsuario, moduloAtual);
}

// ─────────────────────────────────────────────────────────────
async function _processarReprovacao(
  idUsuario,
  moduloAtual,
  resultado,
  progressoAtual,
) {
  const progressoAntes = await findProgressoDesafio(idUsuario);
  const progresso = await registrarFalhaDesafio(idUsuario);

  const resetouRun =
    progresso &&
    Number(progresso.modulo_desafio_atual) === 1 &&
    Number(progresso.falhas_no_modulo) === 0 &&
    Number(progressoAntes.falhas_no_modulo) >= 1;

  if (resetouRun) {
    return await _resetarRun(idUsuario, moduloAtual, resultado);
  }

  return await _novaTentativaModulo(
    idUsuario,
    moduloAtual,
    resultado,
    progresso,
  );
}

// ─────────────────────────────────────────────────────────────
async function _resetarRun(idUsuario, moduloAtual, resultado) {
  let grupoReset = await findOutroGrupoAleatorio(idUsuario, 1);

  if (!grupoReset) {
    grupoReset = await findQualquerGrupoPorModulo(1);
  }

  if (!grupoReset) {
    throw new Error("Nenhum grupo encontrado para reiniciar módulo 1");
  }

  const exameResetado = await criarExameInicial(idUsuario, 1, grupoReset);

  return {
    aprovado: false,
    resetou_run: true,
    message: "Você falhou 2 vezes. Sua run foi reiniciada para o módulo 1.",
    percentual: resultado.percentual,
    nota_minima: 70,
    exame: exameResetado,
  };
}

// ─────────────────────────────────────────────────────────────
async function _novaTentativaModulo(
  idUsuario,
  moduloAtual,
  resultado,
  progresso,
) {
  let grupo = await findOutroGrupoAleatorio(idUsuario, resultado.id_modulo);
  if (!grupo) grupo = await findQualquerGrupoPorModulo(resultado.id_modulo);
  if (!grupo) throw new Error("Nenhum grupo encontrado para este módulo");

  const novaTentativa = await updateProximaTentativa(
    moduloAtual.id_exame,
    grupo,
    Number(moduloAtual.tentativa) + 1,
  );

  return {
    aprovado: false,
    resetou_run: false,
    message: "Nota mínima não atingida. Você recebeu mais uma tentativa.",
    percentual: resultado.percentual,
    nota_minima: 70,
    exame: novaTentativa,
    progresso,
  };
}

// ─────────────────────────────────────────────────────────────
async function _processarAprovacao(idUsuario, moduloAtual) {
  const proximoModulo = await findProximoModuloByUsuario(idUsuario);

  if (!proximoModulo) {
    const progresso = await avancarDesafio(idUsuario);
    return {
      aprovado: true,
      certificado_liberado: true,
      message: "Você concluiu todos os módulos",
      progresso,
    };
  }

  let grupo = await findOutroGrupoAleatorio(idUsuario, proximoModulo);
  if (!grupo) grupo = await findQualquerGrupoPorModulo(proximoModulo);
  if (!grupo) throw new Error("Nenhum grupo encontrado para o próximo módulo");

  const exame = await updateProximoModulo(
    moduloAtual.id_exame,
    proximoModulo,
    grupo,
    1,
  );
  const progresso = await avancarDesafio(idUsuario);

  return {
    aprovado: true,
    message: "Desafio concluído com sucesso",
    exame,
    progresso,
  };
}

// ============================================================================
// FUNÇÕES SIMPLES (CRUD-style)
// ============================================================================
async function getModulosRespondidosService(idUsuario) {
  if (!idUsuario) throw new Error("ID do usuário é obrigatório");
  return await findModulosRespondidosByUsuario(idUsuario);
}

async function getResultadoAtualService(idUsuario) {
  if (!idUsuario) throw new Error("ID do usuário é obrigatório");
  const resultado = await findResultadoModuloAtual(idUsuario);
  if (!resultado) throw new Error("Resultado atual não encontrado");
  return resultado;
}

// ============================================================================
// FUNÇÃO: BUSCAR TODAS AS QUESTÕES DO EXAME ATUAL (para navegação local)
// ============================================================================
async function getTodasQuestoesService(idUsuario) {
  if (!idUsuario) throw new Error("ID do usuário é obrigatório");

  const progresso = await findProgressoDesafio(idUsuario);
  if (!progresso) throw new Error("Progresso de desafio não encontrado");

  const historiaLiberada = await historiaConcluida(
    idUsuario,
    progresso.modulo_desafio_atual,
  );
  if (!historiaLiberada) {
    const error = new Error("História não concluída");
    error.code = "HISTORIA_NAO_CONCLUIDA";
    error.modulo = progresso.modulo_desafio_atual;
    throw error;
  }

  const questoes = await findTodasQuestoesDoExame(idUsuario);
  if (!questoes || questoes.length === 0)
    throw new Error("Nenhuma questão encontrada para este exame");

  return questoes.map((q) => ({
    ...q,
    imagem: q.imagem ? `/assets/img/questoes/${q.imagem}` : null,
    // 'x' é resposta de questão pulada — não expõe como selecionada
    resposta_salva:
      q.resposta_salva === "x" ? "pulada" : q.resposta_salva || null,
    resposta_correta_salva: q.resposta_salva ? Number(q.nota_salva) > 0 : false,
  }));
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
  getProximaQuestaoService,
  responderQuestaoService,
  getProximaTentativaService,
  getProximoModuloService,
  getModulosRespondidosService,
  getResultadoAtualService,
  getTodasQuestoesService,
};
