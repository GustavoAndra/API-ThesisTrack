const { connect } = require('./mysqlConnect');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dbQueries = require('../models/dbQuery/dbQuery'); 

// Função para buscar todos os usuários
const get = async () => {
  const connection = await connect(); // Obtenha uma conexão ao banco de dados
  try {
    const [rows] = await connection.query(dbQueries.SELECT_ALL_USER);
    return rows;
  } catch (error) {
    throw error;
  }
};

// Função para realizar o login do usuário
const login = async (data) => {
  const { email, senha } = data;

  const connection = await connect(); // Obtenha uma conexão ao banco de dados

  try {
    const sql = dbQueries.SELECT_USER
    
    const [results] = await connection.query(sql, [email]);

    let result = null;
    if (results && results.length > 0) {
      const senha_hash = results[0].senha_hash;

      // Use bcrypt para verificar a senha
      const senhaCorrespondente = await bcrypt.compare(senha, senha_hash);

      if (senhaCorrespondente) {
        const id = results[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: 28800});

        console.log("Fez login e gerou token!");

        const perfil = [];
        if (results[0].professor > 0) {
          perfil.push("professor");
        }
        if (results[0].admin > 0) {
          perfil.push("admin");
        }

        results[0].perfil = perfil;

        // Atualiza o perfil do usuário no banco de dados;
        const updateSql = dbQueries.UPDATE_USER_PERFIL;
        console.log(updateSql);
        await connection.query(updateSql, [perfil.toString(), id]);

        result = { auth: true, token, user: results[0] };
      } else {
        result = { auth: false, message: "Credenciais inválidas" };
      }
    } else {
      result = { auth: false, message: "Credenciais inválidas" };
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Função para verificar a validade do token JWT
const verifyJWT = async (token, perfil) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const connection = await connect(); // Obtenha uma conexão ao banco de dados

    const sql = dbQueries.UPDATE_USER
    const [results] = await connection.query(sql, [decoded.id]);

    if (results.length > 0) {
      const perfilList = results[0].perfil.split(",");
      if (perfilList.includes(perfil)) {
        return { auth: true, idUser: decoded.id };
      } else {
        return { auth: false, message: "Perfil Inválido!" };
      }
    } else {
      return { auth: false, message: "Perfil Inválido!" };
    }
  } catch (err) {
    return { auth: false, message: "Token inválido!" };
  }
};

module.exports = { get, login, verifyJWT};