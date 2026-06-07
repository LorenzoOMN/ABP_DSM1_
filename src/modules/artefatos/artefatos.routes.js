const { Router } = require("express");
const {
  // Funções para a API (JSON)
  listarArtefatosController,
  detalheArtefatoController
} = require("./artefatos.controller");

const router = Router();

// Rotas EXPLÍCITAS para a API
router.get("/", listarArtefatosController);
router.get("/:id", detalheArtefatoController);

module.exports = router;