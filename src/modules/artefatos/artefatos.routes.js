const { Router } = require("express");

const {
  listarArtefatosController,
  detalheArtefatoController,
  detalheArtefatoPorModuloController,
  coletarArtefatoController,
} = require("./artefatos.controller");

const router = Router();

router.get("/", listarArtefatosController);
router.get("/modulo/:idModulo", detalheArtefatoPorModuloController);
router.get("/:id", detalheArtefatoController);
router.post("/:id/coletar", coletarArtefatoController);

module.exports = router;