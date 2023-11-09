const { connect } = require('../models/mysqlConnect'); 
const dbQueries = require('../models/dbQuery/dbQuery');

// Função para criar um novo projeto
async function criarProjeto({
    titulo, 
    tema, 
    problema, 
    resumo, 
    abstract, 
    objetivo_geral, 
    objetivo_especifico,
    url_projeto,
    arquivo,
    publico, 
    alunos,
    professores
}) {
    const connection = await connect(); // Conecta ao banco de dados

    try {
        // Query para inserir um novo projeto 
        const [projetoResult] = await connection.query(dbQueries.INSERT_PROJETO, [titulo, tema, problema, resumo, abstract, objetivo_geral, objetivo_especifico, arquivo, url_projeto, publico]);

        const projetoId = projetoResult.insertId;

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

        return { success: true, message: 'Projeto criado com sucesso!'};

    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro

        console.error(error);
        return { success: false, message: 'Erro ao criar o projeto.' };
    }
}

async function listarProjetos(usuarioId) {
    try {
        const connection = await connect(); // Conecta ao banco de dados
        const [rows] = await connection.query(dbQueries.SELECT_PROJETOS, [usuarioId]);

        // Adicione pdfContent aos dados retornados
        const projetos = rows.map(projeto => ({
            ...projeto,
            
            autores: JSON.parse(projeto.autores),
            orientadores: JSON.parse(projeto.orientadores)
        }));

        return { success: true, data: projetos };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Projeto não encontrado' };
    }
}


// Função para listar um projeto por id
async function listarProjetoPorId(projetoId) {
    try {
        const connection = await connect();
        const [rows] = await connection.query(dbQueries.SELECT_PROJETO_POR_ID, [projetoId]);

        if (rows.length === 0) {
            return { success: false, message: 'Projeto não pode ser acessado ou não existe na base de dados' };
        }

        const projeto = rows[0];

        return { success: true, data: { ...projeto, autores: JSON.parse(projeto.autores), orientadores: JSON.parse(projeto.orientadores) } };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Projeto não encontrado' };
    }
}

// Função para listar um projeto por ID de aluno
async function listarProjetoPorIdDeAluno(projetoId, pessoaId) {
    const connection = await connect(); 
    try {
        // Consulta para verificar se a pessoa está relacionada ao projeto
        const [relacionadaRows] = await connection.query(dbQueries.VERIFICA_PESSOA_PROJETO, [projetoId, pessoaId, projetoId, pessoaId]);

        if (relacionadaRows.length === 0) {
            return { success: false, message: 'Você não tem permissão para acessar este projeto' };
        }

        const [rows] = await connection.query(dbQueries.SELECT_PROJETO_POR_ID_ALUNO, [projetoId]);

        if (rows.length === 0) {
            return { success: false, message: 'Projeto não encontrado' };
        }

        const projeto = rows[0];

        return { success: true, data: { ...projeto, autores: JSON.parse(projeto.autores), orientadores: JSON.parse(projeto.orientadores) } };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projeto' };
    }
}

// Função para listar projetos de alunos relacionados a um curso específico
async function listarProjetosPorCurso(cursoId) {
    try {
        const connection = await connect();
      
        const [rows] = await connection.query(dbQueries.SELECT_CURSO_ALUNO_POR_ID, [cursoId]);

        if (rows.length === 0) {
            return { success: false, message: 'Curso não correspondente' };
        }

       // Dados retornados e converta autores e orientadores para strings JSON
        const projetos = rows.map(projeto => ({
            ...projeto,
            autores: JSON.parse(projeto.autores),
            orientadores: JSON.parse(projeto.orientadores)
        }));

        return { success: true, data: projetos };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Erro ao buscar projetos públicos por curso' };
    }
}

// Função para atualizar um projeto pelo ID
async function atualizarProjeto(projetoId, {
    titulo, 
    tema, 
    problema, 
    resumo, 
    abstract, 
    objetivo_geral, 
    objetivo_especifico,
    url_projeto,
    arquivo,
    publico, 
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
        await connection.query(dbQueries.UPDATE_PROJETO, [titulo, tema, problema, resumo, abstract, objetivo_geral, objetivo_especifico, url_projeto, arquivo, publico, projetoId]);

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

// Função para deletar um projeto pelo ID
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
    listarProjetoPorIdDeAluno,
    listarProjetosPorCurso,
    atualizarProjeto,
    deletarProjeto
};