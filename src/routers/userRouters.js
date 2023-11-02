const express = require('express');
const userRouter = express.Router();
const usarioRouter = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); 

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

// Rota para solicitar um código de verificação por e-mail (protegida por autenticação JWT)
userRouter.post("/reset-password/request", authMiddleware.verifyToken , async (req, res, next) => {
  await userController.sendVerificationCode(req, res);
});

// Rota para atualizar o perfil do usuário (nome, email ou senha) (protegida por autenticação JWT)
userRouter.put("/user/update-profile/:id", authMiddleware.verifyToken, async (req, res, next) => {
  await userController.updateProfile(req, res);
});

module.exports = userRouter;