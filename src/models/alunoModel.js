const { connect } = require('../models/mysqlConnect');
const dbQueries = require('../models/dbQuery/dbQuery');

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

module.exports = { listarAlunos, listarProjetosDeAluno };