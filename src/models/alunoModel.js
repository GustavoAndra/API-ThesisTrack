const { connect } = require('../models/mysqlConnect');
const dbQueries = require('../models/dbQuery/dbQuery');
const bcrypt = require("bcrypt");

// Função para listar todos os alunos
async function listarAlunos() {
    try {
        const connection = await connect(); // Conecta ao banco de dados

        // Executa a consulta para selecionar todos os alunos
        const [rows] = await connection.query(dbQueries.SELECT_ALUNO);

        return { success: true, data: rows }; // Retorna a lista de alunos com IDs e nomes
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar alunos' };
    }
}

// Função para listar os projetos de um aluno com base no ID do aluno
async function listarProjetosDeAluno(alunoId) {
    try {
        const connection = await connect(); // Conecta ao banco de dados

        // Executa a consulta para selecionar os projetos relacionados ao aluno com base no ID do aluno
        const [rows] = await connection.query(dbQueries.SELECT_ALUNO_PROJETO_ID, [alunoId]);

        return { success: true, data: rows }; // Retorna a lista de projetos relacionados ao aluno
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projetos do aluno' };
    }
}

const cadastrarAluno = async (data, cursoId, matricula) => {
  const { nome, email, senha } = data;
  const connection = await connect(); 
  try {
      await connection.beginTransaction();

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(senha, saltRounds);

      const pessoaInsertSql = 'INSERT INTO pessoa (nome, email) VALUES (?, ?)';
      const [pessoaInsertResult] = await connection.query(pessoaInsertSql, [nome, email]);

      const pessoaId = pessoaInsertResult.insertId;

      const usuarioInsertSql = 'INSERT INTO usuario (senha, pessoa_id_pessoa, perfil) VALUES (?, ?, ?)';
      await connection.query(usuarioInsertSql, [hashedPassword, pessoaId, 'aluno']);

      const alunoInsertSql = 'INSERT INTO aluno (pessoa_id_pessoa, matricula) VALUES (?, ?)';
      await connection.query(alunoInsertSql, [pessoaId, matricula]);

      if (cursoId) {
          const alunoCursoInsertSql = 'INSERT INTO aluno_curso (aluno_pessoa_id_pessoa, curso_id_curso) VALUES (?, ?)';
          await connection.query(alunoCursoInsertSql, [pessoaId, cursoId]);
      }

      await connection.commit();

      return { success: true, message: "Aluno cadastrado com sucesso" };
  } catch (error) {
      await connection.rollback();
      throw error;
  }
};

module.exports = { listarAlunos, listarProjetosDeAluno, cadastrarAluno };