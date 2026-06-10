const perfilRepository = require('./perfil.repository');

// ============================================================================
// ESTATÍSTICAS COMPLETAS
// ============================================================================
async function getEstatisticasCompletaService(idUsuario) {
    const stats = await perfilRepository.getEstatisticasUsuario(idUsuario);
    const streak = await perfilRepository.getStreakDias(idUsuario);
    
    return {
        total_questoes: parseInt(stats.total_questoes) || 0,
        taxa_acerto: Math.round(stats.taxa_acerto) || 0,
        streak_dias: streak,
        tempo_medio: Math.round(stats.tempo_medio_segundos) || 0
    };
}

// ============================================================================
// RANKING
// ============================================================================
async function getRankingService(idUsuario) {
    const ranking = await perfilRepository.getRankingGeral();
    const posicao = await perfilRepository.getPosicaoUsuario(idUsuario);
    
    // Pegar top 5
    const top5 = ranking.slice(0, 5).map(u => ({
        nome: u.nome,
        pontos: Math.round(u.pontuacao)
    }));
    
    return {
        minha_posicao: posicao.posicao,
        total_jogadores: posicao.total_jogadores,
        top5
    };
}

// ============================================================================
// HISTÓRICO
// ============================================================================
async function getHistoricoService(idUsuario) {
    const historico = await perfilRepository.getHistoricoAtividades(idUsuario, 10);
    
    return historico.map(h => ({
        titulo: `${h.modulo_nome} - Grupo ${h.grupo}`,
        acertou: h.acertou,
        data: h.data_formatada
    }));
}

// ============================================================================
// DADOS DA CONTA
// ============================================================================
async function getDadosContaService(idUsuario) {
    const dados = await perfilRepository.getDadosConta(idUsuario);
    
    // Formatar tempo_total corretamente
    let tempo_total_formatado = "0 segundos";
    let tempo_total_segundos = 0;
    
    if (dados.tempo_total_segundos && dados.tempo_total_segundos > 0) {
        tempo_total_segundos = dados.tempo_total_segundos;
        const horas = Math.floor(dados.tempo_total_segundos / 3600);
        const minutos = Math.floor((dados.tempo_total_segundos % 3600) / 60);
        const segundos = dados.tempo_total_segundos % 60;
        
        if (horas > 0) {
            tempo_total_formatado = `${horas}h ${minutos}min ${segundos}s`;
        } else if (minutos > 0) {
            tempo_total_formatado = `${minutos} minutos e ${segundos} segundos`;
        } else {
            tempo_total_formatado = `${segundos} segundos`;
        }
    }
    
    return {
        data_criacao: dados.data_criacao,
        ultimo_acesso: dados.ultimo_acesso,
        tempo_total: tempo_total_formatado,
        tempo_total_segundos: tempo_total_segundos  // Adiciona os segundos crus
    };
}

// ============================================================================
// SESSÃO
// ============================================================================
async function iniciarSessaoService(idUsuario) {
    await perfilRepository.atualizarUltimoAcesso(idUsuario);
    return await perfilRepository.iniciarSessao(idUsuario);
}

async function finalizarSessaoService(idSessao) {
    await perfilRepository.finalizarSessao(idSessao);
}

module.exports = {
    getEstatisticasCompletaService,
    getRankingService,
    getHistoricoService,
    getDadosContaService,
    iniciarSessaoService,
    finalizarSessaoService
};