const userModel = require("../models/userModel");

// Função para buscar usuários (talvez essa função precise ser mais específica)
exports.get = async (headers) => {
  try {
    if (headers['perfil'] !== "admin") {
      return { status: "null", msg: "Operação não permitida" };
    }

    const authenticationResult = await userModel.verifyJWT(headers['x-access-token'], headers['perfil']);

    if (!authenticationResult.idUser) {
      return { status: "null", auth: authenticationResult };
    }

    if (headers.iduser != authenticationResult.idUser) {
      return { status: "null", auth: authenticationResult };
    }

    const users = await userModel.get();
    return users;
  } catch (error) {
    console.error(error);
    return { status: "error", message: 'Erro ao buscar usuários' };
  }
};

// Função para fazer login de usuário
exports.login = async (body) => {
  try {
    const result = await userModel.login(body);

    if (result.auth) {
      return { auth: true, token: result.token, user: result.user };
    } else {
      return { auth: false, message: 'Credenciais inválidas' };
    }
  } catch (error) {
    console.error(error);
    return { auth: false, message: 'Erro ao fazer login' };
  }
};