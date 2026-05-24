const { login } = require("../service/auth.service");

async function loginController(req, res) {
  const { senha } = req.body;
  const cpf = String(req.body.cpf || "")
    .replace(/\D/g, "")
    .slice(0, 11);

   if (!cpf || !senha) {
    return res.status(400).json({
      message: "CPF e senha são obrigatórios",
    });
  }

  if (cpf.length !== 11) {
    return res.status(400).json({
      message: "CPF deve conter 11 números",
    });
  }

  try {
    const resultado = await login(cpf, senha);

    return res.status(200).json(resultado);
  } catch (e) {
    if (e.message === "CPF e senha são obrigatórios") {
      return res.status(400).json({
        message: e.message,
      });
    }

    return res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = {
    loginController,
};