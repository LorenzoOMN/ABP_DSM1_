// src/modules/usuarios/usuarios.routes.js
const { Router } = require("express");
const {
  getMeController,
  updateCpfController,
  updateNomeController,
  updateEmailController,
  updateSenhaController,
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


module.exports = router;