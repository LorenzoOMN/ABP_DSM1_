const { updateUsuarioCpf } = require("../repositories/usuarios.repositories");
const {createUsuarioService, updateUsuarioCpfService, updateUsuarioNomeService, updateUsuarioEmailService, updateUsuarioSenhaService, alterarUsuario} = require("../service/usuarios.service");

async function createusuarioController(req, res) {
  const { nome, email, senha } = req.body;
  const cpf = String(req.body.cpf || "")
    .replace(/\D/g, "")
    .slice(0, 11);

  // verifica se as informações estão corretas.
  if (!cpf || !nome || !email || !senha) {
    return res
      .status(400)
      .json({ message: "Nome, e-mail, CPF e senha são obrigatórios" });
  }

  if (cpf.length !== 11) {
    return res.status(400).json({
      message: "CPF deve conter 11 números",
    });
  }

  // verifica se a senha tem ao menos 6 caracteres.
  if (senha.trim().length < 6) {
    return res
      .status(400)
      .json({ message: "a senha deve ter pelo menos 6 caracteres" });
  }

  // verifica se já existe alguém com os dados informados.
  try {
    const result = await createUsuarioService(nome, email, cpf, senha);

    res.status(201).json(result);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "já existe um usuário com os dados informados",
      });
    }

    return res.status(409).json({
      message: "erro interno no servidor",
    });
  }
}

async function findByIdController(req, res) {
  try {
    const usuario = await findUsuarioById(req.usuario.id_usuario);

    if (!usuario) {
      return res.status(404).json({
        message: "usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (e) {
    return res.status(500).json({
      message: "erro interno do servidor",
    });
  }
}

async function updateMeController(req, res) {
  const idUsuario = req.usuario.id_usuario;
  const { nome, email, cpf, senha } = req.body;

  if (!nome && !email && !cpf && !senha) {
    return res.status(400).json({
      message: "informe ao menos um campo para atualizar",
    });
  }

  if (senha && senha.trim().length < 6) {
    return res.status(400).json({
      message: "A senha deve ter pelo menos 6 caracteres",
    });
  }

  try {
    const usuario = await alterarUsuario(idUsuario, {
      nome,
      email,
      cpf,
      senha,
    });

    if (!usuario) {
      return res.status(404).json({
        message: "usuário não encontrado",
      });
    }

    return res.status(200).json(usuario);
  } catch (e) {
    if (e && e.code == "23505") {
      return res.status(409).json({
        message: "já existe usuário com os dados informados",
      });
    }

    return res.status(409).json({
      message: "erro interno do servidor",
    });
  }
}


module.exports = {
    createusuarioController,
    findByIdController,
    updateMeController,
};