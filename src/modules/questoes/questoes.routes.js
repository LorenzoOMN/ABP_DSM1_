// src/modules/questoes/questoes.routes.js

const { Router } = require("express");


// Importa TODOS os controllers
const {
  getProximaQuestao,
  responderQuestao,
  getProximaTentativa,
  getProximoModulo, 
  getModulosRespondidos,
  getResultadoAtual,
  getStatusAtual,
  getTodasQuestoes,
} = require("./questoes.controller");

const router = Router();

// ============================================================================
// ROTAS PROTEGIDAS (todas usam authMiddleware)
// ============================================================================

// GET /api/questoes/proxima-questao
router.get("/proxima-questao", getProximaQuestao);

// POST /api/questoes/responder
router.post("/responder", responderQuestao);

// PATCH /api/questoes/proxima-tentativa
router.patch("/proxima-tentativa", getProximaTentativa);

// PATCH /api/questoes/proximo-modulo ← CORRIGIDO!
router.patch("/proximo-modulo", getProximoModulo);

// GET /api/questoes/modulos-respondidos
router.get("/modulos-respondidos", getModulosRespondidos);

// GET /api/questoes/resultado-atual
router.get("/resultado-atual", getResultadoAtual);

// GET /api/questoes/status-atual
router.get("/status-atual", getStatusAtual);

// GET /api/questoes/todas
router.get("/todas", getTodasQuestoes);

// ============================================================================
// EXPORTAÇÃO
// ============================================================================
module.exports = router;
