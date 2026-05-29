const { Router } = require("express");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const adminMiddleware = require("../../shared/middlewares/admin.middleware");

// Importa controllers admin
const {
  getAdminQuestoes,
  getAdminQuestaoById,
  createQuestao,
  updateQuestao,
  deleteQuestao,
} = require("./admin.controller");

const router = Router();

// ============================================================================
// ROTAS ADMINISTRATIVAS - CRUD DE QUESTÕES
// ============================================================================

// GET - Listar todas as questões (com filtros opcionais)
router.get("/questoes", authMiddleware, adminMiddleware, getAdminQuestoes);

// GET - Buscar questão específica por ID
router.get("/questoes/:id", authMiddleware, adminMiddleware, getAdminQuestaoById);

// POST - Criar nova questão
router.post("/questoes", authMiddleware, adminMiddleware, createQuestao);

// PUT - Atualizar questão completa
router.put("/questoes/:id", authMiddleware, adminMiddleware, updateQuestao);

// PATCH - Atualizar questão parcialmente
router.patch("/questoes/:id", authMiddleware, adminMiddleware, updateQuestao);

// DELETE - Deletar questão
router.delete("/questoes/:id", authMiddleware, adminMiddleware, deleteQuestao);

// ============================================================================
// EXPORTAÇÃO
// ============================================================================
module.exports = router;