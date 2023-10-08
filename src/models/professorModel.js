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
module.exports ={listarProfessores};