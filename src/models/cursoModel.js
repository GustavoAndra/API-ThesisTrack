const { connect } = require('../models/mysqlConnect');
const dbQueries = require('../models/dbQuery/dbQuery');

//Função para listar os cursos existentes
async function listarCursos() {
  try {
    const connection = await connect();

    const [rows] = await connection.execute(dbQueries.SELECT_CURSOS); 

    const nomesDosCursos = rows.map(row => row.nome);

    return { success: true, data: nomesDosCursos };
  } catch (error) {
    console.error('Erro ao listar os cursos:', error);
    return { success: false, error: 'Erro ao listar os cursos' };
  }
}

module.exports = {listarCursos};