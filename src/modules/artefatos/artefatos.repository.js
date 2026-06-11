const pool = require("../../shared/database/db");

async function buscarArtefatosPorUsuario(idUsuario) {
  const sql = `
    SELECT
      a.id,
      a.titulo,
      a.descricao_curta,
      a.conteudo_longo,
      a.imagem,
      a.capitulo_requisito,
      CASE
        WHEN ua.id_usuario_artefato IS NOT NULL THEN true
        ELSE false
      END AS desbloqueado,
      ua.desbloqueado_em
    FROM public.artefatos a
    LEFT JOIN public.usuario_artefatos ua
      ON ua.id_artefato = a.id
     AND ua.id_usuario = $1
    ORDER BY a.capitulo_requisito ASC;
  `;

  const result = await pool.query(sql, [idUsuario]);
  return result.rows || [];
}

async function buscarArtefatoPorId(idUsuario, idArtefato) {
  const sql = `
    SELECT
      a.id,
      a.titulo,
      a.descricao_curta,
      a.conteudo_longo,
      a.imagem,
      a.capitulo_requisito,
      CASE
        WHEN ua.id_usuario_artefato IS NOT NULL THEN true
        ELSE false
      END AS desbloqueado,
      ua.desbloqueado_em
    FROM public.artefatos a
    LEFT JOIN public.usuario_artefatos ua
      ON ua.id_artefato = a.id
     AND ua.id_usuario = $1
    WHERE a.id = $2
    LIMIT 1;
  `;

  const result = await pool.query(sql, [idUsuario, idArtefato]);
  return result.rows[0] || null;
}

async function buscarArtefatoPorModulo(idUsuario, idModulo) {
  const sql = `
    SELECT
      a.id,
      a.titulo,
      a.descricao_curta,
      a.conteudo_longo,
      a.imagem,
      a.capitulo_requisito,
      CASE
        WHEN ua.id_usuario_artefato IS NOT NULL THEN true
        ELSE false
      END AS desbloqueado,
      ua.desbloqueado_em
    FROM public.artefatos a
    LEFT JOIN public.usuario_artefatos ua
      ON ua.id_artefato = a.id
     AND ua.id_usuario = $1
    WHERE a.capitulo_requisito = $2
    LIMIT 1;
  `;

  const result = await pool.query(sql, [idUsuario, idModulo]);
  return result.rows[0] || null;
}

async function usuarioPodeColetarArtefato(idUsuario, idArtefato) {
  const sql = `
    WITH artefato AS (
      SELECT id, capitulo_requisito
      FROM public.artefatos
      WHERE id = $2
      LIMIT 1
    ),
    resultados AS (
      SELECT
        e.id_exame,
        e.id_modulo,
        ROUND(
          (COALESCE(SUM(r.nota), 0)::numeric / NULLIF(COUNT(r.id_resposta), 0)) * 100,
          2
        ) AS percentual
      FROM public.exames e
      INNER JOIN artefato a
        ON a.capitulo_requisito = e.id_modulo
      LEFT JOIN public.respostas r
        ON r.id_exame = e.id_exame
      WHERE e.id_usuario = $1
      GROUP BY e.id_exame, e.id_modulo
    )
    SELECT EXISTS (
      SELECT 1
      FROM resultados
      WHERE percentual >= 70
    ) AS pode_coletar;
  `;

  const result = await pool.query(sql, [idUsuario, idArtefato]);
  return result.rows[0]?.pode_coletar === true;
}

async function coletarArtefato(idUsuario, idArtefato) {
  const sql = `
    INSERT INTO public.usuario_artefatos (
      id_usuario,
      id_artefato
    )
    VALUES ($1, $2)
    ON CONFLICT (id_usuario, id_artefato)
    DO UPDATE SET
      desbloqueado_em = public.usuario_artefatos.desbloqueado_em
    RETURNING *;
  `;

  const result = await pool.query(sql, [idUsuario, idArtefato]);
  return result.rows[0] || null;
}

async function coletarArtefatoPorModulo(idUsuario, idModulo) {
  const sql = `
    INSERT INTO public.usuario_artefatos (
      id_usuario,
      id_artefato
    )
    SELECT
      $1,
      a.id
    FROM public.artefatos a
    WHERE a.capitulo_requisito = $2
    ON CONFLICT (id_usuario, id_artefato)
    DO UPDATE SET
      desbloqueado_em = public.usuario_artefatos.desbloqueado_em
    RETURNING *;
  `;

  const result = await pool.query(sql, [idUsuario, idModulo]);
  return result.rows[0] || null;
}

module.exports = {
  buscarArtefatosPorUsuario,
  buscarArtefatoPorId,
  buscarArtefatoPorModulo,
  usuarioPodeColetarArtefato,
  coletarArtefato,
  coletarArtefatoPorModulo,
};
