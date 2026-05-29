const { Router } = require("express");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const { getProgressoMapa, concluirHistoriaController} = require("./progresso.controller");

const router = Router();

router.get("/mapa", authMiddleware, getProgressoMapa);

router.patch("/historia/:idModulo/concluir", authMiddleware, concluirHistoriaController);

module.exports = router;