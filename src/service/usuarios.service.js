// importando os respectivos arquivos que está dentro de um json.
const {
 createUsuario,
 updateUsuarioCpf,
 findUsuarioById,
 updateUsuarioNome,
 updateUsuarioEmail,
 updateUsuarioSenha
} = require("../repositories/usuarios.repositories");

// define o cadastro do usuário
async function createUsuarioService(nome,email,cpf,senha){
 return createUsuario(nome,email,cpf,senha);
}

// PATCH CPF
async function updateUsuarioCpfService(idUsuario, cpf){
 const result = await updateUsuarioCpf(idUsuario, cpf);
 if(!result){
   return null;
 }

 return findUsuarioById(result.id_usuario);
}

// PATCH NOME
async function updateUsuarioNomeService(idUsuario,nome){
 const result = await updateUsuarioNome(idUsuario,nome);
 if(!result){
   return null
 }

 return await findUsuarioById(result.id_usuario);
}

// PATCH EMAIL
async function updateUsuarioEmailService(idUsuario,email){
 const result = await updateUsuarioEmail(idUsuario,email);
 if(!result){
   return null
 }

 return await findUsuarioById(result.id_usuario);
}

// PATCH SENHA
async function updateUsuarioSenhaService(idUsuario,senha){
 const result = await updateUsuarioSenha(idUsuario,senha);
 if(!result){
   return null
 }

 return await findUsuarioById(result.id_usuario);
};

module.exports = {
 createUsuarioService,
 updateUsuarioCpfService,
 updateUsuarioNomeService,
 updateUsuarioEmailService,
 updateUsuarioSenhaService
};