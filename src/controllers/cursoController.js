const cursoModel = require('../models/cursoModel');

async function listarCurso(req, res) {
  try {
    const result = await cursoModel.listarCursos();
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

module.exports = { listarCurso };