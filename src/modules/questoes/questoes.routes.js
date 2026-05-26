// src/modules/questoes/questoes.routes.js

const { Router } = require("express");
const authMiddleware = require("../../shared/middlewares/auth.middleware");

// Importa TODOS os controllers
const {
  getProximaQuestao,
  responderQuestao,
  getProximaTentativa,
  getProximoModulo, 
  getModulosRespondidos,
  getResultadoAtual,
} = require("./questoes.controller");

const router = Router();

// ============================================================================
// ROTAS PROTEGIDAS (todas usam authMiddleware)
// ============================================================================

// GET /api/questoes/proxima-questao
router.get("/proxima-questao", authMiddleware, getProximaQuestao);

// POST /api/questoes/responder
router.post("/responder", authMiddleware, responderQuestao);

// PATCH /api/questoes/proxima-tentativa
router.patch("/proxima-tentativa", authMiddleware, getProximaTentativa);

// PATCH /api/questoes/proximo-modulo ← CORRIGIDO!
router.patch("/proximo-modulo", authMiddleware, getProximoModulo);

// GET /api/questoes/modulos-respondidos
router.get("/modulos-respondidos", authMiddleware, getModulosRespondidos);

// GET /api/questoes/resultado-atual
router.get("/resultado-atual", authMiddleware, getResultadoAtual);

// ============================================================================
// EXPORTAÇÃO
// ============================================================================
module.exports = router;