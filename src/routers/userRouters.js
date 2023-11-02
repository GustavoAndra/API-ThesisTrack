const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

// Rota para obter informações do usuário
userRouter.post('/', async (req, res, next) => {
  // Chama a função do controlador para obter informações do usuário
  let user = await userController.get(req.headers);
  res.status(200).send(user);
});

// Rota para fazer login
userRouter.post('/login', async (req, res, next) => {
  // Chama a função do controlador para realizar o login do usuário
  let users = await userController.login(req.body);
  res.status(200).send(users);
});

// Rota para solicitar um código de verificação por e-mail
userRouter.post("/reset-password/request", async (req, res, next) => {
  // Chama a função do controlador para enviar um código de verificação por e-mail
  await userController.sendVerificationCode(req, res);
});

// Rota para atualizar a senha do usuário
userRouter.put("/user/reset/senha", async (req, res, next) => {
  // Chama a função do controlador para atualizar a senha do usuário
  await userController.updatePassword(req, res);
});

module.exports = userRouter;