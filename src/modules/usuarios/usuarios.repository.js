// importando as respectivas bibliotecas.
const pool = require("../../shared/database/db");

// importando o respectivo arquivos que está dentro de um json.
const { randomBytes } = require("crypto");
const { hashPassword, verifyPassword } = require("../../shared/utils/password");

// insere um novo usuário no banco de dados (pgAdmin).
async function insertUsuario(client, nome, email, cpf, senha) {
  const certificado_hash = randomBytes(24).toString("hex");
  const senhaCodificada = hashPassword(senha);

  const result = await client.query(
    `INSERT INTO usuarios (nome, email, cpf, senha, certificado_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_usuario, nome, email, cpf, certificado_hash`,
    [nome, email, cpf, senhaCodificada, certificado_hash],
  );

  return result.rows[0] || null;
}

// busca o primeiro módulo no banco de dados (pgAdmin).
async function findPrimeiroModuloId(client) {
  const result = await client.query(
    `SELECT id_modulo FROM modulos ORDER BY id_modulo LIMIT 1`,
  );

  return result.rows[0] || null;
}

// pega um grupo aleatório de questões dentro de um módulo no banco (pgAdmin).
async function findGrupoAleatorio(client, idModulo) {
  const result = await client.query(
    `SELECT grupo 
        FROM questoes
        WHERE id_modulo=$1 AND grupo IS NOT null
        GROUP BY grupo
        ORDER BY RANDOM()
        LIMIT 1`,
    [idModulo],
  );

  return result.rows[0] || null;
}

// insere um exame no banco de dados(pgAdmin).
async function insertExame(client, idModulo, idUsuario, grupo, tentativa) {
  const result = await client.query(
    `INSERT INTO exames (id_modulo, id_usuario, grupo, tentativa)
        VALUES ($1, $2, $3, $4)
        RETURNING id_exame`,
    [idModulo, idUsuario, grupo, tentativa],
  );
  return result.rows[0] || null;
}

