const { connect } = require('../models/mysqlConnect');
const dbQueries = require('../models/dbQuery/dbQuery');

// Função para listar todos os alunos
async function listarAlunos() {
    try {
        const connection = await connect(); // Conecta ao banco de dados
        const [rows] = await connection.query(dbQueries.SELECT_ALUNO);

        return { success: true, data: rows }; // Retorna a lista de alunos com IDs e nomes
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar alunos' };
    }
}

module.exports = { listarAlunos };