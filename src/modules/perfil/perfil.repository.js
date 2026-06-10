const pool = require("../../shared/database/db");

// ============================================================================
// ESTATÍSTICAS DO USUÁRIO
// ============================================================================
async function getEstatisticasUsuario(idUsuario) {
    const result = await pool.query(
        `SELECT 
            COUNT(*) as total_questoes,
            COALESCE(ROUND(AVG(CASE WHEN nota > 0 THEN 100.0 ELSE 0 END)), 0) as taxa_acerto,
            0 as tempo_medio_segundos
        FROM respostas 
        WHERE id_exame IN (
            SELECT id_exame FROM exames WHERE id_usuario = $1
        )`,
        [idUsuario]
    );
    
    return result.rows[0];
}

// ============================================================================
// STREAK (DIAS SEGUIDOS)
// ============================================================================
async function getStreakDias(idUsuario) {
    const result = await pool.query(
        `WITH dias_ativos AS (
            SELECT DISTINCT DATE(respondido_em) as dia
            FROM respostas
            WHERE id_exame IN (
                SELECT id_exame FROM exames WHERE id_usuario = $1
            )
            ORDER BY dia DESC
        )
        SELECT 
            COUNT(*) as streak
        FROM (
            SELECT dia, 
                   ROW_NUMBER() OVER (ORDER BY dia DESC) as rn
            FROM dias_ativos
        ) sub
        WHERE dia = CURRENT_DATE - INTERVAL '1 day' * (rn - 1)`,
        [idUsuario]
    );
    
    return result.rows[0]?.streak || 0;
}

// ============================================================================
// RANKING
// ============================================================================
async function getRankingGeral() {
    const result = await pool.query(
        `SELECT 
            u.id_usuario,
            u.nome,
            COUNT(DISTINCT e.id_modulo) as modulos_concluidos,
            COUNT(r.id_resposta) as total_respostas,
            COALESCE(ROUND(AVG(CASE WHEN r.nota > 0 THEN 100.0 ELSE 0 END)), 0) as taxa_acerto,
            (COUNT(DISTINCT e.id_modulo) * 100 + 
             COALESCE(ROUND(AVG(CASE WHEN r.nota > 0 THEN 100.0 ELSE 0 END)), 0) * 10 + 
             COUNT(r.id_resposta)) as pontuacao
        FROM usuarios u
        LEFT JOIN exames e ON u.id_usuario = e.id_usuario
        LEFT JOIN respostas r ON e.id_exame = r.id_exame
        WHERE u.is_admin = false
        GROUP BY u.id_usuario, u.nome
        ORDER BY pontuacao DESC`
    );
    
    return result.rows;
}

async function getPosicaoUsuario(idUsuario) {
    const ranking = await getRankingGeral();
    const posicao = ranking.findIndex(u => u.id_usuario === idUsuario) + 1;
    
    return {
        posicao: posicao || ranking.length + 1,
        total_jogadores: ranking.length
    };
}

// ============================================================================
// HISTÓRICO DE ATIVIDADES
// ============================================================================
async function getHistoricoAtividades(idUsuario, limite = 10) {
    const result = await pool.query(
        `SELECT 
            m.titulo as modulo_nome,
            e.grupo,
            CASE WHEN r.nota > 0 THEN true ELSE false END as acertou,
            r.respondido_em as data_resposta,
            CASE 
                WHEN r.respondido_em >= CURRENT_TIMESTAMP - INTERVAL '1 hour' THEN 'há 1 hora'
                WHEN r.respondido_em >= CURRENT_TIMESTAMP - INTERVAL '24 hours' THEN 
                    CONCAT(EXTRACT(HOUR FROM CURRENT_TIMESTAMP - r.respondido_em), ' horas')
                WHEN r.respondido_em >= CURRENT_TIMESTAMP - INTERVAL '7 days' THEN 
                    CONCAT(EXTRACT(DAY FROM CURRENT_TIMESTAMP - r.respondido_em), ' dias')
                ELSE TO_CHAR(r.respondido_em, 'DD/MM/YYYY')
            END as data_formatada
        FROM respostas r
        JOIN exames e ON r.id_exame = e.id_exame
        LEFT JOIN modulos m ON e.id_modulo = m.id_modulo
        WHERE e.id_usuario = $1
        ORDER BY r.respondido_em DESC
        LIMIT $2`,
        [idUsuario, limite]
    );
    
    return result.rows;
}

// ============================================================================
// DADOS DA CONTA
// ============================================================================
async function getDadosConta(idUsuario) {
    const result = await pool.query(
        `SELECT 
            data_criacao,
            ultimo_acesso,
            tempo_total
        FROM usuarios
        WHERE id_usuario = $1`,
        [idUsuario]
    );
    
    return result.rows[0];
}

// ============================================================================
// ATUALIZAR ÚLTIMO ACESSO
// ============================================================================
async function atualizarUltimoAcesso(idUsuario) {
    await pool.query(
        `UPDATE usuarios 
        SET ultimo_acesso = CURRENT_TIMESTAMP 
        WHERE id_usuario = $1`,
        [idUsuario]
    );
}

// ============================================================================
// REGISTRAR SESSÃO
// ============================================================================
async function iniciarSessao(idUsuario) {
    const result = await pool.query(
        `INSERT INTO sessoes_usuario (id_usuario, tempo_inicio)
        VALUES ($1, CURRENT_TIMESTAMP)
        RETURNING id_sessao`,
        [idUsuario]
    );
    
    return result.rows[0]?.id_sessao;
}

async function finalizarSessao(idSessao) {
    await pool.query(
        `UPDATE sessoes_usuario 
        SET tempo_fim = CURRENT_TIMESTAMP,
            duracao = CURRENT_TIMESTAMP - tempo_inicio
        WHERE id_sessao = $1 AND tempo_fim IS NULL`,
        [idSessao]
    );
    
    await pool.query(
        `UPDATE usuarios 
        SET tempo_total = tempo_total + (
            SELECT COALESCE(SUM(duracao), INTERVAL '0 seconds')
            FROM sessoes_usuario
            WHERE id_usuario = (SELECT id_usuario FROM sessoes_usuario WHERE id_sessao = $1)
            AND tempo_fim IS NOT NULL
        )
        WHERE id_usuario = (
            SELECT id_usuario FROM sessoes_usuario WHERE id_sessao = $1
        )`,
        [idSessao]
    );
}

module.exports = {
    getEstatisticasUsuario,
    getStreakDias,
    getRankingGeral,
    getPosicaoUsuario,
    getHistoricoAtividades,
    getDadosConta,
    atualizarUltimoAcesso,
    iniciarSessao,
    finalizarSessao
};