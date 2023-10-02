const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers['x-access-token'];

      if (!token) {
        return res.status(401).json({ auth: false, message: 'Token não fornecido' });
      }

      let decoded;

      try {
        // Verifique se o token é válido e decodifique-o
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ auth: false, message: 'Token inválido' });
      }

      const perfil = req.headers['perfil'];

      const auth = await userModel.verifyJWT(token, perfil);

      if (!auth.auth) {
        return res.status(403).json({ auth: false, message: 'Acesso não autorizado' });
      }

      // Verifique a expiração do token usando a variável de ambiente
      const currentDatetime = new Date();
      const tokenExpirationDate = new Date(decoded.exp * 28000);
      const jwtExpirationTime = parseInt(process.env.JWT_EXPIRATION_TIME); 

      if (currentDatetime > tokenExpirationDate) {
        return res.status(401).json({ auth: false, message: 'Token expirado' });
      }

      // O usuário está autenticado
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error('Erro na middleware de autenticação:', error);
      return res.status(500).json({ auth: false, message: 'Erro interno do servidor' });
    }
  },
};