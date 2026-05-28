/**
 * Middleware para verificar se o usuário é administrador
 * Deve ser usado APÓS o authMiddleware
 */
const adminMiddleware = (req, res, next) => {
    try {
        // Verifica se o usuário existe (injetado pelo authMiddleware)
        if (!req.usuario) {
            return res.status(401).json({
                message: 'Usuário não autenticado'
            });
        }

        // Verifica se o usuário é admin
        // Ajuste o campo conforme seu modelo de usuário (isAdmin, role, tipo_usuario, etc)
        const isAdmin = req.usuario.isAdmin ||
            req.usuario.role === 'admin' ||
            req.usuario.tipo_usuario === 'admin';

        if (!isAdmin) {
            return res.status(403).json({
                message: 'Acesso negado. É necessário ser administrador.'
            });
        }

        // Usuário é admin, continua
        next();
    } catch (error) {
        console.error('Erro no adminMiddleware:', error);
        return res.status(500).json({
            message: 'Erro ao verificar permissões de administrador'
        });
    }
};

module.exports = adminMiddleware;