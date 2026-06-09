const { Router } = require('express');
const {
    getPerfilController,
    getEstatisticasController,
    getRankingController,
    getHistoricoController,
    getDadosContaController,
    iniciarSessaoController,
    finalizarSessaoController
} = require('./perfil.controller');

const router = Router();

// Rota principal do perfil
router.get('/', getPerfilController);

// Estatísticas
router.get('/estatisticas', getEstatisticasController);

// Ranking
router.get('/ranking', getRankingController);

// Histórico
router.get('/historico', getHistoricoController);

// Dados da conta
router.get('/dados-conta', getDadosContaController);

// Sessão
router.post('/sessao/iniciar', iniciarSessaoController);
router.post('/sessao/finalizar', finalizarSessaoController);

module.exports = router;