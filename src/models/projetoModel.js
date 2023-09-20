const db = require('./mysqlConnect')

// Função para inserir um projeto no banco de dados
async function inserirProjeto(projeto) {
  const connection = await db.connect();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query('INSERT INTO projeto SET ?', projeto);
    const projetoId = result.insertId;

    if (projeto.alunos && projeto.alunos.length > 0) {
      const alunosValues = projeto.alunos.map((aluno) => [aluno.id, projetoId]);
      const alunosQuery = 'INSERT INTO aluno_projeto (id_aluno, id_projeto) VALUES ?';
      await connection.query(alunosQuery, [alunosValues]);
    }

    await connection.commit();

    console.log('Dados inseridos com sucesso.');
    return result;
  } catch (error) {
    console.error('Erro ao realizar a transação:', error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getAllProjetos: (callback) => {
    connection.query('SELECT * FROM projeto', callback);
  },  inserirProjeto,
};