const { connect } = require('../models/mysqlConnect');
const dbQueries = require('../models/dbQuery/dbQuery');

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

// Função para listar projetos associados a um professor específico com base no ID do professor
async function listarProjetosDoProfessor(professorId) {
    try {
        const connection = await connect(); // Conecta ao banco de dados

        const [rows] = await connection.query(dbQueries.SELECT_PROFESSOR_ORIENTADOR_ID, [professorId]);

        return { success: true, data: rows }; // Retorna a lista de projetos associados ao professor
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projetos associados ao professor' };
    }
}

module.exports = { listarProfessores, listarProjetosDoProfessor };