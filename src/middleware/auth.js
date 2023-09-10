const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = {
  verifyToken: async (req, res, next) => {
    // Verifica se o cabeçalho 'x-access-token' está presente na solicitação
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ auth: false, message: 'Token não fornecido' });
    }

    try {
      // Verifica se o token é válido
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verifica se o usuário tem permissão (perfil) para acessar a rota
      const perfil = req.headers['perfil'];
      const auth = await userModel.verifyJWT(token, perfil);

      if (!auth.auth) {
        return res.status(403).json({ auth: false, message: 'Acesso não autorizado' });
      }

      // Se tudo estiver válido, o usuário está autenticado
      req.userId = decoded.id; // Você pode armazenar o ID do usuário na solicitação para uso posterior
      next();
    } catch (error) {
      return res.status(401).json({ auth: false, message: 'Token inválido' });
    }
  },
};