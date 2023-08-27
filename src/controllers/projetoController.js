const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql.infocimol.com.br',
  user: 'infocimol',
  password: 'c1i2m3o4l5',
  database: 'infocimol',
});

async function criarProjeto(req, res) {
  // Extrair informações do corpo da requisição
  const { titulo, tema, delimitacao, resumo, problema, alunos, professores } = req.body;

  try {
    // Obter uma conexão do pool de conexões
    const connection = await pool.getConnection();
    // Iniciar uma transação
    await connection.beginTransaction();

    // Inserir detalhes do projeto na tabela 'projeto'
    const projetoQuery = 'INSERT INTO projeto (titulo, tema, delimitacao, resumo, problema) VALUES (?, ?, ?, ?, ?)';
    const projetoValues = [titulo, tema, delimitacao, resumo, problema];
    const [projetoResult] = await connection.query(projetoQuery, projetoValues);

    // Obter o ID do projeto inserido
    const projetoId = projetoResult.insertId;

    // Inserir alunos associados ao projeto na tabela 'aluno_projeto'
    if (alunos && alunos.length > 0) {
      const alunoProjetoQuery = 'INSERT INTO aluno_projeto (aluno_pessoa_id_pessoa, projeto_id_projeto) VALUES (?, ?)';
      for (const aluno of alunos) {
        await connection.query(alunoProjetoQuery, [aluno.id, projetoId]);
      }
    }

    // Inserir professores associados ao projeto na tabela 'orientacao'
    if (professores && professores.length > 0) {
      const professorProjetoQuery = 'INSERT INTO orientacao (projeto_id_projeto, professor_pessoa_id_pessoa) VALUES (?, ?)';
      for (const professor of professores) {
        await connection.query(professorProjetoQuery, [projetoId, professor.id]);
      }
    }

    // Confirmar a transação
    await connection.commit();
    // Liberar a conexão de volta para o pool
    connection.release();

    return res.status(201).json({ message: 'Projeto criado com sucesso!' });
  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar o projeto.' });
  }
}

  //Lista todos os projetos existentes no banco de dados
  async function listarProjetos(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM projeto');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
}

 //Lista projeto por id específico
    async function listarProjetoPorId(req, res) {
  const projetoId = req.params.id; // Captura o ID do projeto da URL

  try {
    const [rows] = await pool.query('SELECT * FROM projeto WHERE id_projeto = ?', [projetoId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }
    return res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar projeto' });
  }
}

  //Função para atualizar os projetos existentes no banco de dados
     async function atualizarProjeto(req, res) {
  const projetoId = req.params.id;
  const { titulo, tema, delimitacao, resumo, problema, alunos, professores } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // Atualizar detalhes do projeto na tabela 'projeto'
    const projetoUpdateQuery = 'UPDATE projeto SET titulo = ?, tema = ?, delimitacao = ?, resumo = ?, problema = ? WHERE id_projeto = ?';
    const projetoUpdateValues = [titulo, tema, delimitacao, resumo, problema, projetoId];
    await connection.query(projetoUpdateQuery, projetoUpdateValues);

    // Atualizar alunos associados ao projeto na tabela 'aluno_projeto'
    if (alunos && alunos.length > 0) {
      const alunoProjetoDeleteQuery = 'DELETE FROM aluno_projeto WHERE projeto_id_projeto = ?';
      await connection.query(alunoProjetoDeleteQuery, [projetoId]);

      const alunoProjetoInsertQuery = 'INSERT INTO aluno_projeto (aluno_pessoa_id_pessoa, projeto_id_projeto) VALUES (?, ?)';
      for (const aluno of alunos) {
        await connection.query(alunoProjetoInsertQuery, [aluno.id, projetoId]);
      }
    }

    // Atualizar professores associados ao projeto na tabela 'orientacao'
    if (professores && professores.length > 0) {
      const professorProjetoDeleteQuery = 'DELETE FROM orientacao WHERE projeto_id_projeto = ?';
      await connection.query(professorProjetoDeleteQuery, [projetoId]);

      const professorProjetoInsertQuery = 'INSERT INTO orientacao (projeto_id_projeto, professor_pessoa_id_pessoa) VALUES (?, ?)';
      for (const professor of professores) {
        await connection.query(professorProjetoInsertQuery, [projetoId, professor.id]);
      }
    }

    await connection.commit();
    connection.release();

    return res.status(200).json({ message: 'Projeto atualizado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar o projeto.' });
  }
}

  //Função para deletar os projetos existentes no banco de dados
  
async function deletarProjeto(req, res) {
  const projetoId = req.params.id;

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // Deletar alunos associados ao projeto na tabela 'aluno_projeto'
    const alunoProjetoDeleteQuery = 'DELETE FROM aluno_projeto WHERE projeto_id_projeto = ?';
    await connection.query(alunoProjetoDeleteQuery, [projetoId]);

    // Deletar professores associados ao projeto na tabela 'orientacao'
    const professorProjetoDeleteQuery = 'DELETE FROM orientacao WHERE projeto_id_projeto = ?';
    await connection.query(professorProjetoDeleteQuery, [projetoId]);

    // Deletar o projeto da tabela 'projeto'
    const projetoDeleteQuery = 'DELETE FROM projeto WHERE id_projeto = ?';
    await connection.query(projetoDeleteQuery, [projetoId]);

    await connection.commit();
    connection.release();

    return res.status(200).json({ message: 'Projeto deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao deletar o projeto.' });
  }
}

module.exports = { criarProjeto, listarProjetos, listarProjetoPorId, atualizarProjeto, deletarProjeto }; 