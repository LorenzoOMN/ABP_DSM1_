// importando os respectivos arquivos que estão dentro de um json.
const { Router } = require("express");
const { 
  loginController 
} = require("../controllers/auth.controller");
const authService = require("../service/auth.service");

/* 
curl -X POST http://localhost:3000/api/auth/login\
  -H "Content-Type: application/json" \
  -d '{"cpf":"11122233344","senha":"123456"}'
*/

// importando a rota para esse arquivo.
const router = Router();

// implementa a rota de login.
router.post("/login", loginController);

// exporta o "router" para outros arquivos.
module.exports = router;
