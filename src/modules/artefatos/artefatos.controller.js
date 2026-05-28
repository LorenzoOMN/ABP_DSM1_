// importando o repositório de artefatos.
const artefatosService = require("./artefatos.service");

// ============================================================================
// CONTROLLER: LISTAR ARTEFATOS - API (GET /api/artefatos) - Retorna JSON
// ============================================================================
async function listarArtefatosController(req, res) {
  const idUsuario = req.usuario?.id_usuario;

  if (!idUsuario) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  try {
    const artefatos = await artefatosService.listarArtefatosDoUsuario(idUsuario);
    return res.status(200).json({ success: true, data: artefatos });
  } catch (error) {
    console.error("Erro em listarArtefatosController:", error);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
}

// ============================================================================
// CONTROLLER: DETALHE DO ARTEFATO - API (GET /api/artefatos/:id) - Retorna JSON
// ============================================================================
async function detalheArtefatoController(req, res) {
  const idUsuario = req.usuario?.id_usuario;
  const idArtefato = parseInt(req.params.id);

  if (!idUsuario) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (!idArtefato || isNaN(idArtefato)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const artefato = await artefatosService.obterArtefato(idUsuario, idArtefato);

    if (!artefato) {
      return res.status(404).json({ message: "Artefato não encontrado" });
    }

    return res.status(200).json({ success: true, data: artefato });
  } catch (error) {
    console.error("Erro em detalheArtefatoController:", error);
    return res.status(500).json({ success: false, message: "Erro interno" });
  }
}

// ============================================================================
// EXPORTAÇÕES (ATUALIZADAS)
// ============================================================================
module.exports = {
  listarArtefatosController,
  detalheArtefatoController,
};