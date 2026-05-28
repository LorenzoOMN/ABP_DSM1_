const { Router } = require("express");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const {
  // Funções para a API (JSON)
  listarArtefatosController,
  detalheArtefatoController
} = require("./artefatos.controller");

const router = Router();

// Rotas EXPLÍCITAS para a API
router.get("/", authMiddleware, listarArtefatosController);
router.get("/:id", authMiddleware, detalheArtefatoController);

module.exports = router;