// importando os respectivos arquivos que está dentro de um json.
const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const { createusuarioController, findByIdController, updateMeController } = require("../controllers/usuario.controller");

// importando as respectivas bibliotecas.
const router = Router();

// define o cadastro do usuário
router.post("/cadastro", createusuarioController);

/*
curl -X PATCH http://localhost:3000/api/usuarios/me
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d "(
    "nome": "Pedro Paulo",
    "email": "pedro.paulo@teste.com",
    "cpf": "11122233345",
    "senha": "123456"
  )"
*/
router.patch("/me", authMiddleware, updateMeController);

router.get("/me", authMiddleware, findByIdController);

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
