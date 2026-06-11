const { Router } = require("express");
const {
  getProgressoMapa,
  concluirHistoriaController,
} = require("./progresso.controller");

const router = Router();

router.get("/mapa", getProgressoMapa);

router.patch(
  "/historia/:idModulo/concluir",
  concluirHistoriaController
);

module.exports = router;