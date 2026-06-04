const express = require("express");

const router = express.Router();

const perfilController = require("./perfil.controller");

router.get("/", perfilController.getPerfil);

router.put(
    "/configuracoes",
    perfilController.atualizarConfiguracoes
);

module.exports = router;