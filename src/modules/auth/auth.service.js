// src/modules/auth/auth.service.js

// Importa apenas REPOSITORIES e UTILS (nunca controller ou HTTP)
const {
  findUsuarioByCpfAndSenha,
  createUsuario
} = require("../usuarios/usuarios.repository");

const {
  isPrimeiroAcesso
} = require("../progresso/progresso.repository");

const { createToken } = require("../../shared/utils/jwt");

// ============================================================================
// FUNÇÃO: LOGIN
// ============================================================================
async function login(cpf, senha) {
  // Validações de NEGÓCIO (sem HTTP, sem res.status)
  if (!cpf || !senha) {
    throw new Error("CPF e senha são obrigatórios");
  }

  if (cpf.length !== 11) {
    throw new Error("CPF deve conter 11 números");
  }

  // Busca usuário no banco (via Repository)
  const usuario = await findUsuarioByCpfAndSenha(cpf, senha);

  // Gera token
  const token = createToken({
    id_usuario: usuario.id_usuario
  });

  // Verifica se é primeiro acesso
  const primeiro_acesso = await isPrimeiroAcesso(usuario.id_usuario);

  // Retorna dados "limpos" (sem status HTTP)
  return {
    token,
    nome: usuario.nome,
    primeiro_acesso
  };
}

// ============================================================================
// FUNÇÃO: CADASTRO (NOVA!)
// ============================================================================
async function cadastro({ nome, email, cpf, senha }) {
  // Validações de NEGÓCIO
  if (!nome || !email || !cpf || !senha) {
    throw new Error("Nome, e-mail, CPF e senha são obrigatórios");
  }

  if (cpf.length !== 11) {
    throw new Error("CPF deve conter 11 números");
  }

  if (senha.trim().length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres");
  }

  // Chama o Repository para criar o usuário
  // O repository pode lançar erro se CPF/email já existir
  const usuarioCriado = await createUsuario(nome, email, cpf, senha);

  // Retorna dados "limpos"
  return {
    id_usuario: usuarioCriado.id_usuario,
    nome: usuarioCriado.nome,
    email: usuarioCriado.email,
    cpf: usuarioCriado.cpf
  };
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
  login,
  cadastro  // ← Nova função exportada
};