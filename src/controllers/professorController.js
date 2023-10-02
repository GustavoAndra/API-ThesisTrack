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

//Exports das funções
module.exports = {
    listarTodosProfessores,
};