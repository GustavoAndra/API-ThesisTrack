const { connect } = require('../models/mysqlConnect');

// Função para listar todos os alunos
async function listarAlunos() {
    try {
        const connection = await connect(); // Conecta ao banco de dados
        const [rows] = await connection.query(`
        SELECT
        aluno.pessoa_id_pessoa,
        pessoa.nome AS nome_aluno,
        aluno.matricula AS matricula_aluno
          FROM aluno
         INNER JOIN pessoa ON aluno.pessoa_id_pessoa = pessoa.id_pessoa;
    
        `);

        return { success: true, data: rows }; // Retorna a lista de alunos com IDs e nomes
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar alunos' };
    }
}

module.exports = { listarAlunos };