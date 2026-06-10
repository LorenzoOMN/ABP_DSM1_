// src/modules/usuarios/usuario.controller.js

// Importa apenas o SERVICE (nunca repository direto)
const usuariosService = require('./usuarios.service');
const { updateUsuarioCpfService,
    updateUsuarioNomeService,
    updateUsuarioEmailService,
    updateUsuarioSenhaService,
    findUsuarioByIdService,
    findUsuarioAvatarService,
    updateUsuarioAvatarService,
    findAvataresDisponiveisService,
    findAvataresUsuarioService,
    equiparAvatarUsuarioService } = require('./usuarios.service');

// ============================================================================
// CONTROLLER: OBTER DADOS DO USUÁRIO ATUAL (GET /me)
// ============================================================================
async function getMeController(req, res) {
    // 1️⃣ Controller PEGA o usuário do middleware de auth
    const idUsuario = req.usuario?.id_usuario;

    // Validação de segurança
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        // 2️⃣ Controller CHAMA o Service
        const usuario = await findUsuarioByIdService(idUsuario);

        // 3️⃣ Controller DEVOLVE a resposta HTTP
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        return res.status(200).json(usuario);

    } catch (error) {
        // 4️⃣ Controller TRADUZ erros de negócio para HTTP
        console.error("Erro em getMeController:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: ATUALIZAR CPF (PATCH /cpf)
// ============================================================================
async function updateCpfController(req, res) {
    // 1️⃣ Controller PEGA e PREPARA dados da requisição
    const idUsuario = req.usuario?.id_usuario;
    const cpfRaw = String(req.body.cpf || "");

    // Validação de entrada (formato, não regra de negócio)
    const cpf = cpfRaw.replace(/\D/g, "").slice(0, 11);

    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!cpf) {
        return res.status(400).json({ message: "CPF obrigatório" });
    }

    if (cpf.length !== 11) {
        return res.status(400).json({ message: "CPF deve conter 11 números" });
    }

    try {
        // 2️⃣ Controller CHAMA o Service
        const usuarioAtualizado = await updateUsuarioCpfService(idUsuario, cpf);

        // 3️⃣ Controller DEVOLVE a resposta HTTP
        return res.status(200).json(usuarioAtualizado);

    } catch (error) {
        // 4️⃣ Controller TRADUZ erros de negócio para HTTP
        if (error.message === "CPF obrigatório" || error.message === "CPF deve conter 11 números") {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === "usuário não encontrado") {
            return res.status(404).json({ message: error.message });
        }

        // Erro de unique constraint do PostgreSQL (código 23505)
        if (error.code === "23505" || error.message.includes("já existe")) {
            return res.status(409).json({ message: "Já existe um usuário com o CPF informado" });
        }

        console.error("Erro em updateCpfController:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
}

// ============================================================================
// CONTROLLER: ATUALIZAR NOME (PATCH /nome)
// ============================================================================
async function updateNomeController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    const { nome } = req.body;

    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    // Validação básica de entrada
    if (!nome || nome.trim() === "") {
        return res.status(400).json({ message: "Nome é obrigatório" });
    }

    try {
        const usuarioAtualizado = await updateUsuarioNomeService(idUsuario, nome.trim());
        return res.status(200).json(usuarioAtualizado);
    } catch (error) {
        if (error.message === "nome é obrigatório") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "usuário não encontrado") {
            return res.status(404).json({ message: error.message });
        }
        console.error("Erro em updateNomeController:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
}

// ============================================================================
// CONTROLLER: ATUALIZAR EMAIL (PATCH /email)
// ============================================================================
async function updateEmailController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    const { email } = req.body;

    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!email || email.trim() === "") {
        return res.status(400).json({ message: "Email é obrigatório" });
    }

    // Validação básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de email inválido" });
    }

    try {
        const usuarioAtualizado = await updateUsuarioEmailService(idUsuario, email.trim());
        return res.status(200).json(usuarioAtualizado);
    } catch (error) {
        if (error.message === "email obrigatório") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "usuário não encontrado") {
            return res.status(404).json({ message: error.message });
        }
        if (error.code === "23505" || error.message.includes("já existe")) {
            return res.status(409).json({ message: "Já existe um usuário com o email informado" });
        }
        console.error("Erro em updateEmailController:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
}

// ============================================================================
// CONTROLLER: ATUALIZAR SENHA (PATCH /senha)
// ============================================================================
async function updateSenhaController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    const { senha } = req.body;

    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!senha) {
        return res.status(400).json({ message: "Senha é obrigatória" });
    }

    // Validação de tamanho (pode ser movida para o service se preferir)
    if (senha.trim().length < 6) {
        return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres" });
    }

    try {
        const usuarioAtualizado = await updateUsuarioSenhaService(idUsuario, senha);
        return res.status(200).json(usuarioAtualizado);
    } catch (error) {
        if (error.message.includes("obrigatória") || error.message.includes("6 caracteres")) {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "usuário não encontrado") {
            return res.status(404).json({ message: error.message });
        }
        console.error("Erro em updateSenhaController:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
}

// ============================================================================
// CONTROLLER: OBTER AVATAR DO USUÁRIO (GET /avatar)
// ============================================================================
async function getAvatarController(req, res) {
    const idUsuario = req.usuario?.id_usuario;

    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const avatar = await findUsuarioAvatarService(idUsuario);
        return res.status(200).json({ avatar });
    } catch (error) {
        console.error("Erro em getAvatarController:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: ATUALIZAR AVATAR (PATCH /avatar)
// ============================================================================
async function updateAvatarController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    const { avatar } = req.body;

    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!avatar) {
        return res.status(400).json({ message: "Avatar é obrigatório" });
    }

    try {
        const result = await updateUsuarioAvatarService(idUsuario, avatar);
        return res.status(200).json(result);
    } catch (error) {
        if (error.message === "Avatar é obrigatório" || error.message === "Nome de avatar inválido") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "usuário não encontrado") {
            return res.status(404).json({ message: error.message });
        }
        console.error("Erro em updateAvatarController:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: LISTAR AVATARES DISPONÍVEIS (GET /avatares)
// ============================================================================
async function getAvataresDisponiveisController(req, res) {
    try {
        const avatares = await findAvataresDisponiveisService();
        return res.status(200).json(avatares);
    } catch (error) {
        console.error("Erro em getAvataresDisponiveisController:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: LISTAR AVATARES DO USUÁRIO (GET /meus-avatares)
// ============================================================================
async function getMeusAvataresController(req, res) {
    const idUsuario = req.usuario?.id_usuario;

    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    try {
        const avatares = await findAvataresUsuarioService(idUsuario);
        return res.status(200).json(avatares);
    } catch (error) {
        console.error("Erro em getMeusAvataresController:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// CONTROLLER: EQUIPAR AVATAR (PUT /avatar/equipar)
// ============================================================================
async function equiparAvatarController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    const { id_avatar } = req.body;

    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!id_avatar) {
        return res.status(400).json({ message: "ID do avatar é obrigatório" });
    }

    try {
        await equiparAvatarUsuarioService(idUsuario, id_avatar);
        return res.status(200).json({ message: "Avatar equipado com sucesso" });
    } catch (error) {
        if (error.message === "Avatar não desbloqueado") {
            return res.status(403).json({ message: error.message });
        }
        console.error("Erro em equiparAvatarController:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    getMeController,
    updateCpfController,
    updateNomeController,
    updateEmailController,
    updateSenhaController,
    getAvatarController,
    updateAvatarController,
    getAvataresDisponiveisController,
    getMeusAvataresController,
    equiparAvatarController
};