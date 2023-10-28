const professorModel = require('../models/professorModel');

// Controlador para listar todos os professores
async function listarTodosProfessores(req, res) {
    try {
        const result = await professorModel.listarProfessores();
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

// Controlador para listar os projetos associados a um professor com base no ID do professor
async function listarProjetosDoProfessor(req, res) {
    const professorId = req.params.id; 

    try {
        const result = await professorModel.listarProjetosDoProfessor(professorId);

        if (result.success) {
            res.json(result.data);
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar projetos do professor' });
    }
}

// Controlador para cadastrar um novo professor
async function cadastrarNovoProfessor(req, res) {
    const { nome, email, senha } = req.body;

    const result = await professorModel.cadastrarNovoProfessor(nome, email, senha);

    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
}

module.exports = { listarTodosProfessores, listarProjetosDoProfessor, cadastrarNovoProfessor };