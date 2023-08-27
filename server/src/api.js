const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const {
    BASE_URL,
    DB_HOST,
    DB_USER,
    DB_USER_PASS,
    DB_DATEBASE
} = require('./config');

const router = require('./routers/route');
app.use(router);

const userRoute = require("./routers/user");
app.use('/user', userRoute); 

const login = require('./routers/user');
app.use('/login', login);

// Definir as rotas do projeto
const projetoRoutes = require('./routers/projeto');
app.use('/projeto/adiciona', projetoRoutes);

const listaprojetoRoutes = require('./routers/projeto');
app.use('/projeto/listar', listaprojetoRoutes);

const atualizarProjetoRoutes = require('./routers/projeto');
app.use('/projeto/atualiza', atualizarProjetoRoutes);

const deleteProjetoRoutes = require('./routers/projeto');
app.use('/projeto/delete', deleteProjetoRoutes);

module.exports = app;