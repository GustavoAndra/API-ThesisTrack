# API Ferramenta de Projeto

Este é o README da API Ferramenta de Projeto, uma ferramenta que oferece funcionalidades como catalogação de projetos e controle de tarefas. Para a Escola Técnica Estadual Monteiro Lobato 

## Descrição

A API Ferramenta de Projeto foi desenvolvida para facilitar a catalogação de projetos e o controle de tarefas relacionadas a esses projetos. Ela oferece uma maneira eficiente de gerenciar informações sobre projetos e colaboradores.

## Uso da API

Esta API oferece os seguintes endpoints principais:

Usuários

- `/user`: Obtém informações do usuário.
- `/user/login`: Realiza o login do usuário.
- `/user/reset-password/request`: Solicita código de verificação por e-mail para redefinição de senha.
- `/user/update-profile`: Atualiza o perfil do usuário (nome, email ou senha).

Projetos

- `/projeto/listar`: Lista todos os projetos.
- `/projeto/listar/{id}`: Lista um projeto por ID.
- `projeto/listar/{projetoId}/pessoa/{id}`: Lista projetos da pessoa relacionada.
- `/lista/aluno/curso/:id`: Lista projetos da pessoa do seu respectivo curso.
-  `/buscar-projetos?titulo=jogo`: Busca todos os projetos de acordo com o título.
-  `/buscar-projetos/ano?ano=2023`: Busca todos os projetos de acordo com o ano.
- `/projeto/adiciona`: Cria um novo projeto.
- `/projeto/atualiza/{id}`: Atualiza um projeto por ID.
- `/projeto/delete/{id}`: Deleta um projeto por ID.

## Requisitos de Instalação

Para instalar e executar o projeto, siga estas etapas:

1. Certifique-se de ter acesso a um servidor onde a API está hospedada.

2. Para usar os endpoints protegidos, é necessário autenticar-se com um token de autenticação JWT.

3. Execute os seguintes comandos no seu terminal:

   ```bash
   # Instale as dependências
   npm install

   # Inicie o servidor
   npm start

## Documentação Adicional

Para obter mais informações e detalhes sobre como usar a API, consulte a [documentação completa](https://api-thesis-track.vercel.app/api-docs/).

## Contato

- Email: [gustavobn509@gmail.com](mailto:gustavobn509@gmail.com)
