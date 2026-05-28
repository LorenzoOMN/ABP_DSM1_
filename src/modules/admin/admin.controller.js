const {
    findAllQuestoesService,
    findQuestaoByIdService,
    createQuestaoService,
    updateQuestaoService,
    deleteQuestaoService,
} = require('./admin.service');

// ============================================================================
// CONTROLLERS ADMINISTRATIVOS - CRUD DE QUESTÕES
// ============================================================================

// GET - Listar todas as questões
async function getAdminQuestoes(req, res) {
    try {
        const { id_modulo, grupo, dificuldade, page = 1, limit = 20 } = req.query;

        const filtros = {
            id_modulo: id_modulo ? Number(id_modulo) : null,
            grupo: grupo || null,
            dificuldade: dificuldade || null,
            page: Number(page),
            limit: Number(limit),
        };

        const resultado = await findAllQuestoesService(filtros);

        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Erro em getAdminQuestoes:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// GET - Buscar questão por ID
async function getAdminQuestaoById(req, res) {
    try {
        const { id } = req.params;

        const questao = await findQuestaoByIdService(id);

        if (!questao) {
            return res.status(404).json({ message: "Questão não encontrada" });
        }

        return res.status(200).json(questao);
    } catch (error) {
        console.error("Erro em getAdminQuestaoById:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// POST - Criar nova questão
async function createQuestao(req, res) {
    try {
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
        } = req.body;

        // Validações básicas
        if (!id_modulo || !enunciado || !alternativa_correta) {
            return res.status(400).json({
                message: "Campos obrigatórios: id_modulo, enunciado e alternativa_correta"
            });
        }

        // Valida alternativa correta
        const alternativasValidas = ['a', 'b', 'c', 'd'];
        if (!alternativasValidas.includes(alternativa_correta.toLowerCase())) {
            return res.status(400).json({
                message: "alternativa_correta deve ser 'a', 'b', 'c' ou 'd'"
            });
        }

        const novaQuestao = await createQuestaoService({
            id_modulo,
            grupo,
            numero,
            dificuldade,
            enunciado,
            alternativa_a,
            alternativa_b,
            alternativa_c,
            alternativa_d,
            alternativa_correta: alternativa_correta.toLowerCase(),
            imagem,
        });

        return res.status(201).json(novaQuestao);
    } catch (error) {
        console.error("Erro em createQuestao:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// PUT/PATCH - Atualizar questão
async function updateQuestao(req, res) {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        // Valida alternativa correta se estiver sendo atualizada
        if (dadosAtualizados.alternativa_correta) {
            const alternativasValidas = ['a', 'b', 'c', 'd'];
            if (!alternativasValidas.includes(dadosAtualizados.alternativa_correta.toLowerCase())) {
                return res.status(400).json({
                    message: "alternativa_correta deve ser 'a', 'b', 'c' ou 'd'"
                });
            }
            dadosAtualizados.alternativa_correta = dadosAtualizados.alternativa_correta.toLowerCase();
        }

        const questaoAtualizada = await updateQuestaoService(id, dadosAtualizados);

        if (!questaoAtualizada) {
            return res.status(404).json({ message: "Questão não encontrada" });
        }

        return res.status(200).json(questaoAtualizada);
    } catch (error) {
        console.error("Erro em updateQuestao:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// DELETE - Deletar questão
async function deleteQuestao(req, res) {
    try {
        const { id } = req.params;

        const deletado = await deleteQuestaoService(id);

        if (!deletado) {
            return res.status(404).json({ message: "Questão não encontrada" });
        }

        return res.status(200).json({
            message: "Questão deletada com sucesso"
        });
    } catch (error) {
        console.error("Erro em deleteQuestao:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    getAdminQuestoes,
    getAdminQuestaoById,
    createQuestao,
    updateQuestao,
    deleteQuestao,
};