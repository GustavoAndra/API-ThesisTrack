const projetoModel = require('../models/projetoModel');

async function criarProjeto(req, res) {
    const {
        titulo,
        tema,
        delimitacao,
        resumo,
        problema,
        publico,
        alunos,
        professores
    } = req.body;

    const result = await projetoModel.criarProjeto({
        titulo,
        tema,
        delimitacao,
        resumo,
        problema,
        publico,
        alunos,
        professores,
    });

    if (result.success) {
        return res.status(201).json({ message: result.message });
    } else {
        return res.status(500).json({ message: result.message });
    }
}

//Função de listar os projetos
async function listarProjetos(req, res) {
    const result = await projetoModel.listarProjetos();

    if (result.success) {
        return res.json(result.data);
    } else {
        return res.status(500).json({ error: result.error });
    }
}

//Função de listar os projetos por id
async function listarProjetoPorId(req, res) {
    const projetoId = req.params.id;

    const result = await projetoModel.listarProjetoPorId(projetoId);

    if (result.success) {
        return res.json(result.data);
    } else {
        return res.status(404).json({ message: result.message });
    }
}

async function listarTodosProfessores(req, res) {
    try {
        const result = await projetoModel.listarProfessores();
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

//Função de atualizar os projetos
async function atualizarProjeto(req, res) {
    const projetoId = req.params.id;
    const {
        titulo,
        tema,
        delimitacao,
        resumo,
        problema,
        publico,
        alunos,
        professores
    } = req.body;

    const result = await projetoModel.atualizarProjeto(projetoId, {
        titulo,
        tema,
        delimitacao,
        resumo,
        problema,
        publico,
        alunos,
        professores
    });

    if (result.success) {
        return res.status(200).json({ message: result.message });
    } else {
        return res.status(500).json({ message: result.message });
    }
}

//Função de deletar os projetos
async function deletarProjeto(req, res) {
    const projetoId = req.params.id;

    const result = await projetoModel.deletarProjeto(projetoId);

    if (result.success) {
        return res.status(200).json({ message: result.message });
    } else {
        return res.status(500).json({ message: result.message });
    }
}

//Exports das funções
module.exports = {
    criarProjeto,
    listarProjetos,
    listarProjetoPorId,
    listarTodosProfessores,
    atualizarProjeto,
    deletarProjeto
};