const { Router } = require('express');
const {
    getPerfilController,
    getEstatisticasController,
    getRankingController,
    getHistoricoController,
    getDadosContaController,
    iniciarSessaoController,
    finalizarSessaoController,
    getMeusAvataresController,
    equiparAvatarController,
    getTodosAvataresController
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

// NOVO: Meus avatares
router.get('/meus-avatares', getMeusAvataresController);

// NOVO: Equipar avatar
router.put('/equipar-avatar', equiparAvatarController);

// Retorna todos os avatares
router.get('/avatares/todos', getTodosAvataresController);

// Sessão
router.post('/sessao/iniciar', iniciarSessaoController);
router.post('/sessao/finalizar', finalizarSessaoController);

module.exports = router;