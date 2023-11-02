const express = require('express');
const userRouter = express.Router();
const usarioRouter = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth'); 

//Middleware de autenticação nas rotas que precisam
userRouter.use(authMiddleware.verifyToken);

// Rota para obter informações do usuário
usarioRouter.post('/', async (req, res, next) => {
  let user = await userController.get(req.headers);
  res.status(200).send(user);
});

// Rota para fazer login
usarioRouter.post('/login', async (req, res, next) => {
  let users = await userController.login(req.body);
  res.status(200).send(users);
});

// Rota para atualizar o perfil do usuário (nome e email) (protegida por autenticação JWT)
userRouter.put("/user/update-profile/:id", async (req, res, next) => {
  await userController.updateUserInfo(req, res);
});

// Rota para solicitar um código de verificação por e-mail (protegida por autenticação JWT)
userRouter.post("/reset-password/request", async (req, res, next) => {
  await userController.sendVerificationCode(req, res);
});

// Rota para atualizar a senha do usuário (protegida por autenticação JWT)
userRouter.put("/user/reset/senha", async (req, res, next) => {
  await userController.updatePassword(req, res);
});

module.exports = userRouter;