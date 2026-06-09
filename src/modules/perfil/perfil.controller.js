const perfilService = require('./perfil.service');

// ============================================================================
// GET /api/perfil - Dados básicos do perfil (COM LOGS)
// ============================================================================
async function getPerfilController(req, res) {
    console.log("👤 ID do usuário:", req.usuario?.id_usuario);
    
    const idUsuario = req.usuario?.id_usuario;
    
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    try {
        const db = req.app.get('db');
        
        if (!db) {
            return res.status(500).json({ message: "Banco de dados não disponível" });
        }
        
        // Buscar dados do usuário
        const usuarioResult = await db.query(
            `SELECT 
                id_usuario,
                nome,
                email,
                avatar,
                musica_ativa,
                efeitos_ativos,
                data_criacao,
                ultimo_acesso,
                tempo_total
            FROM usuarios
            WHERE id_usuario = $1`,
            [idUsuario]
        );
        
        
        if (usuarioResult.rows.length === 0) {
            console.warn("⚠️ [CONTROLLER] Usuário não encontrado");
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        
        const usuario = usuarioResult.rows[0];
        
        // Buscar progresso atual
        const progressoResult = await db.query(
            `SELECT modulo_desafio_atual
            FROM progresso_desafio
            WHERE id_usuario = $1`,
            [idUsuario]
        );
        
        const progresso = progressoResult.rows[0] || null;
        
        const resposta = {
            ...usuario,
            progresso
        };
        
        return res.json(resposta);
        
    } catch (error) {
        return res.status(500).json({ 
            message: "Erro interno do servidor",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// ============================================================================
// GET /api/perfil/estatisticas (COM LOGS)
// ============================================================================
async function getEstatisticasController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    try {
        const stats = await perfilService.getEstatisticasCompletaService(idUsuario);
        return res.status(200).json(stats);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// GET /api/perfil/ranking (COM LOGS)
// ============================================================================
async function getRankingController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    try {
        const ranking = await perfilService.getRankingService(idUsuario);
        return res.status(200).json(ranking);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// GET /api/perfil/historico (COM LOGS)
// ============================================================================
async function getHistoricoController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    try {
        const historico = await perfilService.getHistoricoService(idUsuario);
        return res.status(200).json(historico);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// GET /api/perfil/dados-conta (COM LOGS)
// ============================================================================
async function getDadosContaController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    try {
        const dados = await perfilService.getDadosContaService(idUsuario);
        return res.status(200).json(dados);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// POST /api/perfil/sessao/iniciar (COM LOGS)
// ============================================================================
async function iniciarSessaoController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    try {
        const idSessao = await perfilService.iniciarSessaoService(idUsuario);
        return res.status(200).json({ id_sessao: idSessao });
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// POST /api/perfil/sessao/finalizar (COM LOGS)
// ============================================================================
async function finalizarSessaoController(req, res) {
    console.log("🔓 [CONTROLLER] finalizarSessaoController chamado");
    const { id_sessao } = req.body;
    
    if (!id_sessao) {
        return res.status(400).json({ message: "ID da sessão obrigatório" });
    }
    
    try {
        await perfilService.finalizarSessaoService(id_sessao);
        return res.status(200).json({ message: "Sessão finalizada" });
    } catch (error) {
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

module.exports = {
    getPerfilController,
    getEstatisticasController,
    getRankingController,
    getHistoricoController,
    getDadosContaController,
    iniciarSessaoController,
    finalizarSessaoController
};