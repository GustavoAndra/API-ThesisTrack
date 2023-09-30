const projetoModel = require('../models/projetoModel');

//Função de criar o projeto
async function criarProjeto(req, res) {
    const {
        titulo,
        tema,
        delimitacao,
        resumo,
        problema,
        alunos,
        professores
    } = req.body;

    const result = await projetoModel.criarProjeto({
        titulo,
        tema,
        delimitacao,
        resumo,
        problema,
        alunos,
        professores
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

//Função de atualizar os projetos
async function atualizarProjeto(req, res) {
    const projetoId = req.params.id;
    const {
        titulo,
        tema,
        delimitacao,
        resumo,
        problema,
        alunos,
        professores
    } = req.body;

    const result = await projetoModel.atualizarProjeto(projetoId, {
        titulo,
        tema,
        delimitacao,
        resumo,
        problema,
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
    atualizarProjeto,
    deletarProjeto
};