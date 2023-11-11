const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

// Rota para obter informações do usuário
userRouter.post('/', async (req, res, next) => {
  let user = await userController.get(req.headers);
  res.status(200).send(user);
});

// Rota para fazer login
userRouter.post('/login', async (req, res, next) => {
  let users = await userController.login(req.body);
  res.status(200).send(users);
});

// Rota para solicitar um código de verificação por e-mail
userRouter.post("/reset-password/request", async (req, res, next) => {
  await userController.sendVerificationCode(req, res);
});

// Rota para atualizar o perfil do usuário (nome, email ou senha) 
userRouter.put("/user/update-profile/:id", async (req, res, next) => {
  await userController.updateProfile(req, res);
});

module.exports = userRouter;