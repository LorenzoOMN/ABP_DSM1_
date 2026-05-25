const pool = require("../database/db"); 

async function findUsuarioByCertificadoHash(certificadoHash) { 
  const result = await pool.query( 
    ` 
    SELECT 
      id_usuario, 
      nome, 
      cpf, 
      certificado_hash 
    FROM usuarios 
    WHERE certificado_hash = $1 
    LIMIT 1 
    `, 
    [certificadoHash], 
  ); 
 
  return result.rows[0] || null; 
} 
 
async function findModulos() { 
  const result = await pool.query( 
    ` 
    SELECT
      id_modulo, 
      titulo 
    FROM modulos m 
    ORDER BY 
      id_modulo ASC 
    `, 
  ); 
 
  return result.rows; 
} 
 
async function findDesempenhoCertificado(idUsuario) {
  const result = await pool.query(
    `
    SELECT
      e.id_modulo,
      ROUND(
        (
          COALESCE(SUM(r.nota), 0)::numeric /
          NULLIF(COUNT(r.id_resposta), 0)
        ) * 100,
        2
      ) AS nota
    FROM exames e
    INNER JOIN respostas r
      ON r.id_exame = e.id_exame
    WHERE e.id_usuario = $1
    GROUP BY e.id_modulo, e.id_exame
    ORDER BY e.id_modulo ASC, e.id_exame DESC
    `,
    [idUsuario]
  );

  const notas = [1, 2, 3, 4, 5].map((modulo) => {
    const tentativa = result.rows.find(
      (row) => Number(row.id_modulo) === modulo
    );

    return {
      modulo,
      nota: tentativa ? Number(tentativa.nota) : null,
    };
  });

  const notasValidas = notas.filter((item) => item.nota !== null);

  let media = null;

if (notasValidas.length > 0) {
  const somaNotas = notasValidas.reduce(function (soma, item) {
    return soma + Number(item.nota || 0);
  }, 0);

  media = Number((somaNotas / notasValidas.length).toFixed(2));
}

  return {
    notas,
    media: media !== null ? Number(media.toFixed(2)) : null,
  };
}
 
module.exports = { 
  findUsuarioByCertificadoHash, 
  findDesempenhoCertificado,
  findModulos,
}; 
