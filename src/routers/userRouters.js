const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.post('/', async (req, res, next) => {
  let user = await userController.get(req.headers);
  res.status(200).send(user);
});

userRouter.post('/login' , async (req, res, next) => {
  let users = await userController.login(req.body);
  res.status(200).send(users);
});

// Função para enviar o e-mail com o código de verificação
userRouter.post("/reset-password/request", async (req, res, next) => {
  await userController.sendVerificationCode(req, res);
});

// Função para trocar a senha do usuário
userRouter.put("/user/reset/senha", async (req, res, next) => {
  await userController.updatePassword(req, res);
});

module.exports = userRouter;