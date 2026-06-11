const perfilService = require('./perfil.service');

// ============================================================================
// GET /api/perfil - Dados básicos do perfil
// ============================================================================
async function getPerfilController(req, res) {
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
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        
        const usuario = usuarioResult.rows[0];
        
        // FALLBACK: Se avatar estiver NULL ou default.png, buscar da tabela usuario_avatares
        if (!usuario.avatar || usuario.avatar === 'default.png') {
            const avatarResult = await db.query(
                `SELECT a.caminho_imagem
                 FROM usuario_avatares ua
                 JOIN avatares a ON ua.id_avatar = a.id_avatar
                 WHERE ua.id_usuario = $1 AND ua.equipado = true
                 LIMIT 1`,
                [idUsuario]
            );
            
            if (avatarResult.rows.length > 0) {
                usuario.avatar = avatarResult.rows[0].caminho_imagem;
                
                // Atualizar a coluna avatar para下次 não precisar fazer fallback
                await db.query(
                    `UPDATE usuarios SET avatar = $1 WHERE id_usuario = $2`,
                    [usuario.avatar, idUsuario]
                );
            } else {
                // Último recurso: corvo.png
                usuario.avatar = 'corvo.png';
            }
        }
        
        // Buscar progresso atual
        const progressoResult = await db.query(
            `SELECT modulo_desafio_atual
            FROM progresso_desafio
            WHERE id_usuario = $1`,
            [idUsuario]
        );
        
        const progresso = progressoResult.rows[0] || null;
        
        return res.json({
            ...usuario,
            progresso
        });
        
    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return res.status(500).json({ 
            message: "Erro interno do servidor",
            error: error.message
        });
    }
}

// ============================================================================
// GET /api/perfil/estatisticas
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
        console.error("Erro ao buscar estatísticas:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// GET /api/perfil/ranking
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
        console.error("Erro ao buscar ranking:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// GET /api/perfil/historico
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
        console.error("Erro ao buscar histórico:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// GET /api/perfil/dados-conta
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
        console.error("Erro ao buscar dados da conta:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// POST /api/perfil/sessao/iniciar
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
        console.error("Erro ao iniciar sessão:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// POST /api/perfil/sessao/finalizar
// ============================================================================
async function finalizarSessaoController(req, res) {
    const { id_sessao } = req.body;
    
    if (!id_sessao) {
        return res.status(400).json({ message: "ID da sessão obrigatório" });
    }
    
    try {
        await perfilService.finalizarSessaoService(id_sessao);
        return res.status(200).json({ message: "Sessão finalizada" });
    } catch (error) {
        console.error("Erro ao finalizar sessão:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// GET /api/perfil/meus-avatares (NOVO - para o modal)
// ============================================================================
async function getMeusAvataresController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    
    if (!idUsuario) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    
    try {
        const db = req.app.get('db');
        
        const result = await db.query(
            `SELECT 
                a.id_avatar,
                a.nome,
                a.caminho_imagem,
                COALESCE(ua.equipado, false) as equipado
            FROM avatares a
            LEFT JOIN usuario_avatares ua ON a.id_avatar = ua.id_avatar AND ua.id_usuario = $1
            WHERE a.modulo_desbloqueio <= (
                SELECT COALESCE(modulo_desafio_atual, 1) 
                FROM progresso_desafio 
                WHERE id_usuario = $1
            )
            OR a.eh_padrao = true
            ORDER BY a.id_avatar`,
            [idUsuario]
        );
        
        return res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar avatares:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// PUT /api/perfil/equipar-avatar (NOVO - trocar avatar)
// ============================================================================
async function equiparAvatarController(req, res) {
    const idUsuario = req.usuario?.id_usuario;
    const { id_avatar } = req.body;
    
    if (!idUsuario || !id_avatar) {
        return res.status(400).json({ message: "Dados inválidos" });
    }
    
    try {
        const db = req.app.get('db');
        
        // Verificar se o avatar existe e está desbloqueado
        const avatarCheck = await db.query(
            `SELECT caminho_imagem FROM avatares WHERE id_avatar = $1`,
            [id_avatar]
        );
        
        if (avatarCheck.rows.length === 0) {
            return res.status(404).json({ message: "Avatar não encontrado" });
        }
        
        const caminhoImagem = avatarCheck.rows[0].caminho_imagem;
        
        // Desequipar todos os avatares do usuário
        await db.query(
            `UPDATE usuario_avatares SET equipado = false WHERE id_usuario = $1`,
            [idUsuario]
        );
        
        // Inserir ou atualizar o avatar equipado
        await db.query(
            `INSERT INTO usuario_avatares (id_usuario, id_avatar, equipado)
             VALUES ($1, $2, true)
             ON CONFLICT (id_usuario, id_avatar) 
             DO UPDATE SET equipado = true`,
            [idUsuario, id_avatar]
        );
        
        // Atualizar também na tabela usuarios (sistema simples)
        await db.query(
            `UPDATE usuarios SET avatar = $1 WHERE id_usuario = $2`,
            [caminhoImagem, idUsuario]
        );
        
        return res.json({ 
            message: "Avatar equipado",
            caminho_imagem: caminhoImagem
        });
    } catch (error) {
        console.error("Erro ao equipar avatar:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function getTodosAvataresController(req, res) {
    try {
        const db = req.app.get('db');
        
        const result = await db.query(
            `SELECT 
                id_avatar,
                nome,
                caminho_imagem,
                descricao,
                modulo_desbloqueio,
                eh_padrao
            FROM avatares
            ORDER BY id_avatar`
        );
        
        return res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar avatares:", error);
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
    finalizarSessaoController,
    getMeusAvataresController,
    equiparAvatarController,
    getTodosAvataresController  // ← Adicione isso
};