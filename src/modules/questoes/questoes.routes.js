//importando funções

const { Router } = require("express");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const { getProximaQuestao, responderQuestao, getProximaTentativa, getProximoModulo, getModulosRespondidos, getResultadoAtual } = require("./questoes.controller");
const router = Router();


/*
curl -X GET http://localhost:3000/api/questoes/proxima-questao \
-H "Authorization: Bearer SEU_TOKEN"
*/

router.get("/proxima-questao", authMiddleware, getProximaQuestao);

/* Teste salvando resposta do usuário
curl -X POST http://localhost:3000/api/questoes/responder \ 
  -H "Content-Type: application/json" \ 
  -H "Authorization: Bearer SEU_TOKEN" 
  -d '{"id_exame":"11","id_questao":"21","resposta":"c"}' 
*/

//Sistema de encontrar questões, registrar e checar respostas do usuário
router.post("/responder", authMiddleware, responderQuestao);

/* implementando próxima tentativa
curl -X PATCH http://localhost:3000/api/questoes/proxima-tentativa \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
router.patch("/proxima-tentativa", authMiddleware, getProximaTentativa);
 

/* Implementando progressão de módulos
curl -X PATCH http://localhost:3000/api/questoes/proximo-modulo \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
router.patch("/proximo-modulo", authMiddleware, getProximoModulo);

/* Acompanhar progresso
curl -X GET http://localhost:3000/api/questoes/modulos-respondidos \ 
  -H "Authorization: Bearer SEU_TOKEN" 
*/
router.get("/modulos-respondidos", authMiddleware, getModulosRespondidos);

router.get("/resultado-atual", authMiddleware, getResultadoAtual);

// exporta o "router" para outros arquivos.
module.exports = router;
