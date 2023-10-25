const { connect } = require('../models/mysqlConnect');

async function listaCurso() {
  try {
    const connection = await connect();

    const sql = "SELECT nome FROM curso"; // Lista só o nome dos cursos
    const [rows] = await connection.execute(sql);
    const nomesDosCursos = rows.map(row => row.nome);

    return { success: true, data: nomesDosCursos };
  } catch (error) {
    console.error('Erro ao listar os cursos:', error);
    return { success: false, error: 'Erro ao listar os cursos' };
  }
}

module.exports = { listaCurso };