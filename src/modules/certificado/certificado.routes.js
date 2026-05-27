const { Router } = require("express");
const authMiddleware = require("../../shared/middlewares/auth.middleware");
const { hashController, desempenhoController } = require("./certificado.controller");
const {
  findDesempenhoCertificado,
} = require("../certificado/certificado.repository");

const router = Router();

/* 
curl -X GET http://localhost:3000/api/certificados/hash/HASH_DO_CERTIFICADO 
*/
router.get("/hash/:hash", hashController);

router.get("/desempenho", authMiddleware, desempenhoController);


module.exports = router;