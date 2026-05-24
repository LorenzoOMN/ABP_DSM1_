// src/modules/navbar/navbar.service.js

// Importa do repository de USUÁRIOS (faz sentido, pois a query é na tabela usuarios)
const {
    verificarBarraDesbloqueada,
    desbloquearBarraNavegacao
} = require('../usuarios/usuarios.repository');

// ============================================================================
// FUNÇÃO: VERIFICAR STATUS DA NAVBAR
// ============================================================================
async function getStatusNavbar(idUsuario) {
    // Validações de NEGÓCIO
    if (!idUsuario) {
        throw new Error("ID do usuário é obrigatório para verificar navbar");
    }

    // Busca status no banco via Repository de Usuários
    const barraDesbloqueada = await verificarBarraDesbloqueada(idUsuario);

    // Retorna dados "limpos" + contexto de negócio
    return {
        barra_desbloqueada: !!barraDesbloqueada, // Garante que seja booleano
        mensagem: barraDesbloqueada
            ? 'Navbar disponível'
            : 'Complete os requisitos para desbloquear'
    };
}

// ============================================================================
// FUNÇÃO: DESBLOQUEAR NAVBAR
// ============================================================================
async function desbloquearNavbar(idUsuario, criterioAtendido = true) {
    // Validações de NEGÓCIO
    if (!idUsuario) {
        throw new Error("ID do usuário é obrigatório para desbloquear navbar");
    }

    // Regra de negócio: só desbloqueia se o critério for atendido
    // (ex: completou capítulo 1, atingiu pontuação mínima, etc)
    if (!criterioAtendido) {
        throw new Error("Critérios para desbloqueio não atendidos");
    }

    // Executa o desbloqueio via Repository de Usuários
    await desbloquearBarraNavegacao(idUsuario);

    // Retorna confirmação "limpa"
    return {
        desbloqueado: true,
        mensagem: 'Barra de navegação desbloqueada com sucesso'
    };
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    getStatusNavbar,
    desbloquearNavbar
};