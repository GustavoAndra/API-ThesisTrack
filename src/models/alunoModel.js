const { connect } = require('../models/mysqlConnect');
const dbQueries = require('../models/dbQuery/dbQuery');
const bcrypt = require("bcrypt");

// Função para listar todos os alunos
async function listarAlunos() {
    try {
        const connection = await connect(); // Conecta ao banco de dados

        // Executa a consulta para selecionar todos os alunos
        const [rows] = await connection.query(dbQueries.SELECT_ALUNO);

        return { success: true, data: rows };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar alunos' };
    }
}

// Função para listar os projetos de um aluno com base no ID do aluno
async function listarProjetosDeAluno(alunoId) {
    try {
        const connection = await connect(); 

        // Executa a consulta para selecionar os projetos relacionados ao aluno com base no ID do aluno
        const [rows] = await connection.query(dbQueries.SELECT_ALUNO_PROJETO_ID, [alunoId]);

        return { success: true, data: rows }; 
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projetos do aluno' };
    }
}

// Função para cadastrar um aluno
const cadastrarAluno = async (data, cursoId, matricula) => {
    const { nome, email, senha } = data;
    const connection = await connect();
    try {
        await connection.beginTransaction();

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        //Verificar se o e-mail já existe na tabela pessoa
        const checkEmailQuery = 'SELECT id_pessoa FROM pessoa WHERE email = ?';
        const [emailCheckResult] = await connection.query(checkEmailQuery, [email]);

        if (emailCheckResult.length > 0) {
            return { success: false, message: 'O e-mail já está em uso' };
        }

        //Verificar se a matrícula já está cadastrada na tabela aluno
        const checkMatriculaQuery = 'SELECT pessoa_id_pessoa FROM aluno WHERE matricula = ?';
        const [matriculaCheckResult] = await connection.query(checkMatriculaQuery, [matricula]);

        if (matriculaCheckResult.length > 0) {
            return { success: false, message: 'A matrícula já está em uso' };
        }

        //Inserir os dados na tabela pessoa
        const pessoaInsertSql = 'INSERT INTO pessoa (nome, email) VALUES (?, ?)';
        const [pessoaInsertResult] = await connection.query(pessoaInsertSql, [nome, email]);
        const pessoaId = pessoaInsertResult.insertId;

        //Inserir os dados na tabela usuario (com a senha criptografada)
        const usuarioInsertSql = 'INSERT INTO usuario (senha, pessoa_id_pessoa, perfil) VALUES (?, ?, ?)';
        await connection.query(usuarioInsertSql, [hashedPassword, pessoaId, 'aluno']);

        //Inserir os dados na tabela aluno (incluindo a matrícula)
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