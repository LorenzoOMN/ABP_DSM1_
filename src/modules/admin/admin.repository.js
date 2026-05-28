const pool = require("../../shared/database/db");

// ============================================================================
// REPOSITÓRIO ADMINISTRATIVO - CRUD DE QUESTÕES
// ============================================================================

async function findAllQuestoesRepository(filtros) {
    const { id_modulo, grupo, dificuldade, page, limit } = filtros;

    const offset = (page - 1) * limit;

    let query = `
    SELECT 
    id_questao,
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
    criado_em
    FROM questoes
    WHERE 1=1
`;

    const values = [];
    let paramIndex = 1;

    if (id_modulo) {
        query += ` AND id_modulo = $${paramIndex}`;
        values.push(id_modulo);
        paramIndex++;
    }

    if (grupo) {
        query += ` AND grupo = $${paramIndex}`;
        values.push(grupo);
        paramIndex++;
    }

    if (dificuldade) {
        query += ` AND dificuldade = $${paramIndex}`;
        values.push(dificuldade);
        paramIndex++;
    }

    query += ` ORDER BY id_modulo ASC, numero ASC NULLS LAST, id_questao ASC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    return result.rows;
}

async function findQuestaoByIdRepository(idQuestao) {
    const result = await pool.query(
        `
    SELECT 
    id_questao,
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
    criado_em
    FROM questoes
    WHERE id_questao = $1
    LIMIT 1
    `,
        [idQuestao]
    );

    return result.rows[0] || null;
}

async function createQuestaoRepository(dados) {
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

    const result = await pool.query(
        `
    INSERT INTO questoes (
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
    imagem
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING 
    id_questao,
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
    criado_em
    `,
        [
            id_modulo,
            grupo || null,
            numero || null,
            dificuldade || null,
            enunciado,
            alternativa_a || null,
            alternativa_b || null,
            alternativa_c || null,
            alternativa_d || null,
            alternativa_correta,
            imagem || null,
        ]
    );

    return result.rows[0];
}

async function updateQuestaoRepository(idQuestao, dadosAtualizados) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Constrói dinamicamente os campos a atualizar
    Object.keys(dadosAtualizados).forEach((key) => {
        fields.push(`${key} = $${paramIndex}`);
        values.push(dadosAtualizados[key]);
        paramIndex++;
    });

    if (fields.length === 0) {
        return await findQuestaoByIdRepository(idQuestao);
    }

    values.push(idQuestao);

    const query = `
    UPDATE questoes
    SET ${fields.join(', ')}, atualizado_em = NOW()
    WHERE id_questao = $${paramIndex}
    RETURNING 
    id_questao,
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
    criado_em,
    atualizado_em
`;

    const result = await pool.query(query, values);

    return result.rows[0] || null;
}

async function deleteQuestaoRepository(idQuestao) {
    // Verifica se a questão existe antes de deletar
    const questao = await findQuestaoByIdRepository(idQuestao);

    if (!questao) {
        return null;
    }

    // Deleta a questão
    await pool.query(
        `
    DELETE FROM questoes
    WHERE id_questao = $1
    `,
        [idQuestao]
    );

    return questao;
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    findAllQuestoesRepository,
    findQuestaoByIdRepository,
    createQuestaoRepository,
    updateQuestaoRepository,
    deleteQuestaoRepository,
};