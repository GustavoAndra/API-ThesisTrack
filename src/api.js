require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger.json')
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = require('./routers/route');
const userRoute = require("./routers/userRouters");
const projetoRoute = require('./routers/projetoRouters');

// Rota para manipulação de usuários
app.use('/user', userRoute); 

// Rota para autenticação de usuários
app.use('/login', userRoute);

//Rota da Documentação do projeto
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);
app.use(userRoute);
app.use(projetoRoute);

module.exports = app;