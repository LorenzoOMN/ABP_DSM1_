const adminMiddleware = (req, res, next) => {
  console.log('🔍 [ADMIN] Verificando permissão...');
  console.log('🔍 [ADMIN] req.usuario:', req.usuario);
  console.log('🔍 [ADMIN] req.usuario.is_admin:', req.usuario?.is_admin);
  console.log('🔍 [ADMIN] Tipo:', typeof req.usuario?.is_admin);
  console.log('🔍 [ADMIN] É true?:', req.usuario?.is_admin === true);

  if (!req.usuario) {
    return res.status(401).json({ message: 'Usuário não autenticado' });
  }

  // Tenta diferentes formatos de is_admin
  const isAdmin = req.usuario.is_admin === true || 
                  req.usuario.is_admin === 'true' ||
                  req.usuario.is_admin === 1 ||
                  req.usuario.is_admin === 't'; // PostgreSQL as vezes retorna 't'

  console.log('🔍 [ADMIN] isAdmin result:', isAdmin);

  if (!isAdmin) {
    console.log('❌ [ADMIN] ACESSO NEGADO');
    return res.status(403).json({ 
      message: 'Acesso negado. É necessário ser administrador.' 
    });
  }

  console.log('✅ [ADMIN] ACESSO PERMITIDO');
  next();
};

module.exports = adminMiddleware;