// fluxo completo de criação de usuário + criação de exame inicial.
async function createUsuario(nome, email, cpf, senha) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const usuario = await insertUsuario(client, nome, email, cpf, senha);
    if (!usuario) {
      await client.query("ROLLBACK");
      return { error: "Problemas ao criar o usuário" };
    }
    const modulo = await findPrimeiroModuloId(client);
    if (!modulo) {
      throw new Error(
        "Nenhum módulo cadastrado para inicialiar exame do usuário",
      );
    }

    const grupo = await findGrupoAleatorio(client, modulo.id_modulo);
    if (!grupo) {
      throw new Error(
        "Nenhum grupo cadastrado para inicialiar exame do usuário",
      );
    }

    await insertExame(
      client,
      modulo.id_modulo,
      usuario.id_usuario,
      grupo.grupo,
      1,
    );

    await insertProgressoDesafioInicial(client, usuario.id_usuario);

    console.log("R:", usuario.id_usuario, modulo.id_modulo, grupo.grupo);

    await client.query("COMMIT");

    return {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
    };
  } catch (e) {
    console.error("ERRO REAL:", e);
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function findUsuarioById(idUsuario) {
  const result = await pool.query(
    `
    SELECT id_usuario, nome, email, cpf, is_admin, musica_ativa, efeitos_ativos
    FROM usuarios
    WHERE id_usuario = $1
    `,
    [idUsuario],
  );

  return result.rows[0] || null;
}

async function findUsuarioByCpfAndSenha(cpf, senha) {
  const result = await pool.query(
    `
    SELECT id_usuario, nome, email, cpf, senha, barra_desbloqueada, is_admin
    FROM usuarios
    WHERE cpf = $1
    `,
    [cpf],
  );

  const usuario = result.rows[0];

  if (!usuario) {
    throw new Error("Usuário não encontrado");  // ← ALTERE AQUI
  }

  const senhaValida = verifyPassword(senha, usuario.senha);
  if (!senhaValida) {
    throw new Error("Senha incorreta");  // ← ALTERE AQUI
  }

  // Retornar barra_desbloqueada junto com os dados do usuário
  return {
    id_usuario: usuario.id_usuario,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    barra_desbloqueada: usuario.barra_desbloqueada,
    is_admin: usuario.is_admin
  };
}

async function insertProgressoDesafioInicial(client, idUsuario) {
  const result = await client.query(
    `
    INSERT INTO progresso_desafio (
      id_usuario,
      modulo_desafio_atual,
      falhas_no_modulo,
      certificado_liberado
    )
    VALUES ($1, 1, 0, false)
    ON CONFLICT (id_usuario)
    DO NOTHING
    RETURNING id_progresso_desafio
    `,
    [idUsuario],
  );

  return result.rows[0] || null;
}

/**
 * Verifica se a navbar foi desbloqueada
 */
async function verificarBarraDesbloqueada(idUsuario) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT barra_desbloqueada FROM usuarios WHERE id_usuario = $1`,
      [idUsuario]
    );
    return result.rows[0].barra_desbloqueada;
  } catch (e) {
    console.error("ERRO REAL:", e);
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Desbloqueia a barra de navegação
 */
async function desbloquearBarraNavegacao(idUsuario) {
  const client = await pool.connect();
  try {
    console.log("Desbloqueando barra de navegação...");
    await client.query(
      `UPDATE usuarios SET barra_desbloqueada = true WHERE id_usuario = $1`,
      [idUsuario]
    );
    console.log("Barra de navegação desbloqueada.");
  } catch (e) {
    console.error("ERRO REAL:", e);
    throw e;
  } finally {
    client.release();
  }
}

async function updateUsuario(idUsuario, dados) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (dados.nome) {
    fields.push(`nome = $${paramIndex}`);
    values.push(dados.nome);
    paramIndex++;
  }

  if (dados.email) {
    fields.push(`email = $${paramIndex}`);
    values.push(dados.email);
    paramIndex++;
  }

  if (dados.cpf) {
    fields.push(`cpf = $${paramIndex}`);
    values.push(dados.cpf);
    paramIndex++;
  }

  if (dados.senha) {
    fields.push(`senha = $${paramIndex}`);
    values.push(hashPassword(dados.senha));
    paramIndex++;
  }

  if (!fields.length) {
    return null;
  }

  values.push(idUsuario);

  /*
  Explicando $${paramIndex}:
  O primeiro $ é do JavaScript, para interpolar variável dentro da template string.
  O segundo faz parte da sintaxe do PostgreSQL para parâmetros preparados: $1, $2, ...
  */
  const result = await pool.query(
    `
    UPDATE usuarios
    SET ${fields.join(", ")}
    WHERE id_usuario = $${paramIndex}
    RETURNING id_usuario
    `,
    values,
  );

  return result.rows[0] || null;
}

async function updateConfiguracoesAudio(
  idUsuario,
  musicaAtiva,
  efeitosAtivos
) {

  const result = await pool.query(
    `
      UPDATE usuarios
      SET
          musica_ativa = $2,
          efeitos_ativos = $3
      WHERE id_usuario = $1
      RETURNING musica_ativa, efeitos_ativos
      `,
    [idUsuario, musicaAtiva, efeitosAtivos]
  );

  return result.rows[0] || null;
}

// ============================================================================
// AVATAR - Repository Functions
// ============================================================================

/**
 * Busca o avatar do usuário
 */
async function findUsuarioAvatar(idUsuario) {
  const result = await pool.query(
    `SELECT avatar FROM usuarios WHERE id_usuario = $1`,
    [idUsuario]
  );

  return result.rows[0]?.avatar || 'default.png';
}

/**
 * Atualiza o avatar do usuário
 */
async function updateUsuarioAvatar(idUsuario, avatar) {
  const result = await pool.query(
    `UPDATE usuarios 
    SET avatar = $1 
    WHERE id_usuario = $2 
    RETURNING id_usuario, avatar`,
    [avatar, idUsuario]
  );

  return result.rows[0] || null;
}

/**
 * Busca lista de avatares disponíveis (se tiver tabela de avatares)
 */
async function findAvataresDisponiveis() {
  const result = await pool.query(
    `SELECT id_avatar, nome, caminho_imagem, descricao 
    FROM avatares 
    ORDER BY nome`
  );

  return result.rows || [];
}

/**
 * Busca avatares desbloqueados pelo usuário
 */
async function findAvataresUsuario(idUsuario) {
  const result = await pool.query(
    `SELECT a.id_avatar, a.nome, a.caminho_imagem, a.descricao, ua.equipado
    FROM usuario_avatares ua
    JOIN avatares a ON ua.id_avatar = a.id_avatar
    WHERE ua.id_usuario = $1
    ORDER BY a.nome`,
    [idUsuario]
  );

  return result.rows || [];
}

/**
 * Equipa um avatar para o usuário
 */
async function equiparAvatarUsuario(idUsuario, idAvatar) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verifica se o usuário tem esse avatar desbloqueado
    const check = await client.query(
      `SELECT 1 FROM usuario_avatares 
      WHERE id_usuario = $1 AND id_avatar = $2`,
      [idUsuario, idAvatar]
    );

    if (check.rowCount === 0) {
      throw new Error('Avatar não desbloqueado');
    }

    // Desequipa todos os avatares
    await client.query(
      `UPDATE usuario_avatares 
      SET equipado = false 
      WHERE id_usuario = $1`,
      [idUsuario]
    );

    // Equipa o novo avatar
    await client.query(
      `UPDATE usuario_avatares 
      SET equipado = true 
      WHERE id_usuario = $1 AND id_avatar = $2`,
      [idUsuario, idAvatar]
    );

    // Atualiza coluna avatar na tabela usuarios
    const avatarInfo = await client.query(
      `SELECT caminho_imagem FROM avatares WHERE id_avatar = $1`,
      [idAvatar]
    );

    await client.query(
      `UPDATE usuarios 
      SET avatar = $1 
      WHERE id_usuario = $2`,
      [avatarInfo.rows[0].caminho_imagem, idUsuario]
    );

    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// Atualize o module.exports no final do arquivo
module.exports = {
  createUsuario,
  findUsuarioById,
  findUsuarioByCpfAndSenha,
  insertProgressoDesafioInicial,
  verificarBarraDesbloqueada,
  desbloquearBarraNavegacao,
  updateUsuario,
  updateConfiguracoesAudio,
  findUsuarioAvatar,
  updateUsuarioAvatar,
  findAvataresDisponiveis,
  findAvataresUsuario,
  equiparAvatarUsuario
};
