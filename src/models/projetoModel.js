const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_USER_PASS,
    database: process.env.DB_DATABASE,
});

async function criarProjeto({
    titulo,
    tema,
    delimitacao,
    resumo,
    problema,
    alunos,
    professores
}) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const projetoQuery = 'INSERT INTO projeto (titulo, tema, delimitacao, resumo, problema) VALUES (?, ?, ?, ?, ?)';
        const projetoValues = [titulo, tema, delimitacao, resumo, problema];
        const [projetoResult] = await connection.query(projetoQuery, projetoValues);

        const projetoId = projetoResult.insertId;

        if (alunos && alunos.length > 0) {
            const alunoProjetoQuery = 'INSERT INTO aluno_projeto (aluno_pessoa_id_pessoa, projeto_id_projeto) VALUES (?, ?)';
            for (const aluno of alunos) {
                await connection.query(alunoProjetoQuery, [aluno.id, projetoId]);
            }
        }

        if (professores && professores.length > 0) {
            const professorProjetoQuery = 'INSERT INTO orientacao (projeto_id_projeto, professor_pessoa_id_pessoa) VALUES (?, ?)';
            for (const professor of professores) {
                await connection.query(professorProjetoQuery, [projetoId, professor.id]);
            }
        }

        await connection.commit();
        connection.release();

        return { success: true, message: 'Projeto criado com sucesso!' };
    } catch (error) {
        await connection.rollback();
        connection.release();

        console.error(error);
        return { success: false, message: 'Erro ao criar o projeto.' };
    }
}

async function listarProjetos() {
    try {
        const [rows] = await pool.query('SELECT * FROM projeto');
        return { success: true, data: rows };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projetos' };
    }
}

async function listarProjetoPorId(projetoId) {
    try {
        const [rows] = await pool.query('SELECT * FROM projeto WHERE id_projeto = ?', [projetoId]);
        if (rows.length === 0) {
            return { success: false, message: 'Projeto não encontrado' };
        }
        return { success: true, data: rows[0] };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Erro ao buscar projeto' };
    }
}

async function atualizarProjeto(projetoId, {
    titulo,
    tema,
    delimitacao,
    resumo,
    problema,
    alunos,
    professores
}) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const projetoUpdateQuery = 'UPDATE projeto SET titulo = ?, tema = ?, delimitacao = ?, resumo = ?, problema = ? WHERE id_projeto = ?';
        const projetoUpdateValues = [titulo, tema, delimitacao, resumo, problema, projetoId];
        await connection.query(projetoUpdateQuery, projetoUpdateValues);

        if (alunos && alunos.length > 0) {
            const alunoProjetoDeleteQuery = 'DELETE FROM aluno_projeto WHERE projeto_id_projeto = ?';
            await connection.query(alunoProjetoDeleteQuery, [projetoId]);

            const alunoProjetoInsertQuery = 'INSERT INTO aluno_projeto (aluno_pessoa_id_pessoa, projeto_id_projeto) VALUES (?, ?)';
            for (const aluno of alunos) {
                await connection.query(alunoProjetoInsertQuery, [aluno.id, projetoId]);
            }
        }

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

        return { success: true, message: 'Projeto atualizado com sucesso!' };
    } catch (error) {
        await connection.rollback();
        connection.release();

        console.error(error);
        return { success: false, message: 'Erro ao atualizar o projeto.' };
    }
}

async function deletarProjeto(projetoId) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        const alunoProjetoDeleteQuery = 'DELETE FROM aluno_projeto WHERE projeto_id_projeto = ?';
        await connection.query(alunoProjetoDeleteQuery, [projetoId]);

        const professorProjetoDeleteQuery = 'DELETE FROM orientacao WHERE projeto_id_projeto = ?';
        await connection.query(professorProjetoDeleteQuery, [projetoId]);

        const projetoDeleteQuery = 'DELETE FROM projeto WHERE id_projeto = ?';
        await connection.query(projetoDeleteQuery, [projetoId]);

        await connection.commit();
        connection.release();

        return { success: true, message: 'Projeto deletado com sucesso!' };
    } catch (error) {
        await connection.rollback();
        connection.release();

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