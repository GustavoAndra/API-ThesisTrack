const { connect } = require('../models/mysqlConnect');

// Função para listar todos os professores
async function listarProfessores() {
    try {
        const connection = await connect(); // Conecta ao banco de dados
        const [rows] = await connection.query(`
            SELECT
                professor.pessoa_id_pessoa,
                pessoa.nome AS nome_professor
            FROM professor
            INNER JOIN pessoa ON professor.pessoa_id_pessoa = pessoa.id_pessoa;
        `);

        return { success: true, data: rows }; // Retorna a lista de professores com IDs e nomes
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar professores' };
    }
}
module.exports ={listarProfessores};