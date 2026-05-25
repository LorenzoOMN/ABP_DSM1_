// importando os respectivos arquivos que está dentro de um json.
const {
 createUsuario,
 findUsuarioById,
 updateUsuario
} = require("../repositories/usuarios.repositories");

// define o cadastro do usuário
async function createUsuarioService(nome,email,cpf,senha){
 return createUsuario(nome,email,cpf,senha);
}

async function alterarUsuario(idUsuario, dados) {
  const usuarioAtualizado = await updateUsuario(idUsuario, dados);

  if (!usuarioAtualizado) {
    return null;
  }

  return findUsuarioById(idUsuario);
}


module.exports = {
 createUsuarioService,
 alterarUsuario
};