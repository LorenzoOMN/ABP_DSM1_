// src/config/routes.js
const authModule = require('../../modules/auth/auth.routes');
const certModule = require('../../modules/certificado/certificado.routes');
const userModule = require('../../modules/usuarios/usuarios.routes');
const questoesModule = require('../../modules/questoes/questoes.routes');
const progressoModule = require('../../modules/progresso/progresso.routes');
const navbarModule = require('../../modules/navbar/navbar.routes');

const routes = (app) => {
    // Middleware global
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });

    // Rotas públicas
    app.use('/api/auth', authModule);

    // Rotas protegidas (exemplo)
    // app.use('/api/usuarios', authMiddleware, userModule.routes);
    app.use('/api/usuarios', userModule);
    app.use('/api/certificados', certModule);
    app.use('/api/questoes', questoesModule);
    app.use('/api/progresso', progressoModule);
    app.use('/api/navbar', navbarModule);

    // Rota 404
    app.use((req, res) => {
        res.status(404).json({ error: 'Rota não encontrada' });
    });
};

module.exports = routes;