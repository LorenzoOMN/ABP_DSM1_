// src/modules/navbar/navbar.controller.js

// Importa apenas o SERVICE do módulo navbar
    const { getStatusNavbar, desbloquearNavbar} = require('./navbar.service');

// ============================================================================
// CONTROLLER: STATUS DA NAVBAR (ROTA PROTEGIDA)
// ============================================================================
async function statusController(req, res) {
    // 1 Controller PEGA o usuário do middleware de auth
    const idUsuario = req.usuario?.id_usuario;

    // Validação de segurança (usuário deve estar autenticado)
    if (!idUsuario) {
        return res.status(401).json({
            sucesso: false,
            error: 'Usuário não autenticado'
        });
    }

    try {
        // 2 Controller CHAMA o Service
        const status = await getStatusNavbar(idUsuario);

        // 3 Controller DEVOLVE a resposta HTTP no formato que o frontend espera
        return res.status(200).json({
            sucesso: true,
            barra_desbloqueada: status.barra_desbloqueada,
            mensagem: status.mensagem
        });

    } catch (error) {
        // 4 Controller TRADUZ erros de negócio para HTTP
        console.error('Erro ao verificar status da navbar:', error);

        return res.status(500).json({
            sucesso: false,
            error: 'Erro interno ao verificar status da navbar'
        });
    }
}

// ============================================================================
// CONTROLLER: DESBLOQUEAR NAVBAR (ROTA PROTEGIDA)
// ============================================================================
async function desbloquearController(req, res) {
    // 1 Controller PEGA dados da requisição e do usuário
    const idUsuario = req.usuario?.id_usuario;
    const { criterioAtendido } = req.body; // Pode vir do frontend ou ser decidido no backend

    // Validação de segurança
    if (!idUsuario) {
        return res.status(401).json({
            sucesso: false,
            erro: 'Usuário não autenticado'
        });
    }

    try {
        // 2 Controller CHAMA o Service
        // Se o critério não for enviado, assume true (desbloqueio automático)
        const resultado = await desbloquearNavbar(idUsuario, criterioAtendido ?? true);

        // 3 Controller DEVOLVE a resposta HTTP no formato que o frontend espera
        return res.status(200).json({
            sucesso: true,
            dados: resultado,
            alerta: {
                mensagem: 'Barra de navegação inferior desbloqueada com sucesso! Olhe Abaixo para acessar as novas funcionalidades.',
                tipo: 'sucesso' // 'sucesso', 'erro', 'info', 'aviso'
            }
        });

    } catch (error) {
        // 4️⃣ Controller TRADUZ erros de negócio para HTTP

        // Critérios não atendidos (erro de negócio, não de servidor)
        if (error.message.includes("Critérios")) {
            return res.status(400).json({
                sucesso: false,
                erro: error.message,
                alerta: {
                    mensagem: 'Você ainda não atingiu os requisitos para desbloquear esta funcionalidade',
                    tipo: 'aviso'
                }
            });
        }

        // Erro inesperado
        console.error('Erro ao desbloquear navbar:', error);

        return res.status(500).json({
            sucesso: false,
            erro: 'Erro ao desbloquear barra de navegação inferior',
            alerta: {
                mensagem: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
                tipo: 'erro'
            }
        });
    }
}

// ============================================================================
// EXPORTAÇÕES
// ============================================================================
module.exports = {
    statusController,
    desbloquearController
};