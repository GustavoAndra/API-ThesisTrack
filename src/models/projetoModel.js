const { connect } = require('../models/mysqlConnect'); // Puxa a conexão com o banco de dados

// Função para criar um projeto
async function criarProjeto({
    titulo,
    tema,
    delimitacao,
    resumo,
    problema,
    publico, // Parâmetro para definir se o projeto é público ou privado
    alunos,
    professores
}) {
    const connection = await connect(); // Conecta ao banco de dados
    await connection.beginTransaction(); // Inicia uma transação no banco

    try {
        // Query para inserir um novo projeto
        const projetoQuery = 'INSERT INTO projeto (titulo, tema, delimitacao, resumo, problema, publico) VALUES (?, ?, ?, ?, ?, ?)';
        const projetoValues = [titulo, tema, delimitacao, resumo, problema, publico]; // Inclue o valor de publico na lista de valores
        const [projetoResult] = await connection.query(projetoQuery, projetoValues);

        const projetoId = projetoResult.insertId; // Obtém o ID do projeto recém-inserido

        // Verifica se existem alunos associados ao projeto e insere no banco
        if (alunos && alunos.length > 0) {
            const alunoProjetoQuery = 'INSERT INTO aluno_projeto (aluno_pessoa_id_pessoa, projeto_id_projeto) VALUES (?, ?)';
            for (const aluno of alunos) {
                await connection.query(alunoProjetoQuery, [aluno.id, projetoId]);
            }
        }

        // Verifica se existem professores associados ao projeto e insere no banco
        if (professores && professores.length > 0) {
            const professorProjetoQuery = 'INSERT INTO orientacao (projeto_id_projeto, professor_pessoa_id_pessoa) VALUES (?, ?)';
            for (const professor of professores) {
                await connection.query(professorProjetoQuery, [projetoId, professor.id]);
            }
        }

        await connection.commit(); // Confirma a transação no banco de dados

        return { success: true, message: 'Projeto criado com sucesso!' };
    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro

        console.error(error);
        return { success: false, message: 'Erro ao criar o projeto.' };
    }
}

// Função para listar todos os projetos
async function listarProjetos(usuarioId) {
    try {
        const connection = await connect(); // Conecta ao banco de dados
        const [rows] = await connection.query(`
            SELECT 
                projeto.*,
                GROUP_CONCAT(DISTINCT autor.nome SEPARATOR ', ') AS autores,
                orientador.nome AS orientador
            FROM projeto
            LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
            LEFT JOIN pessoa AS autor ON aluno_projeto.aluno_pessoa_id_pessoa = autor.id_pessoa
            LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
            LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
            WHERE projeto.publico = 1
            GROUP BY projeto.id_projeto;
        `, [usuarioId]); // Executa a consulta para listar projetos com nomes dos autores e do orientador

        return { success: true, data: rows }; // Retorna os projetos encontrados com nomes dos autores e do orientador
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projetos' };
    }
}

// Função para listar um projeto por ID
async function listarProjetoPorId(projetoId, usuarioId) {
    const connection = await connect(); // Conecta ao banco de dados
    try {
        // Consulta SQL para buscar um projeto por ID e obter nomes de autores e do orientador
        const [rows] = await connection.query(`
        SELECT 
                projeto.*,
                GROUP_CONCAT(DISTINCT autor.nome) AS autores,
                orientador.nome AS orientador
            FROM projeto
            LEFT JOIN aluno_projeto ON projeto.id_projeto = aluno_projeto.projeto_id_projeto
            LEFT JOIN pessoa AS autor ON aluno_projeto.aluno_pessoa_id_pessoa = autor.id_pessoa
            LEFT JOIN orientacao ON projeto.id_projeto = orientacao.projeto_id_projeto
            LEFT JOIN pessoa AS orientador ON orientacao.professor_pessoa_id_pessoa = orientador.id_pessoa
            WHERE projeto.publico = 1 AND projeto.id_projeto = ?
            GROUP BY projeto.id_projeto
        `, [projetoId]);
       
        if (rows.length === 0) {
            return { success: false, message: 'Projeto não encontrado' };
        }

        return { success: true, data: rows[0] }; // Retorna o projeto encontrado com nomes dos autores e do orientador
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projeto' };
    }
}

