// src/modules/auth/auth.controller.js

// Importa apenas o SERVICE (nunca repository direto)
const { login, cadastro } = require("./auth.service");

// ============================================================================
// CONTROLLER: LOGIN
// ============================================================================
async function loginController(req, res) {
    // 1️⃣ Controller PEGA os dados da requisição
    const { senha } = req.body;
    const cpf = String(req.body.cpf || "")
        .replace(/\D/g, "")
        .slice(0, 11);

    try {
        // 2️⃣ Controller CHAMA o Service (passa dados simples)
        const resultado = await login(cpf, senha);

        // 3️⃣ Controller DEVOLVE a resposta HTTP
        return res.status(200).json(resultado);

    } catch (error) {
        // 4️⃣ Controller TRADUZ erros de negócio para HTTP
        if (error.message === "CPF e senha são obrigatórios" ||
            error.message === "CPF deve conter 11 números") {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === "Usuário não encontrado" ||
            error.message === "Senha incorreta") {
            return res.status(401).json({ message: error.message });
        }

        // Erro inesperado
        console.error("Erro no login:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
}

// ============================================================================
// CONTROLLER: CADASTRO (NOVO!)
// ============================================================================
async function cadastroController(req, res) {
    // 1 Controller PEGA os dados da requisição
    const { nome, email, senha } = req.body;
    const cpf = String(req.body.cpf || "")
        .replace(/\D/g, "")
        .slice(0, 11);

    try {
        // 2 Controller CHAMA o Service (passa objeto com dados)
        const usuarioCriado = await cadastro({ nome, email, cpf, senha });

        // 3 Controller DEVOLVE a resposta HTTP
        return res.status(201).json(usuarioCriado);

    } catch (error) {
        // 4 Controller TRADUZ erros de negócio para HTTP
        if (error.message.includes("obrigatórios") ||
            error.message.includes("CPF") ||
            error.message.includes("senha")) {
            return res.status(400).json({ message: error.message });
        }

        if (error.message.includes("já existe") || error.code === "23505") {
            return res.status(409).json({ message: "Já existe um usuário com os dados informados" });
        }

        // Erro inesperado
        console.error("Erro no cadastro:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    loginController,
    cadastroController  // ← Novo controller exportado
};