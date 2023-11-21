const { connect } = require('../models/mysqlConnect'); 
const dbQueries = require('../models/dbQuery/dbQuery');
const nodemailer = require('nodemailer');

// Função para criar um novo projeto e enviar e-mail para o professor
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
    logo_projeto,
    alunos,
    professores,
    ano_publicacao 
}) {
    const connection = await connect(); // Conecta ao banco de dados

    try {
        // Query para inserir um novo projeto 
        const [projetoResult] = await connection.query(dbQueries.INSERT_PROJETO, [titulo, tema, problema, resumo, abstract, objetivo_geral, objetivo_especifico, url_projeto, arquivo, publico, logo_projeto, ano_publicacao]);

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

                // Consulta para obter o e-mail e nome do professor
                const [professorData] = await connection.query(dbQueries.SELECT_EMAIL_BY_PROFESSOR_ID, [professor.id]);

                if (professorData.length > 0 && professorData[0].email) {
                    const professorEmail = professorData[0].email;
                    const professorNome = professorData[0].nome;

                    // Consulta para obter os nomes dos estudantes associados ao projeto
                    const [alunosData] = await connection.query(dbQueries.SELECT_NAMES_BY_PROJECT_ID, [projetoId]);

                    if (alunosData.length > 0) {
                        // Extrai os nomes dos estudantes
                        const nomesAlunos = alunosData.map(aluno => aluno.nome);

                        // Verifica o número de autores
                        let autoresString = '';
                        if (nomesAlunos.length === 1) {
                            autoresString = nomesAlunos[0];
                        } else if (nomesAlunos.length === 2) {
                            autoresString = `${nomesAlunos[0]} e ${nomesAlunos[1]}`;
                        } else {
                            autoresString = `${nomesAlunos.slice(0, -1).join(', ')}, e ${nomesAlunos.slice(-1)}`;
                        }

                        // Envia e-mail para o professor
                        try {
                            const emailContent = `Você foi selecionado como orientador do projeto "${titulo}". Dos autores: ${autoresString}`;
                            await enviarEmail(professorEmail, 'Notificação de Orientação de Projeto', emailContent);
                            console.log(`E-mail enviado para o professor ${professorNome}`);
                        } catch (emailError) {
                            console.error(`Erro ao enviar e-mail para o professor ${professorNome}:`, emailError);
                        }
                    } else {
                        console.error(`Nenhum aluno encontrado para o projeto com ID ${projetoId}`);
                    }
                } else {
                    console.error(`E-mail não encontrado para o professor com ID ${professor.id}`);
                }
            }
        }

        return { success: true, message: 'Projeto criado com sucesso!'};

    } catch (error) {
        await connection.rollback(); // Reverte a transação em caso de erro

        console.error(error);
        return { success: false, message: 'Erro ao criar o projeto.' };
    }
}

// Função para enviar e-mail usando Nodemailer
async function enviarEmail(destinatario, assunto, tituloProjeto) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    // Estilização da mensagem de e-mail
    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f5f5f5;
          color: #333;
        }
    
        .container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
    
        h2 {
          color: #1DA1F2;
        }
    
        p {
          color: #333;
          line-height: 1.6;
        }
    
        .footer {
          margin-top: 20px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Notificação de Orientação de Projeto</h2>
        <p>Prezado(a) Professor(a),</p>
        <p>Você foi selecionado como orientador do projeto:</p>
        <h2>"${tituloProjeto}"</h2>
        <p>Fique à vontade para entrar na plataforma de catalogação. Entre em contato com os autores e discuta os próximos passos do projeto.</p>
        <p>Agradecemos pela sua contribuição como orientador.</p>
        <div class="footer">
          <p>Atenciosamente,<br>Ferramenta de Catalogação de Projetos</p>
        </div>
      </div>
    </body>
    </html> `
     
    const mailOptions = {
        from: process.env.EMAIL,
        to: destinatario,
        subject: assunto,
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso para:', destinatario);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw error;
    }
}




async function buscarProjetosPublicosPorTitulo(titulo, tema) {
    try {
        const connection = await connect(); // Conecta ao banco de dados

        const [rows] = await connection.query(dbQueries.SELECT_PROJETO_TITULO, [titulo, tema]);
        
        if (rows.length === 0) {
            return { success: false, message: 'Projeto não pode ser acessado ou não existe na base de dados' };
        }

        return { success: true, data: rows };
    } catch (error) {
        throw new Error('Erro ao buscar projetos públicos por título');
    }
}

//Função para buscar um projeto pelo ano de publicação do usuário
async function buscarProjetosPublicosPorAno(ano) {
    try {
        const connection = await connect(); // Conecta ao banco de dados

        const [rows] = await connection.query(dbQueries.SELECT_PROJETO_ANO_PUBLICACAO, [ano]);
        
        if (rows.length === 0) {
            return { success: false, message: 'Projeto não pode ser acessado ou não existe na base de dados' };
        }

        return { success: true, data: rows };
    } catch (error) {
        throw new Error('Erro ao buscar projetos públicos por ano de sua publicação');
    }
}

async function listarProjetos(usuarioId) {
    try {
        const connection = await connect(); // Conecta ao banco de dados
        const [rows] = await connection.query(dbQueries.SELECT_PROJETOS, [usuarioId]);
        
        if (rows.length === 0) {
            return { success: false, message: 'Projeto não pode ser acessado ou não existe na base de dados' };
        }

       
        return { success: true, data: rows };
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

        const  projeto = rows[0];
       
        return { success: true, data: projeto };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Projeto não encontrado' };
    }
}

// Função para listar um projeto por ID 
async function listarProjetoPorIdDaPessoa(projetoId, pessoaId) {
    const connection = await connect(); 
    try {
        // Consulta para verificar se a pessoa está relacionada ao projeto
        const [relacionadaRows] = await connection.query(dbQueries.VERIFICA_PESSOA_PROJETO, [projetoId, pessoaId, projetoId, pessoaId]);

        if (relacionadaRows.length === 0) {
            return { success: false, message: 'Você não tem permissão para acessar este projeto' };
        }

        const [rows] = await connection.query(dbQueries.SELECT_PROJETO_POR_ID_PESSOA, [projetoId, pessoaId]);

        if (rows.length === 0) {
            return { success: false, message: 'Projeto não encontrado' };
        }
        
        const projeto = rows[0]; 
        
        return { success: true, data: projeto };
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
        //const projetos = (rows);
        const  projeto = rows[0];
        return { success: true, data: projeto };
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
    logo_projeto,
    alunos,
    professores,
    ano_publicacao 
}) {
    const connection = await connect(); // Conecta ao banco de dados

    try {
        // Verifica se o projeto com o projetoId existe no banco de dados
        const [projetoExists] = await connection.query(dbQueries.VERIFICA_PROJETO, [projetoId]);

        // Se o projeto não existe, lança uma exceção
        if (projetoExists.length === 0) {
            throw new Error('Projeto não encontrado');
        }

        await connection.query(dbQueries.UPDATE_PROJETO, [
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
            logo_projeto,
            ano_publicacao,
            projetoId
        ]);

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

        return { success: true, message: 'Projeto atualizado com sucesso!' };
    } catch (error) {
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
    buscarProjetosPublicosPorTitulo,
    listarProjetos,
    listarProjetoPorId,
    buscarProjetosPublicosPorAno,
    listarProjetoPorIdDaPessoa,
    listarProjetosPorCurso,
    atualizarProjeto,
    deletarProjeto
};