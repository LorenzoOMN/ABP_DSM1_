  // importando os respectivos arquivos que estão dentro de um json.
const { Router } = require("express");
// importando a função de login do controller.
const { loginController, cadastroController } = require("./auth.controller");
// criando o "router" para definir as rotas de autenticação.
const router = Router();


/* 
curl -X POST http://localhost:3000/api/auth/login\
  -H "Content-Type: application/json" \
  -d '{"cpf":"11122233344","senha":"123456"}'
*/

// implementa a rota de login.
router.post("/login", loginController);

// define o cadastro do usuário
router.post("/cadastro", cadastroController);

// exporta o "router" para outros arquivos.
module.exports = router;
