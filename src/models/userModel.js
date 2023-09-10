const jwt = require("jsonwebtoken");
const { connect } = require('./mysqlConnect');

// Função para buscar todos os usuários
const get = async () => {
  const connection = await connect(); // Obtenha uma conexão ao banco de dados
  try {
    const [rows] = await connection.query("SELECT *, (SELECT nome FROM pessoa WHERE id=u.pessoa_id_pessoa) as nome FROM usuario u");
    return rows;
  } catch (error) {
    throw error;
  }
};

// Função para realizar o login do usuário
const login = async (data) => {
  const { email, senha } = data;
  const md5 = require("md5");
  const connection = await connect(); // Obtenha uma conexão ao banco de dados

  try {
    const sql =
      `SELECT p.id_pessoa as id, p.nome, p.email, ` +
      `(SELECT COUNT(pessoa_id_pessoa) FROM professor WHERE pessoa_id_pessoa=p.id_pessoa) as professor, ` +
      `(SELECT COUNT(pessoa_id_pessoa) FROM administrador WHERE pessoa_id_pessoa=p.id_pessoa) as admin ` +
      `FROM usuario u ` +
      `JOIN pessoa p ON p.id_pessoa=u.pessoa_id_pessoa ` +
      `WHERE p.email = ? AND u.senha = ?`;

    const [results] = await connection.query(sql, [email, md5(senha)]);

    let result = null;
    if (results && results.length > 0) {
      const id = results[0].id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });

      console.log("Fez login e gerou token!");

      const perfil = [];
      if (results[0].professor > 0) {
        perfil.push("professor");
      }
      if (results[0].admin > 0) {
        perfil.push("admin");
      }

      results[0].perfil = perfil;

      // Atualiza o perfil do usuário no banco de dados
      const updateSql = "UPDATE usuario SET perfil = ? WHERE pessoa_id_pessoa = ?";
      console.log(updateSql);
      await connection.query(updateSql, [perfil.toString(), id]);

      result = { auth: true, token, user: results[0] };
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

    const sql = "SELECT perfil FROM usuario WHERE pessoa_id_pessoa = ?";
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

module.exports = { get, login, verifyJWT };