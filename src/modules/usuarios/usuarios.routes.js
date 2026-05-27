// src/modules/usuarios/usuarios.routes.js
const { Router } = require("express");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const {
  getMeController,
  updateCpfController,
  updateNomeController,
  updateEmailController,
  updateSenhaController,
} = require("./usuario.controller");
const router = Router();


// GET /api/usuarios/me - Dados do usuário atual
router.get("/me", authMiddleware, getMeController);

// PATCH /api/usuarios/cpf - Atualizar CPF
router.patch("/cpf", authMiddleware, updateCpfController);

// PATCH /api/usuarios/nome - Atualizar Nome
router.patch("/nome", authMiddleware, updateNomeController);

// PATCH /api/usuarios/email - Atualizar Email
router.patch("/email", authMiddleware, updateEmailController);

// PATCH /api/usuarios/senha - Atualizar Senha
router.patch("/senha", authMiddleware, updateSenhaController);


module.exports = router;