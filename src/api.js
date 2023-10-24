require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = require('./routers/route');
const userRoute = require("./routers/userRouters");
const projetoRoute = require('./routers/projetoRouters');
const professorRoute = require('./routers/professorRouter');
const alunoRouter = require ('./routers/alunoRouter');
// Rota para manipulação de usuários
app.use('/user', userRoute); 

// Rota para autenticação de usuários
app.use('/login', userRoute);

app.use(router);
app.use(userRoute);
app.use(projetoRoute);
app.use(professorRoute);
app.use(alunoRouter);

module.exports = app;