// Função para atualizar um projeto pelo ID
async function atualizarProjeto(projetoId, {
    titulo,
    tema,
    delimitacao,
    resumo,
    problema,
    publico, // Parâmetro para definir se o projeto é público ou privado
    alunos,
    professores
}) {
    const connection = await connect(); // Conecta ao banco de dados
    await connection.beginTransaction(); // Inicia uma transação no banco

    try {
        // Query para atualizar um projeto por ID
        const projetoUpdateQuery = 'UPDATE projeto SET titulo = ?, tema = ?, delimitacao = ?, resumo = ?, problema = ?, publico = ? WHERE id_projeto = ?';
        const projetoUpdateValues = [titulo, tema, delimitacao, resumo, problema, publico, projetoId];
        await connection.query(projetoUpdateQuery, projetoUpdateValues);

        // Verifica se existem alunos associados ao projeto e atualiza no banco
        if (alunos && alunos.length > 0) {
            const alunoProjetoDeleteQuery = 'DELETE FROM aluno_projeto WHERE projeto_id_projeto = ?';
            await connection.query(alunoProjetoDeleteQuery, [projetoId]);

            const alunoProjetoInsertQuery = 'INSERT INTO aluno_projeto (aluno_pessoa_id_pessoa, projeto_id_projeto) VALUES (?, ?)';
            for (const aluno of alunos) {
                await connection.query(alunoProjetoInsertQuery, [aluno.id, projetoId]);
            }
        }

        // Verifica se existem professores associados ao projeto e atualiza no banco
        if (professores && professores.length > 0) {
            const professorProjetoDeleteQuery = 'DELETE FROM orientacao WHERE projeto_id_projeto = ?';
            await connection.query(professorProjetoDeleteQuery, [projetoId]);

            const professorProjetoInsertQuery = 'INSERT INTO orientacao (projeto_id_projeto, professor_pessoa_id_pessoa) VALUES (?, ?)';
            for (const professor of professores) {
                await connection.query(professorProjetoInsertQuery, [projetoId, professor.id]);
            }
        }

        await connection.commit(); // Confirma a transação no banco de dados

        return { success: true, message: 'Projeto atualizado com sucesso!' };
    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro

        console.error(error);
        return { success: false, message: 'Erro ao atualizar o projeto.' };
    }
}

// Função para deletar um projeto
async function deletarProjeto(projetoId) {
    const connection = await connect(); // Conecta ao banco de dados
    await connection.beginTransaction(); // Inicia uma transação no banco

    try {
        // Query para deletar um projeto por ID
        const alunoProjetoDeleteQuery = 'DELETE FROM aluno_projeto WHERE projeto_id_projeto = ?';
        await connection.query(alunoProjetoDeleteQuery, [projetoId]);

        const professorProjetoDeleteQuery = 'DELETE FROM orientacao WHERE projeto_id_projeto = ?';
        await connection.query(professorProjetoDeleteQuery, [projetoId]);

        const projetoDeleteQuery = 'DELETE FROM projeto WHERE id_projeto = ?';
        await connection.query(projetoDeleteQuery, [projetoId]);

        await connection.commit(); // Confirma a transação no banco de dados

        return { success: true, message: 'Projeto deletado com sucesso!' };
    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro

        console.error(error);
        return { success: false, message: 'Erro ao deletar o projeto.' };
    }
}

module.exports = {
    criarProjeto,
    listarProjetos,
    listarProjetoPorId,
    atualizarProjeto,
    deletarProjeto
};