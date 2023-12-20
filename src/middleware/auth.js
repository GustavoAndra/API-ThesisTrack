const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers["x-access-token"];

      if (!token) {
        return res.status(401).json({ auth: false, message: "Não autorizado: Token não fornecido" });
      }

      let decoded;

      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          console.error("Chave secreta JWT não configurada");
          return res.status(500).json({ auth: false, message: "Erro interno no servidor" });
        }

        // Verifica se o token é válido, incluindo a verificação de expiração
        decoded = jwt.verify(token, jwtSecret);
      } catch (jwtError) {
        if (jwtError.name === 'TokenExpiredError') {
          return res.status(401).json({ auth: false, message: "Autenticação falhou: Token expirado" });
        }

        console.error("Token inválido:", jwtError);
        return res.status(401).json({ auth: false, message: "Autenticação falhou: Token inválido" });
      }

      try {
        const user = await userModel.login(decoded.id);
        if (!user) {
          return res.status(401).json({ auth: false, message: "Autenticação falhou: Usuário não encontrado" });
        }
      } catch (loginError) {
        console.error("Erro ao buscar usuário:", loginError);
        return res.status(500).json({ auth: false, message: "Erro no servidor ao buscar usuário" });
      }

      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Erro na autenticação:", error);
      return res.status(500).json({ auth: false, message: "Erro no servidor" });
    }
  },
};