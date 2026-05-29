// src/modules/progresso/progresso.controller.js

// Importa apenas o SERVICE do módulo progresso
const { getProgressoMapaService, concluirHistoriaService } = require('./progresso.service');

// ============================================================================
// CONTROLLER: OBTER PROGRESSO DO MAPA (ROTA PROTEGIDA)
// ============================================================================
async function getProgressoMapa(req, res) {
    // 1️⃣ Controller PEGA o usuário do middleware de auth
    const idUsuario = req.usuario?.id_usuario;

    // Validação de segurança
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        // 2️⃣ Controller CHAMA o Service
        const progresso = await getProgressoMapaService(idUsuario);

        // 3️⃣ Controller DEVOLVE a resposta HTTP
        return res.status(200).json(progresso);

    } catch (error) {
        // 4️⃣ Controller TRADUZ erros de negócio para HTTP
        if (error.message.includes("obrigatório")) {
            return res.status(400).json({ message: error.message });
        }

        // Erro inesperado
        console.error("Erro ao buscar progresso do mapa:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: CONCLUIR HISTÓRIA (ROTA PROTEGIDA)
// ============================================================================
async function concluirHistoriaController(req, res) {
    // 1️⃣ Controller PEGA e VALIDA dados da requisição (validação de entrada)
    const idUsuario = req.usuario?.id_usuario;
    const idModuloParam = req.params.idModulo;

    // Validação básica de entrada (formato, não regra de negócio)
    const idModulo = Number(idModuloParam);
    if (!idModuloParam || isNaN(idModulo) || idModulo <= 0) {
        return res.status(400).json({ message: "ID do módulo inválido" });
    }

    // Validação de segurança
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        // 2️⃣ Controller CHAMA o Service (passa dados já validados)
        const resultado = await concluirHistoriaService(idUsuario, idModulo);

        // 3️⃣ Controller DEVOLVE a resposta HTTP
        return res.status(200).json({
            message: resultado.message,
            progresso: resultado.progresso,
            exame_criado: resultado.exame_criado // Info extra útil para o frontend
        });

    } catch (error) {
        // 4️⃣ Controller TRADUZ erros de negócio para HTTP

        // Erros de validação de negócio
        if (error.message.includes("obrigatório") ||
            error.message.includes("inválido")) {
            return res.status(400).json({ message: error.message });
        }

        // Erro inesperado
        console.error("Erro ao concluir história:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    getProgressoMapa,
    concluirHistoriaController
};