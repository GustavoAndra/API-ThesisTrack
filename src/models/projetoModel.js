const { connect } = require('../models/mysqlConnect'); // Puxa a conexão com o banco de dados
const dbQueries = require('../models/dbQuery/dbQuery');

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
        const [projetoResult] = await connection.query(dbQueries.INSERT_PROJETO, [titulo, tema, delimitacao, resumo, problema, publico]);

        const projetoId = projetoResult.insertId; // Obtém o ID do projeto recém-inserido

        // Verifica se existem alunos associados ao projeto e insere no banco
        if (alunos && alunos.length > 0) {
            for (const aluno of alunos) {
                await connection.query(dbQueries.INSERT_ALUNO_PROJETO, [aluno.id, projetoId]);
            }
        }

        // Verifica se existem professores associados ao projeto e insere no banco
        if (professores && professores.length > 0) {
            for (const professor of professores) {
                await connection.query(dbQueries.INSERT_PROFESSOR_PROJETO, [projetoId, professor.id]);
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
        const [rows] = await connection.query(dbQueries.SELECT_PROJETOS, [usuarioId]);

        return { success: true, data: rows };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projetos' };
    }
}

// Função para listar um projeto por ID
async function listarProjetoPorId(projetoId, usuarioId) {
    const connection = await connect(); // Conecta ao banco de dados
    try {
        const [rows] = await connection.query(dbQueries.SELECT_PROJETO_POR_ID, [projetoId]);

        if (rows.length === 0) {
            return { success: false, message: 'Projeto não encontrado' };
        }

        return { success: true, data: rows[0] };
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
        // Verifica se o projeto com o projetoId existe no banco de dados
        const [projetoExists] = await connection.query(dbQueries.VERIFICA_PROJETO, [projetoId]);

        // Se o projeto não existe, lança uma exceção
        if (projetoExists.length === 0) {
            throw new Error('Projeto não encontrado');
        }

        // Query para atualizar um projeto por ID
        await connection.query(dbQueries.UPDATE_PROJETO, [titulo, tema, delimitacao, resumo, problema, publico, projetoId]);

        // Verifica se existem alunos associados ao projeto e atualiza no banco
        if (alunos && alunos.length > 0) {
            await connection.query(dbQueries.DELETE_ALUNO_PROJETO, [projetoId]);

            for (const aluno of alunos) {
                await connection.query(dbQueries.INSERT_ALUNO_PROJETO, [aluno.id, projetoId]);
            }
        }

        // Verifica se existem professores associados ao projeto e atualiza no banco
        if (professores && professores.length > 0) {
            await connection.query(dbQueries.DELETE_PROFESSOR_PROJETO, [projetoId]);

            for (const professor of professores) {
                await connection.query(dbQueries.INSERT_PROFESSOR_PROJETO, [projetoId, professor.id]);
            }
        }

        await connection.commit(); // Confirma a transação no banco de dados

        return { success: true, message: 'Projeto atualizado com sucesso!' };
    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro

        console.error(error);

        // Verifica se a exceção foi lançada devido ao projeto não encontrado
        if (error.message === 'Projeto não encontrado') {
            return { success: false, message: 'Projeto não encontrado' };
        }

        return { success: false, message: 'Erro ao atualizar o projeto.' };
    }
}

async function deletarProjeto(projetoId) {
    const connection = await connect(); // Conecta ao banco de dados
    await connection.beginTransaction(); // Inicia uma transação no banco

    // Verifica se o projeto com o projetoId existe no banco de dados
    const [projetoExists] = await connection.query(dbQueries.VERIFICA_PROJETO, [projetoId]);

    // Se o projeto não existe, lança uma exceção
    if (projetoExists.length === 0) {
        await connection.rollback(); // Reverte a transação
        return { success: false, message: 'Projeto não encontrado' };
    }

    try {
        // Query para deletar um projeto por ID
        await connection.query(dbQueries.DELETE_ALUNO_PROJETO, [projetoId]);
        await connection.query(dbQueries.DELETE_PROFESSOR_PROJETO, [projetoId]);
        await connection.query(dbQueries.DELETE_PROJETO, [projetoId]);

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