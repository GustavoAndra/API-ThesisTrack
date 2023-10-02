const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers["x-access-token"];

      if (!token) {
        return res.status(401).json({ auth: false, message: "Não autorizado" });
      }

      let decoded;

      // Verifica se o token é válido
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        console.error("Token inválido:", error);
        return res.status(401).json({ auth: false, message: "Token inválido" });
      }

      // Verifica se o usuário associado ao token ainda existe
      const user = await userModel.login(decoded.id);
      if (!user) {
        return res.status(401).json({ auth: false, message: "Usuário não encontrado" });
      }

      req.userId = decoded.id;
      
      next();
    } catch (error) {
      console.error("Erro na autenticação:", error);
      return res.status(500).json({ auth: false, message: "Erro no servidor" });
    }
  },
};