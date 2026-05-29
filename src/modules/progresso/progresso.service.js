// src/modules/progresso/progresso.service.js

// Importa repositories de DIFERENTES módulos (orquestração!)
const {
    findOutroGrupoAleatorio,
    findQualquerGrupoPorModulo,
    findExameExistente,
    criarExameInicial,
} = require("../questoes/questoes.repository");

const {
    concluirHistoria,
    findProgressoMapa,
} = require("./progresso.repository");

// ============================================================================
// FUNÇÃO: OBTER PROGRESSO DO MAPA
// ============================================================================
async function getProgressoMapaService(idUsuario) {
    // Validações de NEGÓCIO
    if (!idUsuario) {
        throw new Error("ID do usuário é obrigatório");
    }

    // Busca dados crus do banco
    const progressoRaw = await findProgressoMapa(idUsuario);

    // Transforma os dados (regra de apresentação/negócio)
    const modulosFormatados = progressoRaw.map((modulo) => ({
        id_modulo: modulo.id_modulo,
        titulo: modulo.titulo,
        historia_concluida: modulo.historia_concluida,
        // Regra: módulo liberado se estiver <= módulo desafio atual
        historia_liberada:
            Number(modulo.id_modulo) <= Number(modulo.modulo_desafio_atual),
        // Regra: questionário só libera após concluir história
        questionario_liberado: modulo.historia_concluida,
        // Regra: destaca o módulo que é o desafio atual
        desafio_atual: Number(modulo.id_modulo) === Number(modulo.modulo_desafio_atual),
        falhas_no_modulo: modulo.falhas_no_modulo,
        tentativas_gastas_total: modulo.tentativas_gastas_total,
        certificado_liberado: modulo.certificado_liberado,
    }));

    // Retorna dados "limpos" e prontos para uso
    return {
        modulos: modulosFormatados
    };
}

// ============================================================================
// FUNÇÃO: CONCLUIR HISTÓRIA + CRIAR EXAME (FLUXO COMPLEXO)
// ============================================================================
async function concluirHistoriaService(idUsuario, idModulo) {
    // Validações de NEGÓCIO
    if (!idUsuario) {
        throw new Error("ID do usuário é obrigatório");
    }

    if (!Number.isInteger(idModulo) || idModulo <= 0) {
        throw new Error("ID do módulo inválido");
    }

    // 1️⃣ Conclui a história no banco
    const progresso = await concluirHistoria(idUsuario, idModulo);

    // 2️⃣ Verifica se já existe exame para evitar duplicatas
    const exameExistente = await findExameExistente(idUsuario, idModulo);

    // 3️⃣ Se não existe exame, cria um novo (orquestração complexa)
    if (!exameExistente) {
        // Tenta pegar um grupo que o usuário ainda não usou (lógica de negócio)
        let grupo = await findOutroGrupoAleatorio(idUsuario, idModulo);

        // Fallback: se não achar grupo inédito, pega qualquer um disponível
        if (!grupo) {
            grupo = await findQualquerGrupoPorModulo(idModulo);
        }

        // Só cria o exame se encontrou um grupo de questões
        if (grupo) {
            await criarExameInicial(idUsuario, idModulo, grupo.grupo);
        } else {
            // Aviso: não é erro crítico, mas pode ser logado
            console.warn(`Nenhum grupo de questões encontrado para módulo ${idModulo}`);
        }
    }

    // Retorna confirmação "limpa"
    return {
        message: "História concluída com sucesso",
        progresso,
        exame_criado: !exameExistente // Informa se um novo exame foi gerado
    };
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    getProgressoMapaService,
    concluirHistoriaService
};