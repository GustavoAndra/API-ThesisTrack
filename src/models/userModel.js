const dbQueries = require('../models/dbQuery/dbQuery');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const {connect} = require('./mysqlConnect');


// Função para buscar todos os usuários
const get = async () => {
  const connection = await connect(); 
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

  const connection = await connect(); 

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

    const sql = dbQueries.UPDATE_USER;
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

// Variáveis globais para armazenar o código de verificação e o horário de criação
let globalVerificationData = { code: null, timestamp: null };
const verificationCodeValidityMinutes = 20; // Tempo de validade em minutos

// Função para gerar um código de verificação aleatório com um comprimento específico
const generateVerificationCode = (length) => {
  const charset = '0123456789'; // Caracteres permitidos no código
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }

  return code;
};

const sendVerificationCode = async (email) => {
  const connection = await connect(); // Substitua por sua função de conexão

  try {
    // Gere um código de verificação aleatório de 6 caracteres
    const verificationCode = generateVerificationCode(6);

    // Insira a data e hora atual como o código na tabela codigo_usuario
    await connection.query(
      "INSERT INTO codigo_usuario (codigo, codigo_usado, usuario_pessoa_id_pessoa) VALUES (?, false, (SELECT id_pessoa FROM pessoa WHERE email = ?))",
      [verificationCode, email]
    );

    // Armazene o código de verificação e o horário de criação
    globalVerificationData = {
      code: verificationCode,
      timestamp: new Date(),
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Código de verificação",
      text: `Seu código de verificação é ${verificationCode}. Use-o para alterar sua senha. Este código é válido por ${verificationCodeValidityMinutes} minutos.`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Código gerado e enviado por e-mail");
          resolve("E-mail enviado com sucesso.");
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao enviar código de verificação.");
  }
};

// Função para verificar se o código de verificação ainda é válido
const isVerificationCodeValid = () => {
  if (
    !globalVerificationData.code ||
    !globalVerificationData.timestamp ||
    isVerificationCodeExpired()
  ) {
    return false;
  }

  return true;
};

// Função para verificar se o código de verificação expirou
const isVerificationCodeExpired = () => {
  const currentTime = new Date();
  const timeDifference = (currentTime - globalVerificationData.timestamp) / (1000 * 60);

  return timeDifference >= verificationCodeValidityMinutes;
};

const updatePassword = async (data) => {
  const { email, novaSenha, confirmSenha, codigo } = data;
  const connection = await connect(); // Substitua por sua função de conexão

  try {
    // Verifica se o e-mail existe na tabela "pessoa"
    const [pessoaResults] = await connection.query(
      "SELECT id_pessoa FROM pessoa WHERE email = ?",
      [email]
    );

    if (!pessoaResults || pessoaResults.length === 0) {
      throw new Error("E-mail de usuário inválido.");
    }

    const pessoaId = pessoaResults[0].id_pessoa;

    // Verifica se o código de verificação ainda é válido e não foi usado
    if (!isVerificationCodeValid()) {
      throw new Error("Código de verificação inválido ou expirado.");
    }

    // Verifica se o código já foi usado
    const [verificationResults] = await connection.query(
      "SELECT codigo_usado FROM codigo_usuario WHERE usuario_pessoa_id_pessoa = ? AND codigo = ?",
      [pessoaId, codigo]
    );

    if (!verificationResults || verificationResults.length === 0) {
      throw new Error("Código de verificação não encontrado.");
    }

    if (verificationResults[0].codigo_usado) {
      throw new Error("Código de verificação já foi usado.");
    }

    if (novaSenha !== confirmSenha) {
      throw new Error("A nova senha e a confirmação de senha não coincidem.");
    }

    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    // Marca o código de verificação como usado na tabela codigo_usuario
    await connection.query(
      "UPDATE codigo_usuario SET codigo_usado = true WHERE usuario_pessoa_id_pessoa = ? AND codigo = ?",
      [pessoaId, codigo]
    );

    // Atualiza a senha do usuário na tabela "usuario"
    await connection.query(
      "UPDATE usuario SET senha = ? WHERE pessoa_id_pessoa = ?",
      [hashedPassword, pessoaId]
    );

    return {
      auth: true,
      message: "Senha atualizada com sucesso!",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar senha do usuário.");
  }
};

module.exports = {get, login, verifyJWT, sendVerificationCode, updatePassword};