const adminMiddleware = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  // Tenta diferentes formatos de is_admin
  const isAdmin = req.usuario.is_admin === true || 
                  req.usuario.is_admin === 'true' ||
                  req.usuario.is_admin === 1 ||
                  req.usuario.is_admin === 't'; // PostgreSQL as vezes retorna 't'

  console.log('[ADMIN] isAdmin result:', isAdmin);

  if (!isAdmin) {
    console.log('❌ [ADMIN] ACESSO NEGADO');
    return res.status(403).json({ 
      message: 'Acesso negado. É necessário ser administrador.' 
    });
  }

  console.log('[ADMIN] ACESSO PERMITIDO');
  next();
};

module.exports = adminMiddleware;