// importando os respectivos arquivos que está dentro de um json.
const {
  createUsuario,
  findUsuarioById,
  findUsuarioByCpfAndSenha,
  insertProgressoDesafioInicial,
  verificarBarraDesbloqueada,
  desbloquearBarraNavegacao,
  updateUsuario,
  findUsuarioAvatar,
  updateUsuarioAvatar,
  findAvataresDisponiveis,
  findAvataresUsuario,
  equiparAvatarUsuario
} = require("./usuarios.repository");

// define o cadastro do usuário
async function createUsuarioService(nome, email, cpf, senha) {

  // verifica se as informações estão corretas.
  if (!cpf || !nome || !senha) {
    throw new Error("Nome, e-mail e senha são obrigatórios");
  }

  // verifica se a senha tem ao menos 6 caracteres.
  if (senha.trim().length < 6) {
    throw new Error("a senha deve ter pelo menos 6 caracteres");
  }

  return await createUsuario(nome, email, cpf, senha);
}

// ============================================================================
// PATCH CPF
// ============================================================================
async function updateUsuarioCpfService(idUsuario, cpf) {

  if (!idUsuario) {
    throw new Error("id_usuario inválido");
  }

  if (!cpf) {
    throw new Error("CPF obrigatório");
  }

  const result = await updateUsuarioCpf(idUsuario, cpf);

  if (!result) {
    throw new Error("usuário não encontrado");
  }

  return await findUsuarioById(result.id_usuario);
}

// ============================================================================
// PATCH NOME
// ============================================================================
async function updateUsuarioNomeService(idUsuario, nome) {

  if (!nome) {
    throw new Error("nome é obrigatório");
  }

  const result = await updateUsuarioNome(idUsuario, nome);

  if (!result) {
    throw new Error("usuário não encontrado");
  }

  return await findUsuarioById(result.id_usuario);
}

// ============================================================================
// PATCH EMAIL
// ============================================================================
async function updateUsuarioEmailService(idUsuario, email) {

  if (!email) {
    throw new Error("email obrigatório");
  }

  const result = await updateUsuarioEmail(idUsuario, email);

  if (!result) {
    throw new Error("usuário não encontrado");
  }

  return await findUsuarioById(result.id_usuario);
}

// ============================================================================
// PATCH SENHA
// ============================================================================
async function updateUsuarioSenhaService(idUsuario, senha) {

  if (!senha) {
    throw new Error("senha obrigatória");
  }

  if (senha.trim().length < 6) {
    throw new Error("a senha deve ter pelo menos 6 caracteres");
  }

  const result = await updateUsuarioSenha(idUsuario, senha);

  if (!result) {
    throw new Error("usuário não encontrado");
  }

  return await findUsuarioById(result.id_usuario);
}

// ============================================================================
// FUNÇÃO: BUSCAR USUÁRIO POR ID (para a rota GET /me)
// ============================================================================
async function findUsuarioByIdService(idUsuario) {
  if (!idUsuario) {
    throw new Error("ID do usuário é obrigatório");
  }

  const usuario = await findUsuarioById(idUsuario);
  
  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  // Retorna dados "limpos" (sem senha, por exemplo)
  const { senha, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}

// ============================================================================
// AVATAR - Service Functions
// ============================================================================

/**
 * Busca o avatar do usuário
 */
async function findUsuarioAvatarService(idUsuario) {
  if (!idUsuario) {
    throw new Error("ID do usuário é obrigatório");
  }

  const avatar = await findUsuarioAvatar(idUsuario);
  return avatar;
}

/**
 * Atualiza o avatar do usuário (seleção simples)
 */
async function updateUsuarioAvatarService(idUsuario, avatar) {
  if (!idUsuario) {
    throw new Error("ID do usuário é obrigatório");
  }

  if (!avatar) {
    throw new Error("Avatar é obrigatório");
  }

  // Validação básica do nome do arquivo (evitar path traversal)
  if (avatar.includes('..') || avatar.includes('/') || avatar.includes('\\')) {
    throw new Error("Nome de avatar inválido");
  }

  const result = await updateUsuarioAvatar(idUsuario, avatar);

  if (!result) {
    throw new Error("usuário não encontrado");
  }

  return result;
}

/**
 * Lista avatares disponíveis no sistema
 */
async function findAvataresDisponiveisService() {
  return await findAvataresDisponiveis();
}

/**
 * Lista avatares desbloqueados pelo usuário
 */
async function findAvataresUsuarioService(idUsuario) {
  if (!idUsuario) {
    throw new Error("ID do usuário é obrigatório");
  }

  return await findAvataresUsuario(idUsuario);
}

/**
 * Equipa um avatar para o usuário
 */
async function equiparAvatarUsuarioService(idUsuario, idAvatar) {
  if (!idUsuario) {
    throw new Error("ID do usuário é obrigatório");
  }

  if (!idAvatar) {
    throw new Error("ID do avatar é obrigatório");
  }

  const result = await equiparAvatarUsuario(idUsuario, idAvatar);
  
  if (!result) {
    throw new Error("Não foi possível equipar o avatar");
  }

  return result;
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
  createUsuarioService,
  updateUsuarioCpfService,
  updateUsuarioNomeService,
  updateUsuarioEmailService,
  updateUsuarioSenhaService,
  findUsuarioByIdService,
  findUsuarioAvatarService,
  updateUsuarioAvatarService,
  findAvataresDisponiveisService,
  findAvataresUsuarioService,
  equiparAvatarUsuarioService,
};