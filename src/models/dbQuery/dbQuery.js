module.exports = {
  // Índices
  INDEXES: `
    CREATE INDEX idx_email ON pessoa (email);
    CREATE INDEX idx_pessoa_id ON usuario (pessoa_id_pessoa);
    CREATE INDEX idx_projeto_id ON aluno_projeto (projeto_id_projeto);
    CREATE INDEX idx_aluno_id ON aluno_projeto (aluno_pessoa_id_pessoa);
    CREATE INDEX idx_curso_id ON aluno_curso (curso_id_curso);
  `,

  // Consulta para selecionar um usuário por email
  SELECT_USER: `
    SELECT 
      p.id_pessoa AS id, 
      p.nome, 
      p.email,
      COUNT(DISTINCT professor.pessoa_id_pessoa) AS professor,
      COUNT(DISTINCT administrador.pessoa_id_pessoa) AS admin,
      u.senha AS senha_hash
    FROM usuario u
    JOIN pessoa p ON p.id_pessoa = u.pessoa_id_pessoa
    LEFT JOIN professor ON p.id_pessoa = professor.pessoa_id_pessoa
    LEFT JOIN administrador ON p.id_pessoa = administrador.pessoa_id_pessoa
    WHERE p.email = ?
    GROUP BY p.id_pessoa`,

  // Consulta para selecionar todos os usuários
  SELECT_ALL_USER: `
    SELECT u.*, p.nome AS nome FROM usuario u
    LEFT JOIN pessoa p ON u.pessoa_id_pessoa = p.id_pessoa`,

  // Consulta para atualizar o perfil de um usuário por ID
  UPDATE_USER: 'SELECT perfil FROM usuario WHERE pessoa_id_pessoa = ?',

  // Consulta para atualizar o perfil de um usuário por ID
  UPDATE_USER_PERFIL: 'UPDATE usuario SET perfil = ? WHERE pessoa_id_pessoa = ?',

  // Consulta para inserir um novo projeto
  INSERT_PROJETO: `
    INSERT INTO projeto (titulo, tema, problema, resumo, abstract, objetivo_geral, objetivo_especifico, url_projeto, arquivo, publico, logo_projeto, ano_publicacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,


  // Consulta para inserir um aluno associado a um projeto
  INSERT_ALUNO_PROJETO: 'INSERT INTO aluno_projeto (aluno_pessoa_id_pessoa, projeto_id_projeto) VALUES (?, ?)',

  // Consulta para inserir um professor associado a um projeto
  INSERT_PROFESSOR_PROJETO: `
    INSERT INTO orientacao (projeto_id_projeto, professor_pessoa_id_pessoa)
    VALUES (?, ?)`,

  // Consulta para selecionar todos os projetos com nomes dos autores e orientadores
  SELECT_PROJETOS: `
    SELECT 
      projeto.*,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', aluno.id_pessoa, 'nome', aluno.nome)) AS autores,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', orientador.id_pessoa, 'nome', orientador.nome)) AS orientadores
    FROM projeto
    LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
    LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
    LEFT JOIN pessoa AS aluno ON aluno_projeto.aluno_pessoa_id_pessoa = aluno.id_pessoa
    LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
    WHERE projeto.publico = 1
    GROUP BY projeto.id_projeto;`,
    
  // Consulta para selecionar um projeto por ID
  SELECT_PROJETO_POR_ID: `
    SELECT 
      projeto.*,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', autor.id_pessoa, 'nome', autor.nome)) AS autores,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', orientador.id_pessoa, 'nome', orientador.nome)) AS orientadores
    FROM projeto
    LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
    LEFT JOIN pessoa AS autor ON aluno_projeto.aluno_pessoa_id_pessoa = autor.id_pessoa
    LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
    LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
    WHERE projeto.publico = 1 AND  projeto.id_projeto = ?
    GROUP BY projeto.id_projeto; `,

  // Consulta para listar projetos com um título específico
  SELECT_PROJETO_TITULO: `
    SELECT 
      projeto.*,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', aluno.id_pessoa, 'nome', aluno.nome)) AS autores,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', professor.id_pessoa, 'nome', professor.nome)) AS orientadores
    FROM projeto
    LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
    LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
    LEFT JOIN pessoa AS aluno ON aluno_projeto.aluno_pessoa_id_pessoa = aluno.id_pessoa
    LEFT JOIN pessoa AS professor ON orientacao.professor_pessoa_id_pessoa = professor.id_pessoa
    WHERE projeto.titulo LIKE ?
    AND projeto.publico = 1
    GROUP BY projeto.id_projeto
    ORDER BY projeto.id_projeto
    LIMIT 10`,

     // Consulta para listar projetos com um título específico
SELECT_PROJETO_ANO_PUBLICACAO: `
SELECT 
  projeto.*,
  JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', aluno.id_pessoa, 'nome', aluno.nome)) AS autores,
  JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', professor.id_pessoa, 'nome', professor.nome)) AS orientadores
