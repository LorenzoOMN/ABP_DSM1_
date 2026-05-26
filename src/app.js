// src/app.js

// Importando as respectivas bibliotecas
const express = require("express");
const path = require("path");
const cors = require('cors');

// Importando middlewares
const authMiddleware = require('./shared/middlewares/auth.middleware');

// Importando módulos (suas rotas agora estão aqui)
const authModule = require('./modules/auth');
const certificadosModule = require('./modules/certificado');
const usuariosModule = require('./modules/usuarios');
const questoesModule = require('./modules/questoes');
const progressoModule = require('./modules/progresso');
const navbarModule = require('./modules/navbar');

// Inicializa o express
const app = express();

// Habilita o CORS para todas as rotas
app.use(cors());

// Permite que o servidor receba JSON no corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS
// ==========================================
const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");
const imagensQuestoesPath = path.join(__dirname, "infra", "init", "seed-data", "imagens");

// Libera a pasta public para arquivos estáticos
app.use("/", express.static(publicPath));
// Libera a pasta assets para CSS, imagens e outros arquivos visuais
app.use("/assets", express.static(assetsPath));
// Libera as imagens das questões
app.use("/assets/img/questoes", express.static(imagensQuestoesPath));

// ==========================================
// CONFIGURAÇÃO DO EJS
// ==========================================
app.set("view engine", "ejs"); // define o EJS como motor de template
app.set("views", pagesPath);   // define a pasta de views

// ==========================================
// ROTAS DE PÁGINAS EJS (PÚBLICAS - SEM AUTH)
// ==========================================

// Rota principal
app.get("/", function (_req, res) {
    res.render("index");
});

// Rota capítulo 1
app.get("/capitulo1", function (_req, res) {
    res.render("capitulo1");
});

// Rota do mapa
app.get("/mapa", function (_req, res) {
    res.render("mapa");
});

// Rota para burndown/progresso
app.get("/burningdown", function (_req, res) {
    res.render("burningdown");
});

app.get("/desafio1", function (_req, res) {
    res.render("desafio1");
});

// Rota para questionário 1
app.get("/questionario1", function (_req, res) {
    res.render("questionario1");
});

app.get("/questionario", function (_req, res) {
    res.render("questionario1");
});

app.get("/resultado", function (_req, res) {
    res.render("resultado");
});

app.get("/artefatos", function (_req, res) {
    res.render("artefatos");
});

app.get("/perfil", function (_req, res) {
    res.render("not-found");
});

// Rota para certificado
app.get("/certificado", function (_req, res) {
    res.render("certificado");
});

// ==========================================
// ROTAS DA API (PROTEGIDAS COM AUTH)
// ==========================================

// Rota de login/register NÃO precisa de auth (é pública)
app.use("/api/auth", authModule);

// TODAS as outras rotas da API precisam de autenticação
app.use("/api/certificados", authMiddleware, certificadosModule);
app.use("/api/usuarios", authMiddleware, usuariosModule);
app.use("/api/questoes", authMiddleware, questoesModule);
app.use("/api/progresso", authMiddleware, progressoModule);
app.use("/api/navbar", authMiddleware, navbarModule);

// ==========================================
// ROTA 404 (SEMPRE POR ÚLTIMO)
// ==========================================
app.use(function (_req, res) {
    res.status(404).render("not-found");
});

module.exports = app;