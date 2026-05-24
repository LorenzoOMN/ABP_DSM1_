const { Router } = require("express"); 
const {   findCertificadoByHash, } = require("../repositories/certificados.repositories"); 
const authMiddleware = require("../middlewares/auth.middleware");
 
const router = Router(); 

const {
  findDesempenhoCertificado,
} = require("../repositories/certificados.repositories");
const { getCertificadoByHashController, desempenhoCertificadoController } = require("../controllers/certificados.controller");
 
/* 
curl -X GET http://localhost:3000/api/certificados/hash/HASH_DO_CERTIFICADO 
*/ 
router.get("/hash/:hash", getCertificadoByHashController); 

router.get("/desempenho", authMiddleware, desempenhoCertificadoController );

 
module.exports = router;