const { connect } = require('../models/mysqlConnect');
const dbQueries = require('../models/dbQuery/dbQuery');
const bcrypt = require("bcrypt");

// Função para listar todos os professores
async function listarProfessores() {
    try {
        const connection = await connect(); // Conecta ao banco de dados
        const [rows] = await connection.query(dbQueries.SELECT_PROFESSOR);

        return { success: true, data: rows }; // Retorna a lista de professores com IDs e nomes
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar professores' };
    }
}

async function listarProjetosDoProfessor(professorId) {
  try {
      const connection = await connect(); // Conecta ao banco de dados
      
      const [rows] = await connection.query(dbQueries.SELECT_PROFESSOR_ORIENTADOR_ID, [professorId]);
    
      if (rows.length === 0) {
          return { success: false, message: 'Não há projetos associados a este professor.' };
      }

        return { success: true, data: rows };
  } catch (error) {
      console.error(error);
      return { success: false, error: 'Erro ao buscar projetos associados ao professor' };
  }
}

//Função para cadastrar um novo professor no banco de dados
async function cadastrarNovoProfessor(nome, email, senha) {
  const connection = await connect(); // Conecta ao banco de dados
  try {
    await connection.beginTransaction();

    // 1. Verificar se o e-mail já existe na tabela pessoa
    const checkEmailQuery = 'SELECT id_pessoa FROM pessoa WHERE email = ?';
    const [emailCheckResult] = await connection.query(checkEmailQuery, [email]);

    if (emailCheckResult.length > 0) {
      return { success: false, message: 'O e-mail já está em uso' };
    }

    // 2. Inserir os dados na tabela pessoa
    const insertPessoaQuery = 'INSERT INTO pessoa (nome, email) VALUES (?, ?)';
    const [pessoaResult] = await connection.query(insertPessoaQuery, [nome, email]);
    const pessoaId = pessoaResult.insertId;

    // 3. Inserir os dados na tabela usuario (com a senha criptografada)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);
    const insertUsuarioQuery = 'INSERT INTO usuario (senha, pessoa_id_pessoa, perfil) VALUES (?, ?, ?)';
    await connection.query(insertUsuarioQuery, [hashedPassword, pessoaId, 'professor']);

    // 4. Inserir os dados na tabela professor
    const insertProfessorQuery = 'INSERT INTO professor (pessoa_id_pessoa) VALUES (?)';
    await connection.query(insertProfessorQuery, [pessoaId]);

    await connection.commit(); // Confirma a transação
    return { success: true, message: 'Professor cadastrado com sucesso' };
  } catch (error) {
    await connection.rollback(); // Reverte a transação em caso de erro
    console.error(error);
    return { success: false, message: 'Erro ao cadastrar professor' };
  }
}

module.exports = { listarProfessores, listarProjetosDoProfessor, cadastrarNovoProfessor };