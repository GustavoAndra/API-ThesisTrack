require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = require('./routers/route');
const userRoute = require("./routers/user");
const login = require('./routers/user'); // Não é necessário importar 'user' novamente, já foi importado acima
const projetoRoutes = require('./routers/projeto');

app.use(router);

app.use('/user', userRoute); // Rota para manipulação de usuários

app.use('/login', login); // Rota para autenticação de usuários

app.use('/projeto/adiciona', projetoRoutes); // Rota para adicionar projeto

app.use('/projeto/listar', projetoRoutes); // Rota para listar projetos

app.use('/projeto/atualiza', projetoRoutes); // Rota para atualizar projeto

app.use('/projeto/delete', projetoRoutes); // Rota para deletar projeto

module.exports = app;
