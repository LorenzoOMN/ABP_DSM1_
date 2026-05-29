const {
    findAllQuestoesRepository,
    findQuestaoByIdRepository,
    createQuestaoRepository,
    updateQuestaoRepository,
    deleteQuestaoRepository,
} = require("./admin.repository");

// ============================================================================
// SERVICES ADMINISTRATIVOS - CRUD DE QUESTÕES
// ============================================================================

async function findAllQuestoesService(filtros) {
    const { id_modulo, grupo, dificuldade, page, limit } = filtros;

    const questoes = await findAllQuestoesRepository({
        id_modulo,
        grupo,
        dificuldade,
        page,
        limit,
    });

    // Calcula total para paginação
    const total = questoes.length; // Em produção, faça um COUNT separado

    return {
        data: questoes,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function findQuestaoByIdService(idQuestao) {
    if (!idQuestao) throw new Error("ID da questão é obrigatório");

    const questao = await findQuestaoByIdRepository(idQuestao);

    if (!questao) {
        return null;
    }

    // Formata URL da imagem se existir
    return {
        ...questao,
        imagem: questao.imagem ? `/imagens/questoes/${questao.imagem}` : null,
    };
}

async function createQuestaoService(dados) {
    const {
        id_modulo,
        grupo,
        numero,
        dificuldade,
        enunciado,
        alternativa_a,
        alternativa_b,
        alternativa_c,
        alternativa_d,
        alternativa_correta,
        imagem,
    } = dados;

    // Validações
    if (!id_modulo || !enunciado || !alternativa_correta) {
        throw new Error("Campos obrigatórios não preenchidos");
    }

    const novaQuestao = await createQuestaoRepository({
        id_modulo,
        grupo,
        numero,
        dificuldade,
        enunciado,
        alternativa_a,
        alternativa_b,
        alternativa_c,
        alternativa_d,
        alternativa_correta,
        imagem,
    });

    return {
        ...novaQuestao,
        imagem: novaQuestao.imagem ? `/imagens/questoes/${novaQuestao.imagem}` : null,
    };
}

async function updateQuestaoService(idQuestao, dadosAtualizados) {
    if (!idQuestao) throw new Error("ID da questão é obrigatório");

    // Remove campos que não devem ser atualizados
    const { id_questao, ...dadosParaAtualizar } = dadosAtualizados;

    const questaoAtualizada = await updateQuestaoRepository(
        idQuestao,
        dadosParaAtualizar
    );

    if (!questaoAtualizada) {
        return null;
    }

    return {
        ...questaoAtualizada,
        imagem: questaoAtualizada.imagem ? `/imagens/questoes/${questaoAtualizada.imagem}` : null,
    };
}

async function deleteQuestaoService(idQuestao) {
    if (!idQuestao) throw new Error("ID da questão é obrigatório");

    const deletado = await deleteQuestaoRepository(idQuestao);
    return deletado;
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    findAllQuestoesService,
    findQuestaoByIdService,
    createQuestaoService,
    updateQuestaoService,
    deleteQuestaoService,
};