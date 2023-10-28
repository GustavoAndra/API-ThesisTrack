const professorModel = require('../models/professorModel');

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

//listar os projetos associados a um professor com base no ID do professor
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

module.exports = {listarTodosProfessores, listarProjetosDoProfessor};