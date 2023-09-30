# API Ferramenta de Projeto

Este é o README da API Ferramenta de Projeto, uma ferramenta que oferece funcionalidades como catalogação de projetos e controle de tarefas. Para a Escola Técnica Estadual Monteiro Lobato 

## Descrição

A API Ferramenta de Projeto foi desenvolvida para facilitar a catalogação de projetos e o controle de tarefas relacionadas a esses projetos. Ela oferece uma maneira eficiente de gerenciar informações sobre projetos e colaboradores.

## Uso da API

Esta API oferece os seguintes endpoints principais:

- `/user`: Obtém informações do usuário.
- `/user/login`: Realiza o login do usuário.
- `/projeto/adiciona`: Cria um novo projeto.
- `/projeto/listar`: Lista todos os projetos.
- `/projeto/listar/{id}`: Lista um projeto por ID.
- `/projeto/mostra`: Lista os projetos na tela de visitantes (Ainda em desenvolvimento).
- `/projeto/atualiza/{id}`: Atualiza um projeto por ID.
- `/projeto/delete/{id}`: Deleta um projeto por ID.

## Requisitos de Instalação

Para instalar e executar o projeto, siga estas etapas:

1. Certifique-se de ter acesso a um servidor onde a API está hospedada.

2. Para usar os endpoints protegidos, é necessário autenticar com um token de autenticação JWT.

3. Execute os seguintes comandos no seu terminal:

   ```bash
   # Instale as dependências
   npm install

   # Inicie o servidor
   npm start

## Documentação Adicional

Para obter mais informações e detalhes sobre como usar a API, consulte a [documentação completa](https://api-thesistrack.onrender.com/api-docs/).

## Contato

- Email: [gustavobn509@gmail.com](mailto:gustavobn509@gmail.com)
