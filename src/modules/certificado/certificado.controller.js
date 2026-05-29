// src/modules/certificados/certificado.controller.js

// Importa apenas o SERVICE (nunca repository direto)
const { buscarCertificadoPorHash, buscarDesempenho } = require("./certificado.service");

// ============================================================================
// CONTROLLER: BUSCAR CERTIFICADO POR HASH (ROTA PÚBLICA)
// ============================================================================
async function hashController(req, res) {
    // 1️⃣ Controller PEGA os dados da requisição (params, query, body)
    const certificadoHash = String(req.params.hash || "").trim();

    try {
        // 2️⃣ Controller CHAMA o Service
        const certificado = await buscarCertificadoPorHash(certificadoHash);

        // 3️⃣ Controller DEVOLVE a resposta HTTP
        return res.status(200).json(certificado);

    } catch (error) {
        // 4️⃣ Controller TRADUZ erros de negócio para HTTP

        // Erro de validação ou certificado não encontrado
        if (error.message.includes("obrigatório") ||
            error.message.includes("inexistente")) {
            return res.status(404).json({ message: error.message });
        }

        // Certificado existe mas está indisponível
        if (error.message.includes("indisponível") ||
            error.message.includes("suspenso") ||
            error.message.includes("cancelado")) {
            return res.status(409).json({ message: error.message });
        }

        // Erro inesperado
        console.error("Erro ao buscar certificado:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: BUSCAR DESEMPENHO (ROTA PROTEGIDA)
// ============================================================================
async function desempenhoController(req, res) {
    // 1️⃣ Controller PEGA o usuário do middleware de auth
    // req.usuario foi injetado pelo authMiddleware
    const idUsuario = req.usuario?.id_usuario;

    // Validação básica de presença (pode ser feita no service também)
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        // 2️⃣ Controller CHAMA o Service
        const desempenho = await buscarDesempenho(idUsuario);

        // 3️⃣ Controller DEVOLVE a resposta HTTP
        // Se desempenho for null, decide se retorna 404 ou dados vazios
        if (!desempenho) {
            return res.status(404).json({ message: "Desempenho não encontrado" });
        }

        return res.status(200).json(desempenho);

    } catch (error) {
        // 4️⃣ Controller TRADUZ erros de negócio para HTTP

        if (error.message.includes("obrigatório")) {
            return res.status(400).json({ message: error.message });
        }

        // Erro inesperado
        console.error("Erro ao buscar desempenho:", error);
        return res.status(500).json({ message: "Erro ao buscar desempenho do certificado" });
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    hashController,
    desempenhoController
};