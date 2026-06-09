// src/modules/usuarios/usuarios.routes.js
const { Router } = require("express");
const {
  getMeController,
  updateCpfController,
  updateNomeController,
  updateEmailController,
  updateSenhaController,
  getAvatarController,
  updateAvatarController,
  getAvataresDisponiveisController,
  getMeusAvataresController,
  equiparAvatarController
} = require("./usuario.controller");
const router = Router();


// GET /api/usuarios/me - Dados do usuário atual
router.get("/me", getMeController);

// PATCH /api/usuarios/cpf - Atualizar CPF
router.patch("/cpf", updateCpfController);


// PATCH /api/usuarios/nome - Atualizar Nome
router.patch("/nome", updateNomeController);

// PATCH /api/usuarios/email - Atualizar Email
router.patch("/email", updateEmailController);


// PATCH /api/usuarios/senha - Atualizar Senha
router.patch("/senha", updateSenhaController);

// GET /api/usuarios/avatar - Obter avatar do usuário atual
router.get("/avatar", getAvatarController);

// PATCH /api/usuarios/avatar - Atualizar avatar (seleção simples)
router.patch("/avatar", updateAvatarController);

// GET /api/usuarios/avatares - Listar avatares disponíveis no sistema
router.get("/avatares", getAvataresDisponiveisController);

// GET /api/usuarios/meus-avatares - Listar avatares desbloqueados pelo usuário
router.get("/meus-avatares", getMeusAvataresController);

// PUT /api/usuarios/avatar/equipar - Equipar um avatar
router.put("/avatar/equipar", equiparAvatarController);

module.exports = router;