FROM projeto
LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
LEFT JOIN pessoa AS aluno ON aluno_projeto.aluno_pessoa_id_pessoa = aluno.id_pessoa
LEFT JOIN pessoa AS professor ON orientacao.professor_pessoa_id_pessoa = professor.id_pessoa
WHERE projeto.ano_publicacao = ?
AND projeto.publico = 1
GROUP BY projeto.id_projeto`,


  // Consulta para verificar se a pessoa está relacionada a um projeto
  VERIFICA_PESSOA_PROJETO: `
    SELECT 1
    FROM aluno_projeto
    WHERE projeto_id_projeto = ? AND aluno_pessoa_id_pessoa = ?
    UNION
    SELECT 1
    FROM orientacao
    WHERE projeto_id_projeto = ? AND professor_pessoa_id_pessoa = ?;`,
  
  // Consulta para listar os projetos que um aluno está associado por ID
  SELECT_ALUNO_PROJETO_ID: `
    SELECT 
      projeto.*,
      GROUP_CONCAT(DISTINCT aluno.nome SEPARATOR ', ') AS alunos,
      GROUP_CONCAT(DISTINCT orientador.nome SEPARATOR ', ') AS orientadores
    FROM projeto
    LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
    LEFT JOIN pessoa AS aluno ON aluno_projeto.aluno_pessoa_id_pessoa = aluno.id_pessoa
    LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
    LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
    WHERE projeto.id_projeto IN (
      SELECT projeto_id_projeto FROM aluno_projeto WHERE aluno_pessoa_id_pessoa = ?
    )
    GROUP BY projeto.id_projeto;`,
  
  // Consulta para listar projetos de um curso específico
  SELECT_CURSO_ALUNO_POR_ID: `
    SELECT 
      projeto.*,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', autor.id_pessoa, 'nome', autor.nome)) AS autores,
      JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', orientador.id_pessoa, 'nome', orientador.nome)) AS orientadores
    FROM projeto
    JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
    JOIN aluno_curso ON aluno_projeto.aluno_pessoa_id_pessoa = aluno_curso.aluno_pessoa_id_pessoa
    LEFT JOIN pessoa AS autor ON aluno_projeto.aluno_pessoa_id_pessoa = autor.id_pessoa
    LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
    LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
    WHERE projeto.publico = 1
    AND aluno_curso.curso_id_curso = ?
    GROUP BY projeto.id_projeto;`,
  
  // Consulta para verificar se um projeto com determinado ID existe
  VERIFICA_PROJETO: 'SELECT 1 FROM projeto WHERE id_projeto = ?',

  // Consulta para atualizar um projeto por ID
  UPDATE_PROJETO: ` 
  UPDATE projeto SET 
    titulo=?, tema=?, problema=?, resumo=?, abstract=?, objetivo_geral=?, objetivo_especifico=?, url_projeto=?, logo_projeto=?, ano_publicacao=?, arquivo=?, publico=?
  WHERE id_projeto = ?; `,


  // Consulta para excluir todos os alunos associados a um projeto
  DELETE_ALUNO_PROJETO: 'DELETE FROM aluno_projeto WHERE projeto_id_projeto = ?',

  // Consulta para excluir todos os professores associados a um projeto
  DELETE_PROFESSOR_PROJETO: 'DELETE FROM orientacao WHERE projeto_id_projeto = ?',

  // Consulta para excluir um projeto por ID
  DELETE_PROJETO: 'DELETE FROM projeto WHERE id_projeto = ?',

  // Consulta para listar os professores orientadores
  SELECT_PROFESSOR: `
    SELECT professor.pessoa_id_pessoa, pessoa.nome AS nome_professor
    FROM professor INNER JOIN pessoa ON professor.pessoa_id_pessoa = pessoa.id_pessoa`,

// Consulta para listar os professores orientadores de um projeto por id
SELECT_PROFESSOR_ORIENTADOR_ID: `
  SELECT 
    projeto.*,
    JSON_ARRAYAGG(JSON_OBJECT('id', aluno.id_pessoa, 'nome', aluno.nome)) AS alunos,
    JSON_ARRAYAGG(JSON_OBJECT('id', professor.id_pessoa, 'nome', professor.nome)) AS orientadores
  FROM projeto
  LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
  LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
  LEFT JOIN pessoa AS aluno ON aluno_projeto.aluno_pessoa_id_pessoa = aluno.id_pessoa
  LEFT JOIN pessoa AS professor ON orientacao.professor_pessoa_id_pessoa = professor.id_pessoa
  WHERE orientacao.professor_pessoa_id_pessoa = ?
  GROUP BY projeto.id_projeto;`,

// Consulta para listar os alunos
SELECT_ALUNO: `
  SELECT aluno.pessoa_id_pessoa, pessoa.nome AS nome_aluno,
  aluno.matricula AS matricula_aluno FROM aluno
  INNER JOIN pessoa ON aluno.pessoa_id_pessoa = pessoa.id_pessoa; `,

// Consulta para listar os projetos por id de pessoa
SELECT_PROJETO_POR_ID_PESSOA: `
  SELECT 
    projeto.*,
    JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', autor.id_pessoa, 'nome', autor.nome)) AS autores,
    JSON_ARRAYAGG(DISTINCT JSON_OBJECT('id', orientador.id_pessoa, 'nome', orientador.nome)) AS orientadores
  FROM projeto
  LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
  LEFT JOIN pessoa AS autor ON aluno_projeto.aluno_pessoa_id_pessoa = autor.id_pessoa
  LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
  LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
  WHERE projeto.publico = 1 AND projeto.publico= 0 OR projeto.id_projeto = ?
  GROUP BY projeto.id_projeto; `,

// Consulta para listar os alunos e orientadores de um projeto por id de aluno
SELECT_ALUNO_PROJETO_ID: `
  SELECT 
    projeto.*,
    GROUP_CONCAT(DISTINCT aluno.nome SEPARATOR ', ') AS alunos,
    GROUP_CONCAT(DISTINCT orientador.nome SEPARATOR ', ') AS orientadores
  FROM projeto
  LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
  LEFT JOIN pessoa AS aluno ON aluno_projeto.aluno_pessoa_id_pessoa = aluno.id_pessoa
  LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
  LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
  WHERE projeto.id_projeto IN (
    SELECT projeto_id_projeto FROM aluno_projeto WHERE aluno_pessoa_id_pessoa = ?
  )
  GROUP BY projeto.id_projeto;`,

// Consulta para listar os nomes dos cursos
SELECT_CURSOS: ` SELECT nome FROM curso;`,
};