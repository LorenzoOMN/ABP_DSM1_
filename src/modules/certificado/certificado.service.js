// src/modules/certificados/certificado.service.js

// Importa apenas REPOSITORIES e UTILS (nunca controller ou HTTP)
const {
    findCertificadoByHash,
    findDesempenhoCertificado
} = require("./certificado.repository");

// ============================================================================
// FUNÇÃO: BUSCAR CERTIFICADO POR HASH (PÚBLICO)
// ============================================================================
async function buscarCertificadoPorHash(certificadoHash) {
    // Validações de NEGÓCIO
    if (!certificadoHash || certificadoHash.trim() === "") {
        throw new Error("Hash do certificado é obrigatório");
    }

    const hashLimpo = certificadoHash.trim();

    // Busca no banco via Repository
    const certificado = await findCertificadoByHash(hashLimpo);

    // Valida existência (regra de negócio)
    if (!certificado) {
        throw new Error("Certificado inexistente para o hash informado");
    }

    // Valida disponibilidade (regra de negócio)
    if (certificado.indisponivel) {
        // Usa a mensagem do próprio banco/repositório se existir
        throw new Error(certificado.motivo || "Certificado indisponível");
    }

    // Retorna dados "limpos" (sem status HTTP)
    return certificado;
}

// ============================================================================
// FUNÇÃO: BUSCAR DESEMPENHO (PROTEGIDO - REQUER USUÁRIO)
// ============================================================================
async function buscarDesempenho(idUsuario) {
    // Validações de NEGÓCIO
    if (!idUsuario) {
        throw new Error("ID do usuário é obrigatório");
    }

    // Busca desempenho via Repository
    const desempenho = await findDesempenhoCertificado(idUsuario);

    // Se não encontrar, pode retornar null ou dados vazios (depende da sua regra)
    // Aqui vamos retornar null e deixar o controller decidir o status HTTP
    return desempenho;
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    buscarCertificadoPorHash,
    buscarDesempenho
};