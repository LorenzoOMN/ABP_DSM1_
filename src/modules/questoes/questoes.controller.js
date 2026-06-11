// src/modules/questoes/questoes.controller.js

// Importa apenas o SERVICE
const { getProximaQuestaoService,
    responderQuestaoService,
    getProximaTentativaService,
    getProximoModuloService,
    getModulosRespondidosService,
    getResultadoAtualService,
    getStatusAtualService,
    getTodasQuestoesService } = require('./questoes.service');

// ============================================================================
// CONTROLLER: OBTER PRÓXIMA QUESTÃO
// ============================================================================
async function getProximaQuestao(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const questao = await getProximaQuestaoService(idUsuario);
        return res.status(200).json(questao);
    } catch (error) {
        if (error.message === "Progresso de desafio não encontrado" ||
            error.message === "Nenhuma questão pendente encontrada") {
            return res.status(404).json({ message: error.message });
        }
        if (error.code === "HISTORIA_NAO_CONCLUIDA") {
            return res.status(403).json({
                message: "Você precisa concluir a história antes de acessar o desafio deste módulo",
                modulo: error.modulo
            });
        }
        console.error("Erro em getProximaQuestao:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: RESPONDER QUESTÃO
// ============================================================================
async function responderQuestao(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const { id_exame, id_questao, resposta } = req.body;

    // Validação básica de entrada (formato)
    if (!id_exame || !id_questao) {
        return res.status(400).json({ message: "ID do exame e questão são obrigatórios" });
    }

    try {
        const resultado = await responderQuestaoService(
            idUsuario, id_exame, id_questao, resposta
        );
        return res.status(201).json(resultado);
    } catch (error) {
        if (error.message.includes("obrigatório")) {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Questão não encontrada para este exame") {
            return res.status(404).json({ message: error.message });
        }
        if (error.code === "QUESTAO_JA_RESPONDIDA") {
            return res.status(409).json({ message: error.message });
        }
        console.error("Erro em responderQuestao:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: OBTER PRÓXIMA TENTATIVA
// ============================================================================
async function getProximaTentativa(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const exame = await getProximaTentativaService(idUsuario);
        return res.status(200).json(exame);
    } catch (error) {
        if (error.message === "Módulo atual não concluído") {
            return res.status(409).json({ message: error.message });
        }
        if (error.message === "Módulo atual não encontrado" ||
            error.message === "Nenhum grupo alternativo disponível") {
            return res.status(404).json({ message: error.message });
        }
        if (error.code === "LIMITE_TENTATIVAS") {
            return res.status(409).json({ message: error.message });
        }
        console.error("Erro em getProximaTentativa:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: AVANÇAR PARA PRÓXIMO MÓDULO (COMPLEXO)
// ============================================================================
async function getProximoModulo(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // id_exame pode vir no body para validação precisa (evita problemas após reset)
    const idExame = req.body?.id_exame || null;

    try {
        const resultado = await getProximoModuloService(idUsuario, idExame);
        return res.status(200).json(resultado);
    } catch (error) {
        // Mapeamento de erros de negócio → HTTP
        if (error.message === "Módulo atual não concluído" ||
            error.message === "Nota mínima não atingida") {
            return res.status(409).json({ message: error.message });
        }
        if (error.message.includes("não encontrado")) {
            return res.status(404).json({ message: error.message });
        }
        if (error.code === "INCONSISTENCIA_MODULO") {
            return res.status(409).json({
                message: error.message,
                desafio_atual: error.desafio_atual,
                modulo_resultado: error.modulo_resultado
            });
        }
        console.error("Erro em getProximoModulo:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLERS SIMPLES (CRUD-style)
// ============================================================================
async function getModulosRespondidos(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const modulos = await getModulosRespondidosService(idUsuario);
        return res.status(200).json(modulos);
    } catch (error) {
        console.error("Erro em getModulosRespondidos:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function getResultadoAtual(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const resultado = await getResultadoAtualService(idUsuario);
        return res.status(200).json(resultado);
    } catch (error) {
        if (error.message === "Resultado atual não encontrado") {
            return res.status(404).json({ message: error.message });
        }
        console.error("Erro em getResultadoAtual:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function getStatusAtual(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) {
        return res.status(401).json({ message: "UsuÃ¡rio nÃ£o autenticado" });
    }

    try {
        const status = await getStatusAtualService(idUsuario);
        return res.status(200).json(status);
    } catch (error) {
        console.error("Erro em getStatusAtual:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}


// ============================================================================
// CONTROLLER: BUSCAR TODAS AS QUESTÕES DO EXAME (para navegação local)
// ============================================================================
async function getTodasQuestoes(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const questoes = await getTodasQuestoesService(idUsuario);
        return res.status(200).json(questoes);
    } catch (error) {
        if (error.message === "Progresso de desafio não encontrado" ||
            error.message === "Nenhuma questão encontrada para este exame") {
            return res.status(404).json({ message: error.message });
        }
        if (error.code === "HISTORIA_NAO_CONCLUIDA") {
            return res.status(403).json({
                message: "Você precisa concluir a história antes de acessar o desafio deste módulo",
                modulo: error.modulo
            });
        }
        console.error("Erro em getTodasQuestoes:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    getProximaQuestao,
    responderQuestao,
    getProximaTentativa,
    getProximoModulo,
    getModulosRespondidos,
    getResultadoAtual,
    getStatusAtual,
    getTodasQuestoes,
};
