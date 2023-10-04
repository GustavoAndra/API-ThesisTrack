module.exports = {
  /* ------------------------USER Model (Inicio) ----------------------*/
  // Consulta para selecionar um usuário por email
  SELECT_USER: `
    SELECT p.id_pessoa as id, p.nome, p.email,
    (SELECT COUNT(pessoa_id_pessoa) FROM professor WHERE pessoa_id_pessoa=p.id_pessoa) as professor,
    (SELECT COUNT(pessoa_id_pessoa) FROM administrador WHERE pessoa_id_pessoa=p.id_pessoa) as admin,
    u.senha as senha_hash
    FROM usuario u
    JOIN pessoa p ON p.id_pessoa=u.pessoa_id_pessoa
    WHERE p.email = ?`,
  
  // Consulta para selecionar todos os usuários
  SELECT_ALL_USER: "SELECT *, (SELECT nome FROM pessoa WHERE id=u.pessoa_id_pessoa) as nome FROM usuario u",

  // Consulta para atualizar o perfil de um usuário por ID
  UPDATE_USER: 'SELECT perfil FROM usuario WHERE pessoa_id_pessoa = ?',

  // Consulta para atualizar o perfil de um usuário por ID
  UPDATE_USER_PERFIL: 'UPDATE usuario SET perfil = ? WHERE pessoa_id_pessoa = ?',
  /* ------------------------USER Model (Final) ----------------------*/


  /* ------------------------Projeto Model (Inicio) ----------------------*/
  // Consulta para inserir um novo projeto
  INSERT_PROJETO: 'INSERT INTO projeto (titulo, tema, delimitacao, resumo, problema, publico) \
  VALUES (?, ?, ?, ?, ?, ?)',

  // Consulta para inserir um aluno associado a um projeto
  INSERT_ALUNO_PROJETO: 'INSERT INTO aluno_projeto (aluno_pessoa_id_pessoa, projeto_id_projeto) VALUES (?, ?)',

  // Consulta para inserir um professor associado a um projeto
  INSERT_PROFESSOR_PROJETO: 'INSERT INTO orientacao (projeto_id_projeto, professor_pessoa_id_pessoa) \
  VALUES (?, ?)',

  // Consulta para selecionar todos os projetos com nomes dos autores e orientadores
  SELECT_PROJETOS: `
    SELECT 
      projeto.*,
      GROUP_CONCAT(DISTINCT autor.nome SEPARATOR ', ') AS autores,
      GROUP_CONCAT(DISTINCT orientador.nome SEPARATOR ', ') AS orientadores
    FROM projeto
    LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
    LEFT JOIN pessoa AS autor ON aluno_projeto.aluno_pessoa_id_pessoa = autor.id_pessoa
    LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
    LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
    WHERE projeto.publico = 1
    GROUP BY projeto.id_projeto; `,
  
  // Consulta para selecionar um projeto por ID com nomes dos autores e orientador
  SELECT_PROJETO_POR_ID: `
    SELECT 
      projeto.*,
      GROUP_CONCAT(DISTINCT autor.nome SEPARATOR ', ') AS autores,
      GROUP_CONCAT(DISTINCT orientador.nome SEPARATOR ', ') AS orientadores
    FROM projeto
    LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
    LEFT JOIN pessoa AS autor ON aluno_projeto.aluno_pessoa_id_pessoa = autor.id_pessoa
    LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
    LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
    WHERE projeto.publico = 1 AND projeto.id_projeto = ?
    GROUP BY projeto.id_projeto; `,
  
  // Consulta para verificar se um projeto com determinado ID existe
  VERIFICA_PROJETO: 'SELECT 1 FROM projeto WHERE id_projeto = ?',

  // Consulta para atualizar um projeto por ID
  UPDATE_PROJETO: 'UPDATE projeto SET titulo = ?, tema = ?, delimitacao = ?, resumo = ?, \
  problema = ?, publico = ? WHERE id_projeto = ?',

  // Consulta para excluir todos os alunos associados a um projeto
  DELETE_ALUNO_PROJETO: 'DELETE FROM aluno_projeto WHERE projeto_id_projeto = ?',

  // Consulta para excluir todos os professores associados a um projeto
  DELETE_PROFESSOR_PROJETO: 'DELETE FROM orientacao WHERE projeto_id_projeto = ?',

  // Consulta para excluir um projeto por ID
  DELETE_PROJETO: 'DELETE FROM projeto WHERE id_projeto = ?',
  /* ------------------------Projeto Model (Final) ----------------------*/


  /* ------------------------Professor Model (Inicio) ----------------------*/

  //Consulta para listar os professores orientadores
  SELECT_PROFESSOR: 'SELECT professor.pessoa_id_pessoa, pessoa.nome AS nome_professor \
  FROM professor INNER JOIN pessoa ON professor.pessoa_id_pessoa = pessoa.id_pessoa',
  /* ------------------------Professor Model (Final) ----------------------*/


  /* ------------------------Aluno Model (Inicio) ----------------------*/
  
  // Consulta para listar os alunos
  SELECT_ALUNO: `
  SELECT aluno.pessoa_id_pessoa, pessoa.nome AS nome_aluno, 
  aluno.matricula AS matricula_aluno FROM aluno
  INNER JOIN pessoa ON aluno.pessoa_id_pessoa = pessoa.id_pessoa; `,
  /* ------------------------Aluno Model (Final) ----------------------*/
};