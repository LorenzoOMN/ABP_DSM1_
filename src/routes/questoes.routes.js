const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const router = Router();

const {
  getProximaQuestaoController,
  responderQuestaoController,
  proximaTentativaController,
  proximoModuloController,
  getModulosRespondidosController,
  getResultadoAtualController,
} = require("../controllers/questoes.controller")

const {
  registrarFalhaDesafio,
  avancarDesafio,
  findProgressoDesafio,
  historiaConcluida,
} = require("../repositories/progresso.repositories");

/*
curl -X GET http://localhost:3000/api/questoes/proxima-questao \
-H "Authorization: Bearer SEU_TOKEN"
*/

router.get("/proxima-questao", authMiddleware, getProximaQuestaoController );

/* Teste salvando resposta do usuário
curl -X POST http://localhost:3000/api/questoes/responder \ 
  -H "Content-Type: application/json" \ 
  -H "Authorization: Bearer SEU_TOKEN" 
  -d '{"id_exame":"11","id_questao":"21","resposta":"c"}' 
*/
router.post("/responder", authMiddleware, responderQuestaoController);

/* implementando próxima tentativa
curl -X PATCH http://localhost:3000/api/questoes/proxima-tentativa \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
router.patch("/proxima-tentativa", authMiddleware, proximaTentativaController );
 

/* Implementando progressão de módulos
curl -X PATCH http://localhost:3000/api/questoes/proximo-modulo \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
router.patch("/proximo-modulo", authMiddleware, proximoModuloController );

/* Acompanhar progresso
curl -X GET http://localhost:3000/api/questoes/modulos-respondidos \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
router.get("/modulos-respondidos", authMiddleware, getModulosRespondidosController );

router.get("/resultado-atual", authMiddleware, getResultadoAtualController );

// exporta o "router" para outros arquivos.
module.exports = router;