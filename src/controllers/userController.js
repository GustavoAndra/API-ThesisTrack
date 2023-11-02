const userModel = require("../models/userModel");

// Função para obter o usuário
exports.get = async (headers) => {
  let auth;
  auth = await userModel.verifyJWT(
    headers["x-access-token"],
    headers["perfil"]
  );
  let users;
  if (auth.idUser) {
    if (headers.iduser == auth.idUser) {
      users = await userModel.get();
      return users;
    } else {
      return { status: "null", auth };
    }
  } else {
    return { status: "null", auth };
  }
};

// Função para realizar o login do usuário
exports.login = async (body) => {
  const result = await userModel.login(body);
  if (result.auth) {
    return { auth: true, token: result.token, user: result.user };
  } else {
    return { auth: false, message: "Credenciais inválidas" };
  }
};

// Função para enviar um código de verificação por e-mail
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const codigo = await userModel.sendVerificationCode(email);
    res.status(200).json({ codigo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao enviar código de verificação." });
  }
};

// Controller para trocar a senha do usuário com código de verificação
exports.updatePassword = async (req, res) => {
  const { email, novaSenha, confirmSenha, codigo } = req.body;

  try {
    // Chame a função do modelo para atualizar a senha
    const result = await userModel.updatePassword({
      email,
      novaSenha,
      confirmSenha,
      codigo,
    });

    // Retorne uma resposta de sucesso
    res.status(200).json(result);
  } catch (error) {
    // Em caso de erro, retorne uma resposta de erro
    res.status(500).json({ error: error.message });
  }
};

// Controller para atualizar as informações do usuário (nome e email)
exports.updateUserInfo = async (req, res) => {
  const userId = req.params.id;
  const { novoNome, novoEmail } = req.body;

  try {
    await userModel.updateUserInfo(userId, novoNome, novoEmail);
    res.status(200).json({ message: "Perfil atualizado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o perfil do usuário." });
  }
};