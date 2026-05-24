// importando os respectivos arquivos que está dentro de um json.
const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { createusuarioController, updateCpfController, findByIdController, updateNomeController, updateEmailController, updateSenhaController } = require("../controllers/usuario.controller");

// importando as respectivas bibliotecas.
const router = Router();

// define o cadastro do usuário
router.post("/cadastro", createusuarioController);

// PATCH /api/usuarios/10/cpf
/*
curl -X PATCH http://localhost:3000/api/usuarios/cpf \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"cpf":"11122233344"}'
*/

router.patch("/cpf", authMiddleware, updateCpfController);

router.get("/me", authMiddleware, findByIdController);

/*
curl -X PATCH http://localhost:3000/api/usuarios/nome \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"nome":"Maria"}'
*/

router.patch("/nome", authMiddleware, updateNomeController);

/*
curl -X PATCH http://localhost:3000/api/usuarios/email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"email":"ana.clara@teste.com"}'
*/

router.patch("/email", authMiddleware, updateEmailController);

/*
curl -X PATCH http://localhost:3000/api/usuarios/senha \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"senha":"123aaa"}'
*/

router.patch("/senha", authMiddleware, updateSenhaController);

function getIdUsuario(params) {
  const idUsuario = Number(params.idUsuario);

  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    return null;
  }

  return idUsuario;
}

// exporta o "router" para outros arquivos.
module.exports = router;

// ignore o resto.

/*
curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"nome":"Ana","email":"ana@email.com","cpf":"12345678901","senha":"123","grupo":1}'

curl -X POST http://localhost:3000/api \
    -H "Content-Type: application/json" \
    -d '{"emal":"ana@email.com","cpf":"12345678901","senha":"123","grupo":1}'
*/
