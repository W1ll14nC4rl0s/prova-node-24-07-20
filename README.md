### Avaliação Hellper
    Segue meu projeto crud de usuarios, onde é possivel incluir, pesquisar, alterar e deletar usuarios,
    o projeto disponibiliza tambem a criação de usuários administradores que são autorizados via token a consumir os serviços.
    O projeto esta no Docker Hub disponivel para execução atraves do Docker-compose que se encontra neste projeto.
    Caso haja a necessidade de subir a aplicação fora do docker é necessario ter em operação o banco de dados Postgres e alterar as variaveis de ambiente do projeto. 

### Rodando o projeto

`docker-compose up`

### rodando os testes

    No docker-compose esta comentando o comando que realiza chamada aos scripts de testes
    os testes abrangem : 
    -Conexão com o Banco de Dados Postgres
    -inclução de novo usuario
    -alteração e delete
    - testes de rotas 